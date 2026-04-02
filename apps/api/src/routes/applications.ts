import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const application = await prisma.application.create({
            data: req.body
        });
        res.json(application);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to submit application' });
    }
});

export default router;
