import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';

const router = Router();

// GET /store/settlements/merchant — merchant settlement history
router.get('/merchant', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });

    const settlements = await prisma.settlement.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: 'desc' },
    });

    // Compute pending balance (DELIVERED orders not yet in a settlement)
    const unSettledOrders = await prisma.storeOrder.findMany({
      where: { merchantId: merchant.id, status: 'DELIVERED', settlementId: null },
    });
    const pendingBalance = unSettledOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({ settlements, pendingBalance: parseFloat(pendingBalance.toFixed(2)) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /store/settlements/run — admin only: trigger batch
router.post('/run', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required.' });

    const { periodStart, periodEnd } = req.body;
    if (!periodStart || !periodEnd) return res.status(400).json({ error: 'periodStart and periodEnd required.' });

    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    // Find all delivered orders in period without a settlement
    const orders = await prisma.storeOrder.findMany({
      where: {
        status: 'DELIVERED',
        settlementId: null,
        deliveredAt: { gte: start, lte: end },
      },
    });

    // Group by merchant
    const byMerchant: Record<string, typeof orders> = {};
    for (const order of orders) {
      if (!byMerchant[order.merchantId]) byMerchant[order.merchantId] = [];
      byMerchant[order.merchantId].push(order);
    }

    const results = [];
    for (const [merchantId, merchantOrders] of Object.entries(byMerchant)) {
      const gross = merchantOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const netPayout = parseFloat(gross.toFixed(2));

      const settlement = await prisma.$transaction(async (tx: any) => {
        const s = await tx.settlement.create({
          data: {
            merchantId,
            periodStart: start,
            periodEnd: end,
            totalOrders: merchantOrders.length,
            grossRevenue: gross,
            platformFee: 0,
            netPayout,
            status: 'PROCESSING',
          },
        });

        // Link orders to settlement
        await tx.storeOrder.updateMany({
          where: { id: { in: merchantOrders.map(o => o.id) } },
          data: { settlementId: s.id },
        });

        // Credit merchant wallet
        const merchant = await tx.merchantProfile.findUnique({ where: { id: merchantId }, include: { user: true } });
        let wallet = await tx.wallet.findUnique({ where: { userId: merchant!.userId } });
        if (!wallet) wallet = await tx.wallet.create({ data: { userId: merchant!.userId } });
        await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: netPayout }, totalEarned: { increment: netPayout } } });
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'CREDIT',
            amount: netPayout,
            description: `Settlement: ${merchantOrders.length} orders (${start.toLocaleDateString()} – ${end.toLocaleDateString()})`,
            metadata: { source: 'merchant_settlement', settlementId: s.id, periodStart: start, periodEnd: end },
          },
        });

        await tx.settlement.update({ where: { id: s.id }, data: { status: 'PROCESSED', processedAt: new Date() } });

        // Notify merchant
        const { getIO } = require('../../index');
        try { getIO().to(`merchant:${merchantId}`).emit('settlement:processed', { settlementId: s.id, netPayout }); } catch (_) {}

        return s;
      });
      results.push(settlement);
    }

    res.json({ success: true, settlementsProcessed: results.length, results });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/settlements/:id — settlement detail
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const settlement = await prisma.settlement.findUnique({
      where: { id: req.params.id },
      include: { orders: { include: { items: true } } },
    });
    if (!settlement) return res.status(404).json({ error: 'Settlement not found.' });

    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (req.user.role !== 'ADMIN' && merchant?.id !== settlement.merchantId) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }
    res.json(settlement);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
