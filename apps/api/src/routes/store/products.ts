import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';
import multer from 'multer';
import { parse } from 'csv-parse/sync';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// GET /store/products?merchantId= — public
router.get('/', async (req, res) => {
  try {
    const { merchantId, categoryId, search } = req.query;
    if (!merchantId) return res.status(400).json({ error: 'merchantId required.' });

    const where: any = { merchantId: merchantId as string, isActive: true };
    if (categoryId) where.categoryId = categoryId as string;
    if (search) where.name = { contains: search as string, mode: 'insensitive' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' },
    });
    res.json(products);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /store/products — merchant only
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });

    const { name, description, imageUrl, price, mrp, unit, stock, categoryId, sku, barcode } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'name and price are required.' });

    const product = await prisma.product.create({
      data: {
        merchantId: merchant.id,
        name, description, imageUrl,
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : null,
        unit: unit || 'piece',
        stock: parseInt(stock) || 0,
        categoryId: categoryId || null,
        sku, barcode,
      },
    });
    res.json({ success: true, product });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/products/:id — merchant only
router.patch('/:id', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });

    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || product.merchantId !== merchant.id) return res.status(403).json({ error: 'Unauthorized.' });

    const allowed = ['name', 'description', 'imageUrl', 'price', 'mrp', 'unit', 'stock', 'categoryId', 'isActive', 'sku', 'barcode', 'lowStockThreshold'];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.mrp) updates.mrp = parseFloat(updates.mrp);
    if (updates.stock) updates.stock = parseInt(updates.stock);

    const updated = await prisma.product.update({ where: { id: product.id }, data: updates });
    res.json({ success: true, product: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /store/products/:id — merchant only
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });

    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || product.merchantId !== merchant.id) return res.status(403).json({ error: 'Unauthorized.' });

    // Soft delete — mark inactive
    await prisma.product.update({ where: { id: product.id }, data: { isActive: false } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /store/products/bulk-import — CSV upload
router.post('/bulk-import', authenticateToken, upload.single('file'), async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(403).json({ error: 'Merchant profile required.' });
    if (!req.file) return res.status(400).json({ error: 'CSV file required.' });

    const records = parse(req.file.buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as any[];

    let created = 0, updated = 0, skipped = 0;
    const errors: string[] = [];

    for (const row of records) {
      try {
        if (!row.name || !row.price) { skipped++; errors.push(`Row skipped: missing name/price — "${row.name || 'unnamed'}"`); continue; }

        // Resolve category by slug or name
        let categoryId: string | null = null;
        if (row.category_slug) {
          const cat = await prisma.productCategory.findUnique({ where: { slug: row.category_slug } });
          if (cat) categoryId = cat.id;
        }

        const existing = row.sku ? await prisma.product.findFirst({ where: { merchantId: merchant.id, sku: row.sku } }) : null;

        if (existing) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              name: row.name, description: row.description || null,
              imageUrl: row.image_url || null, price: parseFloat(row.price),
              mrp: row.mrp ? parseFloat(row.mrp) : null,
              unit: row.unit || 'piece', stock: row.stock ? parseInt(row.stock) : 0,
              categoryId, isActive: true,
            },
          });
          updated++;
        } else {
          await prisma.product.create({
            data: {
              merchantId: merchant.id, name: row.name, description: row.description || null,
              imageUrl: row.image_url || null, price: parseFloat(row.price),
              mrp: row.mrp ? parseFloat(row.mrp) : null,
              unit: row.unit || 'piece', stock: row.stock ? parseInt(row.stock) : 0,
              categoryId, sku: row.sku || null, isActive: true,
            },
          });
          created++;
        }
      } catch (rowErr: any) {
        skipped++;
        errors.push(`Row error "${row.name}": ${rowErr.message}`);
      }
    }

    res.json({ success: true, created, updated, skipped, errors });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Haversine distance in km
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /store/products/nearby?lat=&lng=&radius=&categoryId=&search=
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius, categoryId, search } = req.query;
    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const radiusKm = parseFloat(radius as string) || 15;

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ error: 'lat and lng are required.' });
    }

    // 1. Find approved merchants nearby
    const merchants = await prisma.merchantProfile.findMany({
      where: { status: 'APPROVED' },
    });

    const nearbyMerchants = merchants
      .map((m) => ({
        ...m,
        distanceKm: haversineKm(userLat, userLng, m.latitude, m.longitude),
      }))
      .filter((m) => m.distanceKm <= radiusKm && m.distanceKm <= m.maxDeliveryRadiusKm);

    if (nearbyMerchants.length === 0) {
       return res.json([]); 
    }

    const merchantIds = nearbyMerchants.map(m => m.id);

    // 2. Query products for these merchants
    const where: any = { merchantId: { in: merchantIds }, isActive: true, stock: { gt: 0 } };
    if (categoryId) where.categoryId = categoryId as string;
    if (search) where.name = { contains: search as string, mode: 'insensitive' };

    const products = await prisma.product.findMany({
      where,
      include: { 
         category: true,
         merchant: {
            select: { id: true, storeName: true } 
         } 
      },
      take: 100 // limit to top 100 for performance
    });

    // 3. Patch merchant distance onto products and return
    const formattedProducts = products.map(p => {
       const m = nearbyMerchants.find(nm => nm.id === p.merchantId);
       return {
          ...p,
          merchant: {
             ...p.merchant,
             distanceKm: m?.distanceKm || 0
          }
       };
    });

    res.json(formattedProducts);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
