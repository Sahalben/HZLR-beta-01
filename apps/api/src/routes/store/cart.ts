import { Router } from 'express';
import { prisma } from '../../db';
import { authenticateToken } from '../auth';

const router = Router();

// GET /store/cart — my cart
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: { include: { merchant: { select: { id: true, storeName: true, minOrderValue: true, status: true } } } },
          },
        },
      },
    });
    res.json(cart || { items: [] });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /store/cart/items — add item
router.post('/items', authenticateToken, async (req: any, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ error: 'productId and quantity required.' });

    const product = await prisma.product.findUnique({ where: { id: productId }, include: { merchant: true } });
    if (!product || !product.isActive) return res.status(404).json({ error: 'Product not found.' });
    if (product.merchant.status !== 'APPROVED') return res.status(400).json({ error: 'Store is not available.' });
    if (product.stock < parseInt(quantity)) return res.status(400).json({ error: 'Insufficient stock.' });

    // Ensure cart exists
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id } });

    // Check if cart has items from a different merchant — prevent mixed-merchant carts
    const existingItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });
    if (existingItems.length > 0 && existingItems[0].product.merchantId !== product.merchantId) {
      return res.status(400).json({
        error: 'Your cart contains items from a different store. Clear your cart to add items from this store.',
        currentMerchantId: existingItems[0].product.merchantId,
      });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: parseInt(quantity), priceAtAdd: product.price },
      create: { cartId: cart.id, productId, quantity: parseInt(quantity), priceAtAdd: product.price },
    });

    res.json({ success: true, cartItem });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /store/cart/items/:itemId — update quantity
router.patch('/items/:itemId', authenticateToken, async (req: any, res) => {
  try {
    const { quantity } = req.body;
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    const item = await prisma.cartItem.findUnique({ where: { id: req.params.itemId } });
    if (!item || item.cartId !== cart.id) return res.status(403).json({ error: 'Unauthorized.' });

    if (parseInt(quantity) <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
      return res.json({ success: true, deleted: true });
    }

    const updated = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: parseInt(quantity) },
    });
    res.json({ success: true, cartItem: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /store/cart/items/:itemId — remove item
router.delete('/items/:itemId', authenticateToken, async (req: any, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    const item = await prisma.cartItem.findUnique({ where: { id: req.params.itemId } });
    if (!item || item.cartId !== cart.id) return res.status(403).json({ error: 'Unauthorized.' });

    await prisma.cartItem.delete({ where: { id: item.id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /store/cart — clear cart
router.delete('/', authenticateToken, async (req: any, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
