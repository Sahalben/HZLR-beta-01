import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';
import { dispatchOrder } from '../../services/dispatch';

const router = Router();

// Haversine distance in km
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Compute delivery fee from config + distance
async function computeDeliveryFee(distanceKm: number, orderTotal: number): Promise<number> {
  const config = await prisma.deliveryFeeConfig.findFirst({ where: { isActive: true } });
  if (!config) return 30; // default fallback
  const brackets = config.sizeBrackets as { min_order: number; max_order: number; bonus: number }[];
  const bracket = brackets.find(b => orderTotal >= b.min_order && orderTotal < b.max_order) || { bonus: 0 };
  return parseFloat((config.baseFee + config.ratePerKm * distanceKm + bracket.bonus).toFixed(2));
}

// POST /store/orders — place order
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { merchantId, paymentMethod, deliveryAddress, deliveryLat, deliveryLng } = req.body;
    if (!merchantId || !paymentMethod || !deliveryAddress) {
      return res.status(400).json({ error: 'merchantId, paymentMethod, deliveryAddress required.' });
    }

    const merchant = await prisma.merchantProfile.findUnique({ where: { id: merchantId } });
    if (!merchant || merchant.status !== 'APPROVED') return res.status(404).json({ error: 'Store not found.' });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty.' });

    // Validate all items belong to this merchant
    const wrongItem = cart.items.find(i => i.product.merchantId !== merchantId);
    if (wrongItem) return res.status(400).json({ error: 'Cart items do not match selected merchant.' });

    const subtotal = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
    if (subtotal < merchant.minOrderValue) {
      return res.status(400).json({ error: `Minimum order value is ₹${merchant.minOrderValue}.` });
    }

    // Compute delivery fee
    const dLat = parseFloat(deliveryLat) || merchant.latitude;
    const dLng = parseFloat(deliveryLng) || merchant.longitude;
    const distanceKm = haversineKm(merchant.latitude, merchant.longitude, dLat, dLng);
    let deliveryFee = await computeDeliveryFee(distanceKm, subtotal);
    if (merchant.freeDeliveryThreshold && subtotal >= merchant.freeDeliveryThreshold) deliveryFee = 0;
    const totalAmount = parseFloat((subtotal + deliveryFee).toFixed(2));

    const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.storeOrder.create({
        data: {
          userId: req.user.id,
          merchantId,
          status: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING_PAYMENT',
          paymentMethod,
          subtotal, deliveryFee, totalAmount,
          deliveryAddress,
          deliveryLat: dLat, deliveryLng: dLng,
          items: {
            create: cart.items.map(i => ({
              productId: i.productId,
              productName: i.product.name,
              quantity: i.quantity,
              unitPrice: i.priceAtAdd,
              totalPrice: i.priceAtAdd * i.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    // Emit new order to merchant socket room
    const { getIO } = require('../../index');
    try {
      const io = getIO();
      io.to(`merchant:${merchantId}`).emit('order:new', {
        orderId: order.id,
        customerName: req.user.id,
        total: totalAmount,
        paymentMethod,
        itemCount: order.items.length,
      });
    } catch (_) {}

    // If COD → trigger dispatch immediately
    if (paymentMethod === 'COD') {
      dispatchOrder(order.id, merchant, dLat, dLng).catch(console.error);
    }

    res.json({ success: true, order });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/orders/my — customer order history
router.get('/my', authenticateToken, async (req: any, res) => {
  try {
    const orders = await prisma.storeOrder.findMany({
      where: { userId: req.user.id },
      include: {
        merchant: { select: { id: true, storeName: true, logoUrl: true } },
        items: { include: { product: { select: { name: true, imageUrl: true } } } },
        assignment: { include: { deliveryPartner: { include: { workerProfile: { include: { user: true } } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/orders/merchant — merchant incoming orders
router.get('/merchant', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });

    const orders = await prisma.storeOrder.findMany({
      where: { merchantId: merchant.id },
      include: {
        items: true,
        assignment: { include: { deliveryPartner: { include: { workerProfile: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/orders/:id — order detail
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const order = await prisma.storeOrder.findUnique({
      where: { id: req.params.id },
      include: {
        merchant: { select: { id: true, storeName: true, logoUrl: true, address: true, latitude: true, longitude: true } },
        items: true,
        assignment: { include: { deliveryPartner: { include: { workerProfile: { include: { user: true } } } } } },
      },
    });
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    const isOwner = order.userId === req.user.id;
    const isMerchant = merchant?.id === order.merchantId;
    const isDeliveryPartner = order.assignment?.deliveryPartner?.workerProfile?.userId === req.user.id;

    if (!isOwner && !isMerchant && !isDeliveryPartner) return res.status(403).json({ error: 'Unauthorized.' });

    res.json(order);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/orders/:id/status — merchant updates order status
router.patch('/:id/status', authenticateToken, async (req: any, res) => {
  try {
    const { status } = req.body;
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });

    const order = await prisma.storeOrder.findUnique({ where: { id: req.params.id } });
    if (!order || order.merchantId !== merchant.id) return res.status(403).json({ error: 'Unauthorized.' });

    const timestamps: any = {};
    if (status === 'PREPARING') timestamps.preparedAt = new Date();
    if (status === 'READY_FOR_PICKUP') {
      timestamps.readyAt = new Date();
      // Trigger dispatch now that order is ready
      dispatchOrder(order.id, merchant, order.deliveryLat || merchant.latitude, order.deliveryLng || merchant.longitude).catch(console.error);
    }

    const updated = await prisma.storeOrder.update({ where: { id: order.id }, data: { status, ...timestamps } });

    // Notify customer
    const { getIO } = require('../../index');
    try {
      const io = getIO();
      io.to(`order:${order.id}`).emit('order:status', { orderId: order.id, status });
    } catch (_) {}

    res.json({ success: true, order: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /store/orders/:id/cancel
router.post('/:id/cancel', authenticateToken, async (req: any, res) => {
  try {
    const { cancelReason } = req.body;
    const order = await prisma.storeOrder.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    const isOwner = order.userId === req.user.id;
    const isMerchant = merchant?.id === order.merchantId;
    if (!isOwner && !isMerchant) return res.status(403).json({ error: 'Unauthorized.' });

    if (['DELIVERED', 'OUT_FOR_DELIVERY'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel an order that is out for delivery or delivered.' });
    }

    const updated = await prisma.storeOrder.update({
      where: { id: order.id },
      data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason },
    });
    res.json({ success: true, order: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /store/orders/razorpay/webhook — payment confirmation
router.post('/razorpay/webhook', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, event } = req.body;
    if (event === 'payment.captured' && razorpay_order_id) {
      const order = await prisma.storeOrder.findFirst({ where: { razorpayOrderId: razorpay_order_id } });
      if (order && order.status === 'PENDING_PAYMENT') {
        const updated = await prisma.storeOrder.update({
          where: { id: order.id },
          data: { status: 'CONFIRMED', razorpayPaymentId: razorpay_payment_id, confirmedAt: new Date() },
          include: { merchant: true },
        });

        // Notify merchant
        const { getIO } = require('../../index');
        try {
          const io = getIO();
          io.to(`merchant:${order.merchantId}`).emit('order:new', { orderId: order.id, total: order.totalAmount });
        } catch (_) {}

        // Trigger dispatch
        dispatchOrder(order.id, updated.merchant, order.deliveryLat || updated.merchant.latitude, order.deliveryLng || updated.merchant.longitude).catch(console.error);
      }
    }
    res.json({ received: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
