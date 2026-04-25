import { Router } from 'express';
import { prisma } from '../db';
import { authenticateToken } from './auth';

const router = Router();

// Get authenticated user's own wallet — users can only access their own
router.get('/me', authenticateToken, async (req: any, res) => {
    try {
        let wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.id },
            include: { transactions: { orderBy: { createdAt: 'desc' } } }
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId: req.user.id },
                include: { transactions: true }
            });
        }
        res.json(wallet);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to retrieve wallet' });
    }
});

// Process Withdrawal — authenticated, wallet must belong to caller
router.post('/withdraw', authenticateToken, async (req: any, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid withdrawal amount' });

        const result = await prisma.$transaction(async (tx: any) => {
            const wallet = await tx.wallet.findUnique({ where: { userId: req.user.id } });
            if (!wallet) throw new Error('Wallet not found');
            if (wallet.balance < amount) throw new Error('Insufficient balance');

            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: { decrement: amount }, totalWithdrawn: { increment: amount } }
            });

            const transaction = await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'WITHDRAWAL',
                    amount,
                    description: 'Bank Transfer Withdrawal',
                }
            });
            return { wallet: updatedWallet, transaction };
        });

        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Withdrawal failed' });
    }
});

export default router;
