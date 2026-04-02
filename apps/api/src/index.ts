import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
export const prisma = new PrismaClient();

app.use(cors());
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

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/wallets', walletRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
