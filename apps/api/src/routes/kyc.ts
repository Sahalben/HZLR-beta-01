import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Initiate KYC
router.post('/initiate', async (req, res) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId required' });

    try {
        let profile = await prisma.workerProfile.findUnique({ where: { userId } });
        
        // Auto-create profile if missing for mock dev flows
        if(!profile) {
            profile = await prisma.workerProfile.create({
                data: {
                    userId,
                    firstName: 'Mock',
                    lastName: 'User'
                }
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
        res.status(500).json({ error: e.message });
    }
});

// Verify KYC (Mock completion)
router.post('/verify', async (req, res) => {
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
        res.status(500).json({ error: e.message });
    }
});

export default router;
