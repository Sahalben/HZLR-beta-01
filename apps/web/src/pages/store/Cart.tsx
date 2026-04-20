import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, MapPin, CreditCard, Banknote, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    storeApi.getCart().then(setCart).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const items = cart?.items || [];
  const merchant = items[0]?.product?.merchant;
  const subtotal = items.reduce((s: number, i: any) => s + i.priceAtAdd * i.quantity, 0);
  const deliveryFee = merchant?.freeDeliveryThreshold && subtotal >= merchant.freeDeliveryThreshold ? 0 : 30;
  const total = subtotal + deliveryFee;

  const updateItem = async (item: any, delta: number) => {
    const newQty = item.quantity + delta;
    try {
      if (newQty <= 0) await storeApi.removeCartItem(item.id);
      else await storeApi.updateCartItem(item.id, newQty);
      const updated = await storeApi.getCart();
      setCart(updated);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast({ title: 'Address required', description: 'Please enter your delivery address.', variant: 'destructive' });
      return;
    }
    if (!merchant) {
      toast({ title: 'Cart error', description: 'No merchant found in cart.', variant: 'destructive' });
      return;
    }
    setPlacingOrder(true);
    try {
      const result = await storeApi.placeOrder({
        merchantId: merchant.id,
        paymentMethod,
        deliveryAddress,
      });
      toast({ title: '🎉 Order placed!', description: 'Your order has been confirmed.' });
      navigate(`/store/orders/${result.order.id}`);
    } catch (e: any) {
      toast({ title: 'Order failed', description: e.message, variant: 'destructive' });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="p-4 pt-8 space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3" />
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-2xl" />)}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-32">
        <div className="px-4 pt-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6">
            <ArrowLeft size={18} /> <span className="font-medium text-sm">Back</span>
          </button>
          <h1 className="text-2xl font-black text-foreground mb-1">Your Cart</h1>
          {merchant && (
            <p className="text-sm text-muted-foreground">
              From <span className="font-bold text-amber-500">{merchant.storeName}</span>
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mb-4" />
            <h2 className="font-black text-xl text-foreground">Cart is empty</h2>
            <p className="text-sm text-muted-foreground mt-2">Add items from a store to get started.</p>
            <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white border-0" onClick={() => navigate('/store')} id="btn-browse-stores">
              Browse Stores
            </Button>
          </div>
        ) : (
          <div className="px-4 space-y-4 mt-6">
            {/* Cart items */}
            <div className="space-y-3">
              {items.map((item: any) => (
                <Card key={item.id} className="p-4 border border-border/50 flex items-center gap-3">
                  <div className="w-14 h-14 bg-muted rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-2xl">
                    {item.product?.imageUrl
                      ? <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                      : '🛒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground line-clamp-1">{item.product?.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.priceAtAdd} × {item.quantity}</p>
                    <p className="font-black text-sm text-foreground mt-0.5">₹{(item.priceAtAdd * item.quantity).toFixed(0)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-2 py-1 shrink-0">
                    <button onClick={() => updateItem(item, -1)} className="text-amber-600 p-0.5"><Minus size={15} /></button>
                    <span className="font-black text-sm w-4 text-center text-amber-700">{item.quantity}</span>
                    <button onClick={() => updateItem(item, 1)} className="text-amber-600 p-0.5"><Plus size={15} /></button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Delivery address */}
            <div>
              <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-amber-500" /> Delivery Address
              </label>
              <textarea
                className="w-full bg-card border border-border/70 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
                rows={2}
                placeholder="Enter your full delivery address..."
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                id="cart-delivery-address"
              />
            </div>

            {/* Payment method */}
            <div>
              <p className="text-sm font-bold text-foreground mb-2">Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                {([['COD', 'Cash on Delivery', Banknote], ['RAZORPAY', 'Pay Online', CreditCard]] as const).map(([method, label, Icon]) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method as any)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      paymentMethod === method
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                        : 'border-border text-muted-foreground'
                    }`}
                    id={`payment-${method.toLowerCase()}`}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <Card className="p-4 border border-border/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery fee</span>
                <span className={deliveryFee === 0 ? 'text-green-500 font-bold' : 'font-bold'}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-border/50 pt-2 flex items-center justify-between">
                <span className="font-black text-foreground">Total</span>
                <span className="font-black text-lg text-foreground">₹{total.toFixed(0)}</span>
              </div>
              {merchant?.minOrderValue > 0 && subtotal < merchant.minOrderValue && (
                <p className="text-xs text-red-500 font-medium">
                  Minimum order is ₹{merchant.minOrderValue}. Add ₹{(merchant.minOrderValue - subtotal).toFixed(0)} more.
                </p>
              )}
            </Card>

            {/* Place order */}
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-base py-6 rounded-2xl shadow-xl shadow-amber-500/30 border-0"
              disabled={placingOrder || (merchant?.minOrderValue > 0 && subtotal < merchant.minOrderValue)}
              onClick={handlePlaceOrder}
              id="btn-place-order"
            >
              {placingOrder ? 'Placing Order...' : `Place Order · ₹${total.toFixed(0)}`}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
