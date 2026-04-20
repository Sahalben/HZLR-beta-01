import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';

const router = Router();

// POST /store/delivery/opt-in — worker opts in as delivery partner
router.post('/opt-in', authenticateToken, async (req: any, res) => {
  try {
    const { vehicleType } = req.body;
    const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: req.user.id } });
    if (!workerProfile) return res.status(403).json({ error: 'Worker profile required to become a delivery partner.' });

    await prisma.workerProfile.update({ where: { id: workerProfile.id }, data: { isDeliveryPartner: true } });
    const mode = await prisma.deliveryPartnerMode.upsert({
      where: { workerProfileId: workerProfile.id },
      update: { vehicleType: vehicleType || 'two-wheeler' },
      create: { workerProfileId: workerProfile.id, vehicleType: vehicleType || 'two-wheeler', isOnline: false },
    });
    res.json({ success: true, deliveryPartnerMode: mode });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/delivery/availability — toggle online/offline
router.patch('/availability', authenticateToken, async (req: any, res) => {
  try {
    const { isOnline, currentLat, currentLng } = req.body;
    const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: req.user.id } });
    if (!workerProfile?.isDeliveryPartner) return res.status(403).json({ error: 'Not a delivery partner.' });

    const mode = await prisma.deliveryPartnerMode.update({
      where: { workerProfileId: workerProfile.id },
      data: {
        isOnline: Boolean(isOnline),
        currentLat: currentLat ? parseFloat(currentLat) : undefined,
        currentLng: currentLng ? parseFloat(currentLng) : undefined,
        lastSeenAt: new Date(),
      },
    });
    res.json({ success: true, isOnline: mode.isOnline });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/delivery/assignments — my assignments
router.get('/assignments', authenticateToken, async (req: any, res) => {
  try {
    const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: req.user.id } });
    if (!workerProfile?.isDeliveryPartner) return res.status(403).json({ error: 'Not a delivery partner.' });

    const partnerMode = await prisma.deliveryPartnerMode.findUnique({ where: { workerProfileId: workerProfile.id } });
    if (!partnerMode) return res.status(404).json({ error: 'Delivery partner mode not found.' });

    const assignments = await prisma.deliveryAssignment.findMany({
      where: { deliveryPartnerId: partnerMode.id },
      include: {
        order: {
          include: {
            merchant: { select: { storeName: true, address: true, latitude: true, longitude: true } },
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(assignments);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/delivery/assignments/:id/accept
router.patch('/assignments/:id/accept', authenticateToken, async (req: any, res) => {
  try {
    const assignment = await prisma.deliveryAssignment.findUnique({
      where: { id: req.params.id },
      include: { deliveryPartner: { include: { workerProfile: true } } },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    if (assignment.deliveryPartner.workerProfile.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });
    if (assignment.status !== 'PENDING') return res.status(400).json({ error: 'Assignment is no longer available.' });

    const [updatedAssignment] = await prisma.$transaction([
      prisma.deliveryAssignment.update({ where: { id: assignment.id }, data: { status: 'ACCEPTED', acceptedAt: new Date() } }),
      prisma.storeOrder.update({ where: { id: assignment.orderId }, data: { status: 'ASSIGNED', assignedAt: new Date() } }),
    ]);

    // Notify customer + merchant
    const { getIO } = require('../../index');
    try {
      const io = getIO();
      io.to(`order:${assignment.orderId}`).emit('dispatch:accepted', { assignmentId: assignment.id, partnerName: req.user.id });
      io.to(`order:${assignment.orderId}`).emit('order:status', { orderId: assignment.orderId, status: 'ASSIGNED' });
    } catch (_) {}

    res.json({ success: true, assignment: updatedAssignment });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/delivery/assignments/:id/decline
router.patch('/assignments/:id/decline', authenticateToken, async (req: any, res) => {
  try {
    const { declineReason } = req.body;
    const assignment = await prisma.deliveryAssignment.findUnique({
      where: { id: req.params.id },
      include: { deliveryPartner: { include: { workerProfile: true } } },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    if (assignment.deliveryPartner.workerProfile.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });

    await prisma.deliveryAssignment.update({
      where: { id: assignment.id },
      data: { status: 'DECLINED', declinedAt: new Date(), declineReason },
    });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/delivery/assignments/:id/picked-up
router.patch('/assignments/:id/picked-up', authenticateToken, async (req: any, res) => {
  try {
    const assignment = await prisma.deliveryAssignment.findUnique({
      where: { id: req.params.id },
      include: { deliveryPartner: { include: { workerProfile: true } } },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    if (assignment.deliveryPartner.workerProfile.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });

    const [updatedAssignment] = await prisma.$transaction([
      prisma.deliveryAssignment.update({ where: { id: assignment.id }, data: { pickedUpAt: new Date() } }),
      prisma.storeOrder.update({ where: { id: assignment.orderId }, data: { status: 'OUT_FOR_DELIVERY' } }),
    ]);

    const { getIO } = require('../../index');
    try {
      getIO().to(`order:${assignment.orderId}`).emit('order:status', { orderId: assignment.orderId, status: 'OUT_FOR_DELIVERY' });
    } catch (_) {}

    res.json({ success: true, assignment: updatedAssignment });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/delivery/assignments/:id/delivered — mark delivered + credit wallet
router.patch('/assignments/:id/delivered', authenticateToken, async (req: any, res) => {
  try {
    const assignment = await prisma.deliveryAssignment.findUnique({
      where: { id: req.params.id },
      include: {
        deliveryPartner: { include: { workerProfile: { include: { user: true } } } },
        order: true,
      },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    if (assignment.deliveryPartner.workerProfile.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });
    if (assignment.status !== 'ACCEPTED') return res.status(400).json({ error: 'Assignment must be in ACCEPTED state.' });

    await prisma.$transaction(async (tx: any) => {
      // Mark assignment + order as delivered
      await tx.deliveryAssignment.update({ where: { id: assignment.id }, data: { status: 'COMPLETED', deliveredAt: new Date() } });
      await tx.storeOrder.update({ where: { id: assignment.orderId }, data: { status: 'DELIVERED', deliveredAt: new Date() } });

      // Credit earning to delivery partner wallet (immediate)
      const earning = assignment.totalEarning || 0;
      if (earning > 0) {
        let wallet = await tx.wallet.findUnique({ where: { userId: assignment.deliveryPartner.workerProfile.userId } });
        if (!wallet) wallet = await tx.wallet.create({ data: { userId: assignment.deliveryPartner.workerProfile.userId } });
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: earning }, totalEarned: { increment: earning } },
        });
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'CREDIT',
            amount: earning,
            description: `Delivery fee for order #${assignment.orderId.slice(-6)}`,
            metadata: { source: 'store_delivery', orderId: assignment.orderId, distanceKm: assignment.distanceKm },
          },
        });
      }

      // Update delivery partner stats
      await tx.deliveryPartnerMode.update({
        where: { id: assignment.deliveryPartnerId },
        data: { totalDeliveries: { increment: 1 }, totalEarned: { increment: earning } },
      });

      // Update merchant order count
      await tx.merchantProfile.update({
        where: { id: assignment.order.merchantId },
        data: { totalOrders: { increment: 1 } },
      });
    });

    const { getIO } = require('../../index');
    try {
      getIO().to(`order:${assignment.orderId}`).emit('order:status', { orderId: assignment.orderId, status: 'DELIVERED' });
    } catch (_) {}

    res.json({ success: true, earning: assignment.totalEarning });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
