import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Get Wallet ID by User ID
router.get('/:userId', async (req, res) => {
    try {
        let wallet = await prisma.wallet.findUnique({
            where: { userId: req.params.userId },
            include: { transactions: { orderBy: { createdAt: 'desc' } } }
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId: req.params.userId },
                include: { transactions: true }
            });
        }
        res.json(wallet);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to retrieve wallet' });
    }
});

// Process Withdrawal
router.post('/:walletId/withdraw', async (req, res) => {
    try {
        const { amount } = req.body;
        const walletId = req.params.walletId;

        const result = await prisma.$transaction(async (tx: any) => {
            const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
            if (!wallet || wallet.balance < amount) {
                throw new Error('Insufficient balance');
            }

            const updatedWallet = await tx.wallet.update({
                where: { id: walletId },
                data: { balance: { decrement: amount }, totalWithdrawn: { increment: amount } }
            });

            const transaction = await tx.transaction.create({
                data: {
                    walletId,
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
