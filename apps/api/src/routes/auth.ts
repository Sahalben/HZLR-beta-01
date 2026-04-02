import { Router } from 'express';
import { prisma } from '../index';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_secret_for_dev_min_64_chars';

// Simulated OTP sending
router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number required' });
    }

    // Simulate OTP send
    res.json({ success: true, message: 'OTP sent to ' + phone, mockOtp: '123456' });
});

// Verify OTP and generate JWT
router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;

    if (otp !== '123456') {
        return res.status(401).json({ error: 'Invalid OTP' });
    }

    // UPSERT user
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                phone,
                role: 'WORKER', // Default, will ask role later if new
                isPhoneVerified: true
            }
        });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user });
});

export default router;
