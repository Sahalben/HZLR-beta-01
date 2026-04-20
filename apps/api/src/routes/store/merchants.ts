import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';

const router = Router();

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

// POST /store/merchants/onboard — any authenticated user
router.post('/onboard', authenticateToken, async (req: any, res) => {
  try {
    const existing = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (existing) return res.status(400).json({ error: 'Merchant profile already exists.' });

    const {
      storeName, storeType, tagline, logoUrl, description,
      address, city, state, pincode, latitude, longitude,
      operatingHours, minOrderValue, maxDeliveryRadiusKm, freeDeliveryThreshold,
      posType, posMerchantId, upiId,
    } = req.body;

    const merchant = await prisma.merchantProfile.create({
      data: {
        userId: req.user.id,
        storeName, storeType, tagline, logoUrl, description,
        address, city, state: state || '', pincode,
        latitude: parseFloat(latitude), longitude: parseFloat(longitude),
        operatingHours: operatingHours || [],
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDeliveryRadiusKm: parseFloat(maxDeliveryRadiusKm) || 5,
        freeDeliveryThreshold: freeDeliveryThreshold ? parseFloat(freeDeliveryThreshold) : null,
        posType: posType || 'none',
        posMerchantId,
        upiId,
        status: 'PENDING_APPROVAL',
      },
    });

    res.json({ success: true, merchant });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/merchants/me — merchant dashboard data
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        subscription: true,
        _count: { select: { products: true, orders: true } },
      },
    });
    if (!merchant) return res.status(404).json({ error: 'Merchant profile not found.' });
    res.json(merchant);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/merchants/me — update store info
router.patch('/me', authenticateToken, async (req: any, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({ where: { userId: req.user.id } });
    if (!merchant) return res.status(404).json({ error: 'Merchant profile not found.' });

    const allowed = [
      'storeName', 'storeType', 'tagline', 'logoUrl', 'description',
      'address', 'city', 'state', 'pincode', 'latitude', 'longitude',
      'operatingHours', 'minOrderValue', 'maxDeliveryRadiusKm', 'freeDeliveryThreshold',
      'posType', 'posMerchantId', 'upiId',
    ];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updated = await prisma.merchantProfile.update({ where: { id: merchant.id }, data: updates });
    res.json({ success: true, merchant: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/merchants/nearby?lat=&lng=&radius= — customer browse, APPROVED only
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const radiusKm = parseFloat(radius as string) || 10;

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ error: 'lat and lng are required.' });
    }

    const merchants = await prisma.merchantProfile.findMany({
      where: { status: 'APPROVED' },
      include: { _count: { select: { products: true } } },
    });

    // Filter by radius and compute distance
    const nearby = merchants
      .map((m) => ({
        ...m,
        distanceKm: haversineKm(userLat, userLng, m.latitude, m.longitude),
      }))
      .filter((m) => m.distanceKm <= radiusKm && m.distanceKm <= m.maxDeliveryRadiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(nearby);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /store/merchants/:id — public store page
router.get('/:id', async (req, res) => {
  try {
    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { products: true, orders: true } } },
    });
    if (!merchant || merchant.status !== 'APPROVED') {
      return res.status(404).json({ error: 'Store not found.' });
    }
    res.json(merchant);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
