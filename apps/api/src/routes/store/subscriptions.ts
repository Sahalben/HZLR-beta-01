import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';

const router = Router();

// POST /store/subscriptions/merchant — subscribe/renew
router.post('/merchant', authenticateToken, async (req: any, res) => {
  try {
    const { planName, monthlyFee, razorpaySubId } = req.body;
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });

    const nextDueAt = new Date();
    nextDueAt.setMonth(nextDueAt.getMonth() + 1);

    const sub = await prisma.merchantSubscription.upsert({
      where: { merchantId: merchant.id },
      update: { status: 'ACTIVE', lastPaidAt: new Date(), nextDueAt, razorpaySubId },
      create: {
        merchantId: merchant.id,
        planName: planName || 'standard',
        monthlyFee: parseFloat(monthlyFee) || 499,
        status: 'ACTIVE',
        nextDueAt,
        lastPaidAt: new Date(),
        razorpaySubId,
      },
    });
    res.json({ success: true, subscription: sub });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /store/subscriptions/delivery-partner — subscribe/renew
router.post('/delivery-partner', authenticateToken, async (req: any, res) => {
  try {
    const { monthlyFee, razorpaySubId } = req.body;
    const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: req.user.id } });
    if (!workerProfile?.isDeliveryPartner) return res.status(403).json({ error: 'Must be an opted-in delivery partner.' });

    const partnerMode = await prisma.deliveryPartnerMode.findUnique({ where: { workerProfileId: workerProfile.id } });
    if (!partnerMode) return res.status(404).json({ error: 'Delivery partner mode not found.' });

    const nextDueAt = new Date();
    nextDueAt.setMonth(nextDueAt.getMonth() + 1);

    const sub = await prisma.deliverySubPayment.upsert({
      where: { deliveryPartnerId: partnerMode.id },
      update: { status: 'ACTIVE', lastPaidAt: new Date(), nextDueAt, razorpaySubId },
      create: {
        deliveryPartnerId: partnerMode.id,
        monthlyFee: parseFloat(monthlyFee) || 199,
        status: 'ACTIVE',
        nextDueAt,
        lastPaidAt: new Date(),
        razorpaySubId,
      },
    });
    res.json({ success: true, subscription: sub });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/subscriptions/status — check active subscription
router.get('/status', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({
      where: { userId: req.user.id },
      include: { subscription: true },
    });
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId: req.user.id },
      include: { deliveryPartnerMode: { include: { subscription: true } } },
    });

    res.json({
      merchantSubscription: merchant?.subscription || null,
      deliveryPartnerSubscription: workerProfile?.deliveryPartnerMode?.subscription || null,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /store/subscriptions/razorpay/webhook — subscription payment confirmation
router.post('/razorpay/webhook', async (req, res) => {
  try {
    const { event, payload } = req.body;
    if (event === 'subscription.charged') {
      const subId = payload?.subscription?.entity?.id;
      if (subId) {
        const nextDue = new Date();
        nextDue.setMonth(nextDue.getMonth() + 1);
        await prisma.merchantSubscription.updateMany({
          where: { razorpaySubId: subId },
          data: { lastPaidAt: new Date(), nextDueAt: nextDue, status: 'ACTIVE' },
        });
        await prisma.deliverySubPayment.updateMany({
          where: { razorpaySubId: subId },
          data: { lastPaidAt: new Date(), nextDueAt: nextDue, status: 'ACTIVE' },
        });
      }
    }
    res.json({ received: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
