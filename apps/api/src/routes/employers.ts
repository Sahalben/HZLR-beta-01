import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken } from './auth';

const router = Router();

// GET /api/v1/employers/profile
router.get('/profile', authenticateToken, async (req: any, res) => {
    try {
        const profile = await prisma.employerProfile.findUnique({
            where: { userId: req.user.id }
        });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (e: any) {
        if (!process.env.DATABASE_URL) return res.json({});
        res.status(500).json({ error: e.message });
    }
});

// PUT /api/v1/employers/profile (Generic updater for onboarding steps)
router.put('/profile', authenticateToken, async (req: any, res) => {
    try {
        const updates = req.body;
        
        const profile = await prisma.employerProfile.upsert({
            where: { userId: req.user.id },
            update: updates,
            create: {
                userId: req.user.id,
                firstName: updates.firstName || '',
                lastName: updates.lastName || '',
                ...updates
            }
        });
        res.json({ success: true, profile });
    } catch (e: any) {
        if (!process.env.DATABASE_URL) return res.json({ success: true, mock: true });
        res.status(500).json({ error: e.message });
    }
});

// GET /api/v1/employers/dashboard (Aggregations)
router.get('/dashboard', authenticateToken, async (req: any, res) => {
    try {
        const profile = await prisma.employerProfile.findUnique({
            where: { userId: req.user.id }
        });
        
        if (!profile) return res.status(404).json({ error: 'Profile required' });

        const jobs = await prisma.job.findMany({
            where: { employerProfileId: profile.id },
            orderBy: { createdAt: 'desc' }
        });

        const activePostings = jobs.filter(j => j.status === 'ACTIVE').length;
        const totalHires = jobs.reduce((acc, job) => acc + job.filledSpots, 0);
        
        // Mock computation for fillRate and avgFillTime initially
        const fillRate = totalHires > 0 ? 94 : 0; 
        const avgFillTime = totalHires > 0 ? 2.4 : 0; 

        // 1. Fetch available workers on the platform that are marked READY
        const rawWorkers = await prisma.workerProfile.findMany({
            where: { 
                 isReadyToWork: true,
                 latitude: { not: null },
                 longitude: { not: null }
            },
            take: 100,
            select: { id: true, firstName: true, reliabilityScore: true, latitude: true, longitude: true, categories: true }
        });

        // OBFUSCATOR: Shifts coordinates randomly by ~100-300 meters for safety!
        const activeWorkers = rawWorkers.map(w => ({
            id: w.id,
            name: `${w.firstName || 'Worker'}`,
            score: w.reliabilityScore,
            tags: w.categories,
            latitude: w.latitude! + (Math.random() - 0.5) * 0.005,
            longitude: w.longitude! + (Math.random() - 0.5) * 0.005
        }));

        // 2. Fetch Recent Applicants relating to this Employer's Jobs
        const applications = await prisma.application.findMany({
            where: {
                job: { employerProfileId: profile.id },
                status: 'APPLIED'
            },
            include: {
                workerProfile: { select: { firstName: true, reliabilityScore: true, totalGigsDone: true, groomingCertified: true, aadhaarVerified: true } },
                job: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const formattedApplicants = applications.map(app => ({
            id: app.id,
            name: app.workerProfile.firstName + ' ' + (app.workerProfile.aadhaarVerified ? '✓' : ''),
            score: app.workerProfile.reliabilityScore,
            gigs: app.workerProfile.totalGigsDone,
            verified: app.workerProfile.aadhaarVerified,
            jobTitle: app.job.title
        }));

        res.json({
            activePostings,
            totalHires,
            fillRate,
            avgFillTime,
            jobs: jobs.slice(0, 5), // Recent 5 jobs
            activeWorkers,
            applicants: formattedApplicants
        });
    } catch (e: any) {
        if (!process.env.DATABASE_URL) return res.json({ activePostings: 0, totalHires: 0, fillRate: 0, avgFillTime: 0, jobs: [], activeWorkers: [], applicants: [] });
        res.status(500).json({ error: e.message });
    }
});

// POST /api/v1/employers/onboard/gst-verify
router.post('/onboard/gst-verify', authenticateToken, async (req: any, res) => {
    const { gstin } = req.body;

    if (!gstin || gstin.length !== 15) {
        return res.status(400).json({ error: 'Invalid GSTIN format' });
    }

    try {
        const SUREPASS_TOKEN = process.env.SUREPASS_TOKEN;

        if (SUREPASS_TOKEN) {
            const surepassRes = await fetch('https://kyc-api.surepass.io/api/v1/gst/gst-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUREPASS_TOKEN}`
                },
                body: JSON.stringify({ id: gstin })
            });

            if (surepassRes.ok) {
                const data = await surepassRes.json() as any;
                const profile = await prisma.employerProfile.update({
                    where: { userId: req.user.id },
                    data: {
                        gstin,
                        gstVerified: true,
                        gstVerifiedAt: new Date(),
                        gstLegalName: data.data?.legal_name,
                        gstStatus: data.data?.gst_status,
                        gstTurnoverSlab: data.data?.turnover_slab,
                        registeredAddress: data.data?.business_address
                    }
                });
                return res.json({ success: true, verified: true, profile });
            }
        }

        // Graceful Fallback if Surepass fails or token missing
        const profile = await prisma.employerProfile.update({
            where: { userId: req.user.id },
            data: {
                gstin,
                gstVerified: false
            }
        });
        res.json({ success: true, verified: false, profile, message: 'GST stored for manual review.' });

    } catch (e: any) {
        res.status(500).json({ error: e.message || 'GST Verification crashed.' });
    }
});

export default router;
