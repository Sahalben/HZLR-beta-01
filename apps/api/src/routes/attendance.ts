import { Router } from 'express';
import { prisma } from '../db';
import { authenticateToken } from './auth';

const router = Router();

// Retrieve all attendance records for heavily typed Worker Dashboard
router.get('/my-records', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'WORKER') {
            return res.status(403).json({ error: 'Only workers can access their attendance history bulk endpoint' });
        }

        const workerProfile = await prisma.workerProfile.findUnique({
            where: { userId: req.user.id }
        });

        if (!workerProfile) {
            return res.status(404).json({ error: 'Worker profile missing' });
        }

        const records = await prisma.attendance.findMany({
            where: { workerProfileId: workerProfile.id },
            include: {
                job: { include: { employerProfile: true, businessProfile: true } }
            },
            orderBy: {
                 createdAt: 'desc'
            }
        });

        const mapped = records.map(r => ({
            id: r.id,
            jobId: r.jobId,
            gigTitle: r.job.title,
            employerName: r.job.businessProfile?.businessName || r.job.employerProfile?.firstName || 'Private',
            scheduledStart: r.job.scheduledFor,
            status: r.status.toLowerCase(), // checked_in, checked_out
            checkinTime: r.checkInTime,
            checkoutTime: r.checkOutTime,
            distanceFromGig: r.checkInDistance ? Math.round(r.checkInDistance) : null,
            // Calculate lateness logic if checked in
            latenessMinutes: r.checkInTime ? Math.round((new Date(r.checkInTime).getTime() - new Date(r.job.scheduledFor).getTime()) / 60000) : 0
        }));

        res.json(mapped);
    } catch (error: any) {
        if (!process.env.DATABASE_URL || error.message.includes("PrismaClient")) {
             return res.json([]);
        }
        res.status(500).json({ error: error.message || 'Failed to fetch' });
    }
});

// Retrieve all attendance records strictly mapped tracking Employer targets
router.get('/employer-records', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role === 'WORKER') {
            return res.status(403).json({ error: 'Denied map traversal' });
        }

        const profile = await prisma.employerProfile.findUnique({
            where: { userId: req.user.id }
        });
        if (!profile) return res.status(404).json({ error: 'Config missing' });

        const records = await prisma.attendance.findMany({
            where: {
                job: { employerProfileId: profile.id }
            },
            include: {
                job: true,
                workerProfile: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const mapped = records.map(r => ({
            id: r.id,
            workerName: `${r.workerProfile.firstName} ${r.workerProfile.lastName}`,
            gigTitle: r.job.title,
            checkinTime: r.checkInTime,
            checkoutTime: r.checkOutTime,
            distanceFromGig: r.checkInDistance ? Math.round(r.checkInDistance) : null,
            status: r.status.toLowerCase(),
            reliabilityScore: r.workerProfile.reliabilityScore || 65,
            latenessMinutes: r.checkInTime ? Math.round((new Date(r.checkInTime).getTime() - new Date(r.job.scheduledFor).getTime()) / 60000) : 0
        }));

        res.json(mapped);
    } catch(err: any) {
        if (!process.env.DATABASE_URL) return res.json([]);
        res.status(500).json({ error: err.message });
    }
});

export default router;
