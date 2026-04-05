import { Router } from 'express';
import { prisma } from '../db';
import { authenticateToken } from './auth';

const router = Router();

// GET all conversations for the user
router.get('/my-conversations', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        
        // MVP: Just grab messages where they are sender or receiver
        // Real logic usually groups by the 'other' participant.
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                sender: { include: { employerProfile: true, businessProfile: true } },
                receiver: { include: { employerProfile: true, businessProfile: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Unique conversation maps
        const convos = new Map();

        messages.forEach(msg => {
            const isSender = msg.senderId === userId;
            const otherUserId = isSender ? msg.receiverId : msg.senderId;
            const otherUser = isSender ? msg.receiver : msg.sender;

            if (!convos.has(otherUserId)) {
                let name = 'Worker';
                let avatar = 'U';
                if (otherUser.employerProfile) {
                    name = `${otherUser.employerProfile.firstName}`;
                    avatar = otherUser.employerProfile.firstName.charAt(0);
                } else if (otherUser.businessProfile) {
                    name = otherUser.businessProfile.businessName;
                    avatar = otherUser.businessProfile.businessName.charAt(0);
                }

                convos.set(otherUserId, {
                    id: otherUserId,
                    employerName: name,
                    avatar,
                    lastMessage: msg.content,
                    time: msg.createdAt,
                    unread: !isSender && !msg.isRead
                });
            }
        });

        res.json(Array.from(convos.values()));
    } catch (error: any) {
        if (!process.env.DATABASE_URL || error.message.includes("PrismaClient")) {
             return res.json([]);
        }
        res.status(500).json({ error: error.message || 'Failed to retrieve messages' });
    }
});

// GET messages for a specific conversation
router.get('/conversation/:otherUserId', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.otherUserId;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' } // Oldest first for chat UI
        });

        const formatted = messages.map(msg => ({
            id: msg.id,
            sender: msg.senderId === userId ? (req.user.role === 'WORKER' ? 'worker' : 'employer') : 'employer',
            text: msg.content,
            time: msg.createdAt
        }));

        res.json(formatted);
    } catch (error: any) {
         if (!process.env.DATABASE_URL || error.message.includes("PrismaClient")) {
             return res.json([]);
        }
        res.status(500).json({ error: error.message });
    }
});

// POST a new message universally
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        const { receiverId, content } = req.body;
        if(!receiverId || !content) return res.status(400).json({ error: "Missing payload details" });

        const msg = await prisma.message.create({
            data: {
                senderId: req.user.id,
                receiverId,
                content
            }
        });

        res.json({ success: true, message: {
            id: msg.id,
            sender: req.user.role === 'WORKER' ? 'worker' : 'employer',
            text: msg.content,
            time: msg.createdAt
        }});
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
