import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors({
  // Safely reflects any origin automatically
  origin: true,
  credentials: true
}));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('A user connected via socket:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes will go here
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import walletRoutes from './routes/wallets';
import kycRoutes from './routes/kyc';
import messagesRoutes from './routes/messages';
import attendanceRoutes from './routes/attendance';
import notificationsRoutes from './routes/notifications';
import employersRoutes from './routes/employers';

const otpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, // Raised significantly for development testing
  message: { error: 'Too many OTP requests. Try again in 1 hour.' }
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Raised significantly for development testing
  message: { error: 'Too many attempts. Request a new OTP.' }
});

app.use('/api/v1/auth/send-otp', otpSendLimiter);
app.use('/api/v1/auth/send-email-otp', otpSendLimiter);
app.use('/api/v1/auth/verify-otp', otpVerifyLimiter);
app.use('/api/v1/auth/verify-email-otp', otpVerifyLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/kyc', kycRoutes);
app.use('/api/v1/messages', messagesRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/employers', employersRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.send('HZLR API is running');
});

export { app, httpServer };

if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}
