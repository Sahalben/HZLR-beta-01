import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';
import crypto from 'crypto';

const router = Router();

// GET /store/admin/merchants/pending — list PENDING_APPROVAL merchants
router.get('/merchants/pending', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only.' });
    const merchants = await prisma.merchantProfile.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: { user: { select: { email: true, phone: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json(merchants);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/admin/merchants/:id/approve
router.patch('/merchants/:id/approve', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only.' });
    const merchant = await prisma.merchantProfile.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED', approvedAt: new Date(), approvedBy: req.user.id },
    });
    // Notify merchant
    const { getIO } = require('../../index');
    try { getIO().to(`merchant:${merchant.id}`).emit('merchant:approved', { merchantId: merchant.id }); } catch (_) {}
    res.json({ success: true, merchant });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/admin/merchants/:id/suspend
router.patch('/merchants/:id/suspend', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only.' });
    const { reason } = req.body;
    const merchant = await prisma.merchantProfile.update({
      where: { id: req.params.id },
      data: { status: 'SUSPENDED', suspendedAt: new Date(), suspendReason: reason || null },
    });
    res.json({ success: true, merchant });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/admin/delivery-fee-config
router.get('/delivery-fee-config', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only.' });
    const config = await prisma.deliveryFeeConfig.findFirst({ where: { isActive: true } });
    res.json(config);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/admin/delivery-fee-config
router.patch('/delivery-fee-config', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only.' });
    const { baseFee, ratePerKm, sizeBrackets } = req.body;
    const existing = await prisma.deliveryFeeConfig.findFirst({ where: { isActive: true } });
    let config;
    if (existing) {
      config = await prisma.deliveryFeeConfig.update({
        where: { id: existing.id },
        data: { baseFee: baseFee ?? existing.baseFee, ratePerKm: ratePerKm ?? existing.ratePerKm, sizeBrackets: sizeBrackets ?? existing.sizeBrackets },
      });
    } else {
      config = await prisma.deliveryFeeConfig.create({ data: { baseFee: baseFee || 20, ratePerKm: ratePerKm || 6, sizeBrackets: sizeBrackets || [] } });
    }
    res.json({ success: true, config });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
