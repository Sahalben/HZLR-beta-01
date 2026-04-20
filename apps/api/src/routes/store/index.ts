import { Router } from 'express';
import categoriesRouter from './categories';
import merchantsRouter from './merchants';
import productsRouter from './products';
import cartRouter from './cart';
import ordersRouter from './orders';
import deliveryRouter from './delivery';
import settlementsRouter from './settlements';
import subscriptionsRouter from './subscriptions';
import adminRouter from './admin';
import posRouter from './pos';

const router = Router();

router.use('/categories', categoriesRouter);
router.use('/merchants', merchantsRouter);
router.use('/products', productsRouter);
router.use('/cart', cartRouter);
router.use('/orders', ordersRouter);
router.use('/delivery', deliveryRouter);
router.use('/settlements', settlementsRouter);
router.use('/subscriptions', subscriptionsRouter);
router.use('/admin', adminRouter);
router.use('/pos', posRouter);

export default router;
