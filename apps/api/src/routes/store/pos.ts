import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';
import crypto from 'crypto';

const router = Router();

// POST /store/pos/petpooja/webhook — catalog sync push
router.post('/petpooja/webhook', async (req, res) => {
  try {
    // Verify HMAC signature
    const signature = req.headers['x-petpooja-signature'] as string;
    const body = JSON.stringify(req.body);

    // Find merchant by posMerchantId
    const { merchant_id: posMerchantId, event, items } = req.body;
    if (!posMerchantId) return res.status(400).json({ error: 'merchant_id required.' });

    const merchant = await prisma.merchantProfile.findFirst({ where: { posMerchantId } });
    if (!merchant) return res.status(404).json({ error: 'Merchant not found for this POS ID.' });

    // Verify HMAC if secret is set
    if (merchant.posWebhookSecret && signature) {
      const expected = crypto.createHmac('sha256', merchant.posWebhookSecret).update(body).digest('hex');
      if (expected !== signature) return res.status(401).json({ error: 'Invalid signature.' });
    }

    let itemsUpdated = 0;
    const errors: string[] = [];

    if (event === 'catalog.update' && Array.isArray(items)) {
      for (const item of items) {
        try {
          // Resolve category slug if provided
          let categoryId: string | null = null;
          if (item.category_slug) {
            const cat = await prisma.productCategory.findUnique({ where: { slug: item.category_slug } });
            if (cat) categoryId = cat.id;
          }

          await prisma.product.upsert({
            where: { merchantId_sku: { merchantId: merchant.id, sku: item.item_id || item.sku } } as any,
            update: {
              name: item.item_name || item.name,
              price: parseFloat(item.price) || 0,
              mrp: item.mrp ? parseFloat(item.mrp) : null,
              stock: item.stock !== undefined ? parseInt(item.stock) : undefined,
              isActive: item.active !== false,
              categoryId: categoryId || undefined,
            },
            create: {
              merchantId: merchant.id,
              name: item.item_name || item.name,
              price: parseFloat(item.price) || 0,
              mrp: item.mrp ? parseFloat(item.mrp) : null,
              stock: item.stock ? parseInt(item.stock) : 0,
              sku: item.item_id || item.sku,
              unit: item.unit || 'piece',
              categoryId,
              isActive: true,
            },
          });
          itemsUpdated++;
        } catch (err: any) {
          errors.push(`Item "${item.item_name}": ${err.message}`);
        }
      }
    }

    if (event === 'stock.update' && Array.isArray(items)) {
      for (const item of items) {
        try {
          await prisma.product.updateMany({
            where: { merchantId: merchant.id, sku: item.item_id || item.sku },
            data: { stock: parseInt(item.stock) },
          });
          itemsUpdated++;
        } catch (err: any) {
          errors.push(`Stock update "${item.item_id}": ${err.message}`);
        }
      }
    }

    // Log sync
    await prisma.posSync.create({
      data: {
        merchantId: merchant.id,
        posType: 'petpooja',
        itemsUpdated,
        status: errors.length === 0 ? 'success' : errors.length < itemsUpdated ? 'partial' : 'failed',
        errorMessage: errors.length > 0 ? errors.join('; ') : null,
      },
    });

    res.json({ received: true, itemsUpdated, errors });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/pos/sync-status — merchant: last sync info
router.get('/sync-status', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });

    const lastSync = await prisma.posSync.findFirst({
      where: { merchantId: merchant.id },
      orderBy: { syncedAt: 'desc' },
    });
    res.json(lastSync || { status: 'never_synced' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
