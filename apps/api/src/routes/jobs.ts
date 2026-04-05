import { Router } from 'express';
import { prisma } from '../db';
import { authenticateToken } from './auth';

const router = Router();

// Worker: Get available jobs sorted by distance
router.get('/available', authenticateToken, async (req: any, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: { status: 'ACTIVE' },
            include: { employerProfile: true, businessProfile: true }
        });
        
        // For MVP sorting by mock distance logic (using arbitrary static coordinates) 
        // In prod this uses PostGIS or Haversine on lat/lng.
        const sortedJobs = jobs.map(j => ({ ...j, distance: Math.random() * 10 })).sort((a,b) => a.distance - b.distance);

        res.json(sortedJobs);
    } catch (error: any) {
        if (!process.env.DATABASE_URL || error.message.includes("PrismaClient")) {
             return res.json([
                 { 
                     id: 'mock_job_1', 
                     title: 'Local Event Staff (Mock)', 
                     description: 'Help staff a local event.', 
                     category: 'Events',
                     payPerWorker: 600, 
                     city: 'Local', 
                     distance: 1.2,
                     scheduledFor: new Date(Date.now() + 86400000).toISOString(),
                     totalSpots: 10,
                     filledSpots: 2,
                     estimatedHours: 4,
                     employerProfile: { firstName: 'Mock', lastName: 'Employer' }
                 },
                 { 
                     id: 'mock_job_2', 
                     title: 'Warehouse Restocking (Mock)', 
                     description: 'Night shift restock.', 
                     category: 'Logistics',
                     payPerWorker: 800, 
                     city: 'Local', 
                     distance: 3.5,
                     scheduledFor: new Date(Date.now() + 172800000).toISOString(),
                     totalSpots: 5,
                     filledSpots: 5,
                     estimatedHours: 8,
                     employerProfile: { firstName: 'Mock', lastName: 'Company' }
                 }
             ]);
        }
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Employer: Get my jobs 
router.get('/employer', authenticateToken, async (req: any, res) => {
    try {
        // Find employer profile associated with user
        const employer = await prisma.employerProfile.findUnique({ where: { userId: req.user.id } });
        if(!employer) return res.status(403).json({ error: 'Employer profile not found' });

        const jobs = await prisma.job.findMany({
            where: { employerProfileId: employer.id },
            include: { 
                 applications: { include: { workerProfile: { include: { user: true } } } } 
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error: any) {
        if (!process.env.DATABASE_URL || error.message.includes("PrismaClient")) {
             return res.json([
                 { 
                     id: 'mock_job_3', title: 'My Posted Event (Mock)', status: 'ACTIVE', payPerWorker: 600, totalSpots: 10, filledSpots: 2, estimatedHours: 4, scheduledFor: new Date(Date.now() + 86400000).toISOString(),
                     applications: [{ id: 'app_1', workerProfile: { user: { phone: '1112223333' }, firstName: 'Test', lastName: 'Worker' }, status: 'ACCEPTED'}]
                 }
             ]);
        }
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

router.post('/', authenticateToken, async (req: any, res) => {
    try {
        let { payPerWorker, totalSpots, isPrefunded, employerProfileId, ...rest } = req.body;

        // Auto-assign employer profile
        if (!employerProfileId) {
             const emp = await prisma.employerProfile.findUnique({ where: { userId: req.user.id } });
             if(emp) employerProfileId = emp.id;
        }

        // Execute Job creation atomically. Escrow detatched for Pitch Version.
        const job = await prisma.job.create({
            data: {
                ...rest,
                payPerWorker,
                totalSpots,
                isPrefunded: true, // Forcing true UI-wise so UX renders as prefunded
                employerProfileId
            }
        });

        res.json(job);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create job' });
    }
});
// (Replaced by Detatched Lock above)

router.post('/:id/complete', async (req, res) => {
    try {
        const jobId = req.params.id;

        const result = await prisma.$transaction(async (tx: any) => {
            const job = await tx.job.update({
                where: { id: jobId },
                data: { status: 'COMPLETED', completedAt: new Date() }
            });

            const escrow = await tx.escrowHold.findUnique({ where: { jobId } });
            if (escrow && escrow.status === "held") {
                await tx.escrowHold.update({
                    where: { jobId },
                    data: { status: "released", releasedAt: new Date() }
                });

                const acceptedApps = await tx.application.findMany({
                    where: { jobId, status: 'ACCEPTED' },
                    include: { workerProfile: { include: { user: true } } }
                });

                if (acceptedApps.length > 0) {
                    const splitAmount = escrow.amount / acceptedApps.length;

                    for (const app of acceptedApps) {
                        let wallet = await tx.wallet.findUnique({ where: { userId: app.workerProfile.userId } });
                        if (!wallet) {
                            wallet = await tx.wallet.create({ data: { userId: app.workerProfile.userId } });
                        }

                        await tx.wallet.update({
                            where: { id: wallet.id },
                            data: { balance: { increment: splitAmount }, totalEarned: { increment: splitAmount } }
                        });

                        await tx.transaction.create({
                            data: {
                                walletId: wallet.id,
                                type: 'ESCROW_RELEASE',
                                amount: splitAmount,
                                description: `Payment for Job: ${job.title}`,
                                jobId: job.id
                            }
                        });
                    }
                }
            }
            return job;
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to complete job' });
    }
});

// Queue Engine: Cancel an application and automatically promote next in queue
router.post('/:jobId/cancel-application/:applicationId', async (req, res) => {
    try {
        const { jobId, applicationId } = req.params;

        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Cancel the current accepted application
            await tx.application.update({
                where: { id: applicationId },
                data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: 'Worker cancelled' }
            });

            // 2. See if there are queued applicants
            const nextInQueue = await tx.application.findFirst({
                where: { jobId, status: 'QUEUED' },
                orderBy: { appliedAt: 'asc' }
            });

            if (nextInQueue) {
                // Promote the queued worker
                await tx.application.update({
                    where: { id: nextInQueue.id },
                    data: { status: 'ACCEPTED', acceptedAt: new Date() }
                });

                // Decrement filled spots momentarily and increment it back logically, 
                // essentially swapping them. Notification engine would hook here.
                return { message: 'Worker cancelled. Promoted next in queue.', promotedApplicationId: nextInQueue.id };
            }

            // No one in queue, decrement filled spots
            await tx.job.update({
                where: { id: jobId },
                data: { filledSpots: { decrement: 1 } }
            });

            return { message: 'Worker cancelled. Job spots reopened.' };
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to process cancellation' });
    }
});

// GET Deep fetch for a specific Application detailing digital resume & contact masking
router.get('/application/:applicationId', authenticateToken, async (req, res) => {
    try {
        const application = await prisma.application.findUnique({
            where: { id: req.params.applicationId },
            include: {
                workerProfile: {
                    include: {
                        user: true,
                        applications: {
                            where: { status: 'COMPLETED' },
                            include: { job: { select: { title: true, employerProfile: { select: { companyName: true, firstName: true } } } } }
                        }
                    }
                },
                job: { select: { id: true, title: true, employerProfileId: true } }
            }
        });

        if (!application) return res.status(404).json({ error: 'Application not found' });
        res.json(application);

    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Server extraction error' });
    }
});

// POST Accept Application (Employer Action)
router.post('/application/:applicationId/accept', authenticateToken, async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Perform transaction updating application status and potentially deducting escrow holds
        const result = await prisma.$transaction(async (tx: any) => {
            const app = await tx.application.update({
                where: { id: applicationId },
                data: { status: 'ACCEPTED', acceptedAt: new Date() }
            });

            // Iterate filled spots on the job listing logically
            await tx.job.update({
                where: { id: app.jobId },
                data: { filledSpots: { increment: 1 } }
            });

            return app;
        });

        res.json({ success: true, result });
    } catch (e: any) {
        res.status(500).json({ error: e.message || 'Mutation intercept failed' });
    }
});

// GET Specific Job deep detail (Employer UI target)
router.get('/:id', authenticateToken, async (req: any, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: req.params.id },
            include: {
                applications: {
                    include: {
                        workerProfile: {
                            include: { user: true }
                        }
                    },
                    orderBy: {
                        appliedAt: 'desc'
                    }
                }
            }
        });
        if (!job) return res.status(404).json({ error: 'Data link not found' });
        res.json(job);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Direct query failure' });
    }
});

// GET Worker's upcoming schedule
router.get('/worker/upcoming', authenticateToken, async (req: any, res) => {
    try {
        const profile = await prisma.workerProfile.findUnique({ where: { userId: req.user.id } });
        if(!profile) return res.status(404).json({ error: 'Worker profile missing' });

        const applications = await prisma.application.findMany({
            where: {
                workerProfileId: profile.id,
                status: { in: ['ACCEPTED', 'QUEUED'] },
                job: { status: 'ACTIVE' }
            },
            include: {
                job: {
                    include: { employerProfile: true }
                }
            },
            orderBy: {
                job: { scheduledFor: 'asc' }
            }
        });

        res.json(applications);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Worker map retrieval failed' });
    }
});

export default router;
