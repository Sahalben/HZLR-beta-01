import { Router } from 'express';
import { prisma } from '../../db';

const router = Router();

// GET /api/v1/store/categories — public, no auth
router.get('/', async (req, res) => {
  try {
    const parents = await prisma.productCategory.findMany({
      where: { parentId: null },
      include: { children: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(parents);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
