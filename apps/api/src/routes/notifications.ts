import { Router } from 'express';
import { prisma } from '../db';
import { authenticateToken } from './auth';

const router = Router();

// Get active notifications
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(notifications);
    } catch (e: any) {
        if (!process.env.DATABASE_URL || e.message.includes("PrismaClient")) {
             return res.json([]);
        }
        res.status(500).json({ error: e.message || "Failed to fetch notifications" });
    }
});

// Mark all as read
router.post('/mark-read', authenticateToken, async (req: any, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true, readAt: new Date() }
        });
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message || "Failed to mark as read" });
    }
});

export default router;
