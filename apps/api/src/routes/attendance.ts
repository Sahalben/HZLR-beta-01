import { Router } from 'express';
import { prisma } from '../db';
import { authenticateToken } from './auth';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';

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

// --- QR ATTENDANCE SYSTEM ---

// GET /api/v1/attendance/qr/:jobId (Employer generates QR)
router.get('/qr/:jobId', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'EMPLOYER' && req.user.role !== 'BUSINESS') {
             return res.status(403).json({ error: 'Only employers/businesses can generate QR codes' });
        }
        
        const { jobId } = req.params;
        
        // a. Verify job belongs to requesting employer
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { employerProfile: true, businessProfile: true }
        });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        
        // EmployerProfile check or BusinessProfile check depending on what req.user is associated with
        const isOwner = job.employerProfile?.userId === req.user.id || job.businessProfile?.userId === req.user.id;
        if (!isOwner) {
            return res.status(403).json({ error: 'You do not own this job' });
        }

        // b. Generate a signed JWT token
        const token = jwt.sign(
            { jobId, type: 'attendance_qr' },
            process.env.JWT_ACCESS_SECRET || 'fallback-secret',
            { expiresIn: '12h' }
        );

        // c. Generate QR code as base64 PNG
        const qrDataUrl = await QRCode.toDataURL(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/checkin?token=${token}`);

        // d. Return payload
        res.json({ qrDataUrl, token, expiresIn: '12h' });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to generate QR' });
    }
});

// POST /api/v1/attendance/qr-checkin (Worker scans QR and checks in)
router.post('/qr-checkin', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'WORKER') return res.status(403).json({ error: 'Only workers can check in' });

        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'QR Token is missing' });

        // a. Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback-secret') as any;
        if (decoded.type !== 'attendance_qr') return res.status(400).json({ error: 'Invalid token type' });
        
        const jobId = decoded.jobId;

        const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: req.user.id } });
        if (!workerProfile) return res.status(404).json({ error: 'Worker profile found' });

        // b. Find Application
        const application = await prisma.application.findFirst({
            where: {
                jobId,
                workerProfileId: workerProfile.id,
                status: 'ACCEPTED'
            },
            include: { job: true }
        });

        // c. If no application
        if (!application) {
            return res.status(403).json({ error: 'You are not assigned to this job' });
        }

        // d. Check no existing check-in
        const existing = await prisma.attendance.findFirst({
            where: { jobId, workerProfileId: workerProfile.id }
        });
        if (existing) {
            return res.status(400).json({ error: 'You have already checked in or have an attendance record for this job' });
        }

        const result = await prisma.$transaction(async (tx: any) => {
             // e. Create Attendance record
             const record = await tx.attendance.create({
                 data: {
                     applicationId: application.id,
                     workerProfileId: workerProfile.id,
                     jobId: jobId,
                     checkInTime: new Date(),
                     checkInMethod: 'QR',
                     status: 'CHECKED_IN'
                 }
             });

             // f. Update Application status
             await tx.application.update({
                 where: { id: application.id },
                 data: { status: 'CONFIRMED', confirmedAt: new Date() }
             });

             return record;
        });

        // g. Return 
        res.json({
            success: true,
            checkInTime: result.checkInTime,
            workerName: workerProfile.firstName,
            jobTitle: application.job.title
        });
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'QR Code Expired' });
        if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid QR Code' });
        res.status(500).json({ error: error.message || 'Failed to check in' });
    }
});

// POST /api/v1/attendance/qr-checkout (Worker scans QR and checks out)
router.post('/qr-checkout', authenticateToken, async (req: any, res) => {
     try {
         if (req.user.role !== 'WORKER') return res.status(403).json({ error: 'Only workers can check out' });

         const { token } = req.body;
         if (!token) return res.status(400).json({ error: 'QR Token is missing' });

         const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback-secret') as any;
         if (decoded.type !== 'attendance_qr') return res.status(400).json({ error: 'Invalid token type' });
         
         const jobId = decoded.jobId;

         const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: req.user.id } });
         if (!workerProfile) return res.status(404).json({ error: 'Worker profile not found' });

         // Find existing CHECKED_IN attendance
         const attendance = await prisma.attendance.findFirst({
             where: {
                 jobId,
                 workerProfileId: workerProfile.id,
                 status: 'CHECKED_IN'
             }
         });

         if (!attendance) {
             return res.status(404).json({ error: 'No active check-in found to check out from.' });
         }

         const record = await prisma.attendance.update({
             where: { id: attendance.id },
             data: {
                 checkOutTime: new Date(),
                 checkOutMethod: 'QR',
                 status: 'CHECKED_OUT'
             }
         });

         const hoursWorked = record.checkInTime ? Math.round((new Date().getTime() - new Date(record.checkInTime).getTime()) / (1000 * 60 * 60) * 100) / 100 : 0;

         res.json({
             success: true,
             checkOutTime: record.checkOutTime,
             hoursWorked
         });
     } catch (error: any) {
         if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'QR Code Expired' });
         if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid QR Code' });
         res.status(500).json({ error: error.message || 'Failed to check out' });
     }
});

// POST /api/v1/attendance/manual-confirm/:attendanceId (Employer manual fallback)
router.post('/manual-confirm/:attendanceId', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'EMPLOYER' && req.user.role !== 'BUSINESS') {
             return res.status(403).json({ error: 'Only employers/businesses can confirm attendance' });
        }

        const { attendanceId } = req.params;
        const { action } = req.body;

        if (action !== 'checkin' && action !== 'checkout') {
            return res.status(400).json({ error: 'Invalid action. Must be "checkin" or "checkout"' });
        }

        // a. Verify attendance record belongs to employer job
        const attendance = await prisma.attendance.findUnique({
            where: { id: attendanceId },
            include: { job: { include: { employerProfile: true, businessProfile: true } } }
        });

        if (!attendance) return res.status(404).json({ error: 'Attendance record not found' });

        const isOwner = attendance.job.employerProfile?.userId === req.user.id || attendance.job.businessProfile?.userId === req.user.id;
        if (!isOwner) {
            return res.status(403).json({ error: 'You do not own this job' });
        }

        let updateData: any = {};
        
        // b. If action checkin
        if (action === 'checkin') {
            updateData = {
                checkInTime: new Date(),
                checkInMethod: 'MANUAL',
                status: 'CHECKED_IN'
            };
        }
        
        // c. If action checkout
        if (action === 'checkout') {
            updateData = {
                checkOutTime: new Date(),
                checkOutMethod: 'MANUAL',
                status: 'CHECKED_OUT'
            };
        }

        const updated = await prisma.attendance.update({
            where: { id: attendanceId },
            data: updateData
        });

        // d. Return updated record
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to manually confirm attendance' });
    }
});

// GET /api/v1/attendance/employer-records/:jobId
router.get('/employer-records/:jobId', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'EMPLOYER' && req.user.role !== 'BUSINESS') {
             return res.status(403).json({ error: 'Only employers can view rosters' });
        }
        const { jobId } = req.params;

        const job = await prisma.job.findUnique({
             where: { id: jobId },
             include: { employerProfile: true, businessProfile: true }
        });
        
        if (!job) return res.status(404).json({ error: 'Job not found' });
        const isOwner = job.employerProfile?.userId === req.user.id || job.businessProfile?.userId === req.user.id;
        if (!isOwner) return res.status(403).json({ error: 'You do not own this job' });

        const applications = await prisma.application.findMany({
             where: { 
                 jobId,
                 status: { in: ['ACCEPTED', 'CONFIRMED'] }
             },
             include: {
                 workerProfile: { include: { user: true } },
                 attendance: true
             }
        });

        res.json(applications);
    } catch(err: any) {
        if (!process.env.DATABASE_URL || err.message.includes("PrismaClient")) {
             return res.json([]);
        }
        res.status(500).json({ error: err.message });
    }
});

export default router;
