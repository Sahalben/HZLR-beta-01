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

// Fail fast — never start with a missing JWT secret
const jwtSecret = process.env['JWT_ACCESS_SECRET'];
console.log('[boot] NODE_ENV:', process.env.NODE_ENV);
console.log('[boot] env keys present:', Object.keys(process.env).filter(k => k.startsWith('JWT') || k === 'NODE_ENV' || k === 'DATABASE_URL' || k === 'PORT').join(', '));
console.log('[boot] JWT_ACCESS_SECRET present:', !!jwtSecret, '| length:', jwtSecret ? jwtSecret.length : 0);

if (!jwtSecret) {
    console.error('FATAL: JWT_ACCESS_SECRET environment variable is not set. Refusing to start.');
    process.exit(1);
}


const app = express();
const PORT = process.env.PORT || 8080;

// Restrict CORS to known frontend origins
// Set ALLOWED_ORIGINS in Railway as a comma-separated list:
// e.g. https://www.hzlr.online,https://hzlr-beta-01-6hfm10t64-sahalbens-projects.vercel.app
const ALLOWED_ORIGINS = [
    ...(process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean),
    'http://localhost:5173',
    'http://localhost:4173',
];

app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true
}));
app.use(express.json());

const httpServer = createServer(app);
let io: any;

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

io = new Server(httpServer, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket: any) => {
    // Room joins for targeted real-time events
    socket.on('join:worker', (workerId: string) => socket.join(`worker:${workerId}`));
    socket.on('join:employer', (employerId: string) => socket.join(`employer:${employerId}`));
    socket.on('join:job', (jobId: string) => socket.join(`job:${jobId}`));

    socket.on('disconnect', () => {
        // intentionally silent in production
    });
});

// Routes
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import walletRoutes from './routes/wallets';
import kycRoutes from './routes/kyc';
import messagesRoutes from './routes/messages';
import attendanceRoutes from './routes/attendance';
import notificationsRoutes from './routes/notifications';
import employersRoutes from './routes/employers';
import storeRouter from './routes/store/index';

const isProd = process.env.NODE_ENV === 'production';

const otpSendLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: isProd ? 5 : 50,     // 5/hr in prod — prevents SMS bombing
    message: { error: 'Too many OTP requests. Try again in 1 hour.' }
});

const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProd ? 10 : 50,    // 10 attempts per 15 min in prod
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
app.use('/api/v1/store', storeRouter);

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
