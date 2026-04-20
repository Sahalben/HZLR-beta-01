import { prisma } from '../db';

// Haversine distance in km
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Compute delivery earning for a partner using admin-set config
async function computeEarning(distanceKm: number, orderTotal: number): Promise<{ baseFee: number; sizeBonus: number; totalEarning: number }> {
  const config = await prisma.deliveryFeeConfig.findFirst({ where: { isActive: true } });
  const baseFee = config?.baseFee ?? 20;
  const ratePerKm = config?.ratePerKm ?? 6;
  const brackets = (config?.sizeBrackets as { min_order: number; max_order: number; bonus: number }[]) ?? [];
  const bracket = brackets.find(b => orderTotal >= b.min_order && orderTotal < b.max_order) || { bonus: 0 };
  const distanceFee = ratePerKm * distanceKm;
  const totalEarning = parseFloat((baseFee + distanceFee + bracket.bonus).toFixed(2));
  return { baseFee: baseFee + distanceFee, sizeBonus: bracket.bonus, totalEarning };
}

// Main dispatch function — called when order is confirmed/ready
export async function dispatchOrder(
  orderId: string,
  merchant: { id: string; latitude: number; longitude: number; maxDeliveryRadiusKm: number },
  customerLat: number,
  customerLng: number
): Promise<void> {
  try {
    const order = await prisma.storeOrder.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) return;

    // Find all online delivery partners
    const partners = await prisma.deliveryPartnerMode.findMany({
      where: { isOnline: true },
      include: { workerProfile: { include: { user: true } } },
    });

    if (partners.length === 0) {
      console.log(`[Dispatch] No online partners for order ${orderId}`);
      return;
    }

    // Sort by distance to merchant (nearest first)
    const sorted = partners
      .filter(p => p.currentLat && p.currentLng)
      .map(p => ({
        ...p,
        distanceToMerchant: haversineKm(p.currentLat!, p.currentLng!, merchant.latitude, merchant.longitude),
        distanceToCustomer: haversineKm(merchant.latitude, merchant.longitude, customerLat, customerLng),
      }))
      .filter(p => p.distanceToMerchant <= merchant.maxDeliveryRadiusKm)
      .sort((a, b) => a.distanceToMerchant - b.distanceToMerchant);

    if (sorted.length === 0) {
      console.log(`[Dispatch] No partners within radius for order ${orderId}`);
      return;
    }

    // Try each partner in order
    await cascadeDispatch(orderId, order.totalAmount, customerLat, customerLng, sorted, 0);
  } catch (e) {
    console.error('[Dispatch] Error:', e);
  }
}

async function cascadeDispatch(
  orderId: string,
  orderTotal: number,
  customerLat: number,
  customerLng: number,
  partners: any[],
  index: number
): Promise<void> {
  if (index >= partners.length) {
    console.log(`[Dispatch] All partners exhausted for order ${orderId}`);
    return;
  }

  const partner = partners[index];
  const distanceKm = haversineKm(partner.currentLat, partner.currentLng, customerLat, customerLng);
  const { baseFee, sizeBonus, totalEarning } = await computeEarning(distanceKm, orderTotal);

  // Create PENDING assignment
  const assignment = await prisma.deliveryAssignment.create({
    data: {
      orderId,
      deliveryPartnerId: partner.id,
      status: 'PENDING',
      distanceKm,
      baseEarning: baseFee,
      sizeBonus,
      totalEarning,
      pushedAt: new Date(),
    },
  });

  // Push to partner via socket
  const { getIO } = require('../index');
  try {
    const io = getIO();
    const order = await prisma.storeOrder.findUnique({
      where: { id: orderId },
      include: { merchant: { select: { storeName: true, address: true } }, items: true },
    });
    io.to(`delivery:${partner.workerProfile.userId}`).emit('dispatch:push', {
      assignmentId: assignment.id,
      orderId,
      merchant: order?.merchant,
      customerLat, customerLng,
      distanceKm: distanceKm.toFixed(1),
      itemCount: order?.items.length,
      earning: totalEarning,
      timeout: 30,
    });
  } catch (_) {}

  // 30-second timeout — cascade to next if not accepted
  setTimeout(async () => {
    const current = await prisma.deliveryAssignment.findUnique({ where: { id: assignment.id } });
    if (current?.status === 'PENDING') {
      await prisma.deliveryAssignment.update({ where: { id: assignment.id }, data: { status: 'EXPIRED' } });
      console.log(`[Dispatch] Partner ${partner.id} timed out for order ${orderId}. Cascading...`);
      await cascadeDispatch(orderId, orderTotal, customerLat, customerLng, partners, index + 1);
    }
  }, 30_000);
}
