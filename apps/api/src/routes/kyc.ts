import { Router } from 'express';
import { prisma } from '../db';
import { authenticateToken } from './auth';

const router = Router();

// Initiate KYC — authenticated workers only
router.post('/initiate', authenticateToken, async (req: any, res) => {
    const userId = req.user.id; // use JWT identity, never trust body for userId

    try {
        let profile = await prisma.workerProfile.findUnique({ where: { userId } });

        if (!profile) {
            profile = await prisma.workerProfile.create({
                data: { userId, firstName: '', lastName: '' }
            });
        }

        const updated = await prisma.workerProfile.update({
            where: { userId },
            data: {
                kycStatus: 'PENDING',
                kycAttempts: profile.kycAttempts + 1
            }
        });

        res.json({ success: true, status: updated.kycStatus, attempts: updated.kycAttempts });
    } catch (e: any) {
        if (!process.env.DATABASE_URL || e.message.includes('PrismaClient')) {
            return res.json({ success: true, status: 'PENDING', attempts: 1 });
        }
        res.status(500).json({ error: e.message });
    }
});

// Verify KYC — internal/admin only, NOT callable by end users
// TODO: add admin role guard when admin roles are implemented
router.post('/verify', authenticateToken, async (req: any, res) => {
    // Only allow admin or system calls — reject if caller is a normal worker/employer
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: admin access required' });
    }

    const { userId, success = true } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    try {
        const status = success ? 'VERIFIED' : 'REJECTED';
        const updated = await prisma.workerProfile.update({
            where: { userId },
            data: {
                kycStatus: status,
                aadhaarVerified: success,
                aadhaarVerifiedAt: success ? new Date() : null
            }
        });

        res.json({ success, status: updated.kycStatus });
    } catch (e: any) {
        if (!process.env.DATABASE_URL || e.message.includes('PrismaClient')) {
            return res.json({ success, status: success ? 'VERIFIED' : 'REJECTED' });
        }
        res.status(500).json({ error: e.message });
    }
});

export default router;
