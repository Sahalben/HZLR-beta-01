import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            include: { employerProfile: true, businessProfile: true }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { payPerWorker, totalSpots, isPrefunded, employerProfileId, ...rest } = req.body;

        // Execute Job creation and EscrowHold atomically if prefunded
        const result = await prisma.$transaction(async (tx: any) => {
            const job = await tx.job.create({
                data: {
                    ...rest,
                    payPerWorker,
                    totalSpots,
                    isPrefunded,
                    employerProfileId
                }
            });

            if (isPrefunded && payPerWorker && totalSpots) {
                const totalAmount = payPerWorker * totalSpots;
                await tx.escrowHold.create({
                    data: {
                        jobId: job.id,
                        amount: totalAmount,
                        status: "held"
                    }
                });
            }
            return job;
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create job' });
    }
});

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

export default router;
