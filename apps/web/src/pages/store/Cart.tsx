import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingBag, MapPin, CreditCard, Banknote, ShieldCheck, Timer, ChevronRight, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('RAZORPAY');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    storeApi.getCart().then(setCart).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const items = cart?.items || [];
  const merchant = items[0]?.product?.merchant;
  
  // Calculations
  const subtotal = items.reduce((s: number, i: any) => s + i.priceAtAdd * i.quantity, 0);
  const totalMRP = items.reduce((s: number, i: any) => s + (i.product?.mrp || i.priceAtAdd) * i.quantity, 0);
  const itemDiscount = totalMRP - subtotal;
  
  const handlingFee = 5;
  const deliveryBaseFee = 35;
  const isFreeDelivery = merchant?.freeDeliveryThreshold && subtotal >= merchant.freeDeliveryThreshold;
  const activeDeliveryFee = isFreeDelivery ? 0 : deliveryBaseFee;
  
  const total = subtotal + activeDeliveryFee + handlingFee;

  const updateItem = async (item: any, delta: number) => {
    const newQty = item.quantity + delta;
    try {
      // Optimistic update
      setCart((prev: any) => ({ ...prev, items: prev.items.map((i: any) => i.id === item.id ? { ...i, quantity: newQty } : i).filter((i: any) => i.quantity > 0) }));
      
      if (newQty <= 0) await storeApi.removeCartItem(item.id);
      else await storeApi.updateCartItem(item.id, newQty);
      
      const updated = await storeApi.getCart();
      setCart(updated);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
      storeApi.getCart().then(setCart);
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
        <div className="min-h-screen bg-slate-50 p-4 pt-8 space-y-6 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-32 bg-slate-200 rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50 pb-40">
        <div className="bg-white px-4 pt-4 pb-2 sticky top-0 z-40 shadow-sm border-b border-slate-100 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0">
            <ArrowLeft size={18} className="text-slate-700" />
          </button>
          <div className="min-w-0 flex-1">
             <h1 className="text-lg font-black text-slate-800 leading-tight">Checkout</h1>
             {merchant && <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 truncate">{merchant.storeName}</p>}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6 border-4 border-white shadow-xl">
               <ShoppingBag size={40} />
            </div>
            <h2 className="font-black text-2xl text-slate-800">Your cart is empty</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium max-w-[200px] leading-relaxed">Looks like you haven't added anything to your cart yet.</p>
            <Button className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/20" onClick={() => navigate('/store')}>
              Browse Local Stores
            </Button>
          </div>
        ) : (
          <div className="px-4 space-y-4 mt-4 relative z-10">
            
            {/* Delivery Time Estimate Strip */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-emerald-500/10">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                        <Timer size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">ETA</p>
                        <p className="font-black text-lg leading-tight">{Math.round(merchant?.distanceKm * 4 + 10)} Minutes</p>
                    </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20">
                    <Zap size={14} className="text-yellow-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Superfast</span>
                </div>
            </div>

            {/* Cart Items Card */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 divide-y divide-slate-100">
              <div className="flex items-center justify-between pb-3">
                  <h3 className="font-black text-slate-800">Items from <span className="text-amber-500">{merchant?.storeName}</span></h3>
              </div>
              
              <div className="py-3 space-y-4">
                <AnimatePresence>
                  {items.map((item: any) => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} key={item.id} className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-1.5 relative">
                        {item.product?.imageUrl
                          ? <img src={item.product?.imageUrl} alt="" className="w-full h-full object-contain" />
                          : <span className="text-2xl opacity-10 filter blur-sm">🛍️</span>}
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="flex items-start justify-between">
                            <p className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight pr-2">{item.product?.name}</p>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.product?.unit || '1 pc'}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                           <div className="flex items-center gap-2">
                              <p className="font-black text-sm text-slate-800">₹{item.priceAtAdd}</p>
                              {item.product?.mrp && item.product.mrp > item.priceAtAdd && (
                                <p className="text-[10px] font-semibold text-slate-400 line-through">₹{item.product.mrp}</p>
                              )}
                           </div>
                           
                           {/* Quantifier */}
                           <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-1.5 py-1">
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateItem(item, -1)} className="text-amber-600 p-0.5"><Minus size={14} /></motion.button>
                                <span className="font-black text-sm w-4 text-center text-amber-700">{item.quantity}</span>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateItem(item, 1)} className="text-amber-600 p-0.5"><Plus size={14} /></motion.button>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="pt-3">
                  <button onClick={() => navigate(`/store/merchant/${merchant?.id}`)} className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-widest w-full justify-center">
                     <Plus size={14} /> Add more items
                  </button>
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
              <label className="text-sm font-black text-slate-800 flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2"><MapPin size={16} className="text-blue-500" /> Delivery Address</div>
                 <div className="bg-blue-50 text-blue-600 text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded-md">Required</div>
              </label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder:text-slate-400 resize-none transition-all focus:bg-white"
                rows={2}
                placeholder="E.g. Flat 301, Elite Residency, Sec 4..."
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
              />
            </div>

            {/* Bill Details - Instamart Receipt Style */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
               <h3 className="font-black text-sm text-slate-800 mb-4 pb-3 border-b border-dashed border-slate-200">Bill Details</h3>
               
               <div className="space-y-3 mb-4">
                   <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                       <span className="flex items-center gap-1">Item Total <span className="px-1.5 rounded bg-slate-100 text-[9px] text-slate-500 font-black tracking-widest uppercase">Inc. Taxes</span></span>
                       <span className="text-slate-800">
                          {itemDiscount > 0 ? (
                            <>
                              <del className="text-slate-400 mr-1.5">₹{totalMRP}</del>
                              <span>₹{subtotal.toFixed(2)}</span>
                            </>
                          ) : (
                             `₹${subtotal.toFixed(2)}`
                          )}
                       </span>
                   </div>
                   
                   <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                       <span>Handling Fee</span>
                       <span className="text-slate-800">₹{handlingFee}</span>
                   </div>
                   
                   <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                       <span className="flex items-center gap-1">Delivery Fee {isFreeDelivery && <span className="bg-green-100 text-green-700 text-[9px] px-1.5 rounded uppercase tracking-widest font-black">Free</span>}</span>
                       <span className="text-slate-800 flex items-center gap-1">
                          {isFreeDelivery ? (
                              <><del className="text-slate-400">₹{deliveryBaseFee}</del> <span className="text-green-600">Free</span></>
                          ) : (
                             `₹${deliveryBaseFee}`
                          )}
                       </span>
                   </div>
               </div>

               <div className="border-t border-dashed border-slate-300 pt-3 flex justify-between items-center">
                   <span className="font-black text-slate-800">Grand Total</span>
                   <span className="font-black text-lg text-slate-800">₹{total.toFixed(0)}</span>
               </div>
               
               {(itemDiscount > 0 || isFreeDelivery) && (
                   <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-2.5 flex items-center justify-center gap-2">
                        <span className="text-green-600 font-bold text-xs">
                          You are saving ₹{(itemDiscount + (isFreeDelivery ? deliveryBaseFee : 0)).toFixed(0)} on this order!
                        </span>
                   </div>
               )}

               {merchant?.minOrderValue > 0 && subtotal < merchant.minOrderValue && (
                   <div className="mt-3 bg-red-50 text-red-500 text-xs font-black px-3 py-2 rounded-xl border border-red-100 text-center uppercase tracking-widest">
                       Add ₹{(merchant.minOrderValue - subtotal).toFixed(0)} to meet minimum order
                   </div>
               )}
            </div>

            {/* Trust Marker */}
            <div className="flex items-center justify-center gap-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                100% Replacement Guarantee & Safe Payment
            </div>

            {/* Place order - Sticky Bottom Popover */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
               
               <div className="flex items-center gap-2 mb-3 max-w-sm mx-auto">
                   {([['RAZORPAY', 'Pay Online (UPI)', CreditCard], ['COD', 'Cash on Delivery', Banknote]] as const).map(([method, label, Icon]) => (
                     <button
                       key={method}
                       onClick={() => setPaymentMethod(method as any)}
                       className={`flex-1 flex flex-col items-center justify-center gap-2 p-2.5 rounded-2xl border-2 text-[10px] uppercase tracking-widest font-black transition-all ${
                         paymentMethod === method
                           ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                           : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                       }`}
                     >
                       <Icon size={18} /> {label}
                     </button>
                   ))}
               </div>

               <div className="max-w-sm mx-auto">
                   <motion.button
                       whileTap={{ scale: 0.98 }}
                       className="w-full bg-emerald-500 text-white font-black text-base py-5 rounded-2xl flex items-center justify-between px-6 shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                       disabled={placingOrder || (merchant?.minOrderValue > 0 && subtotal < merchant.minOrderValue)}
                       onClick={handlePlaceOrder}
                       id="btn-place-order"
                   >
                       <div className="text-left flex flex-col items-start leading-none">
                           <span className="text-emerald-100 text-[10px] uppercase tracking-widest mb-1">{total} • {items.length} ITEM{items.length > 1 ? 'S' : ''}</span>
                           <span>₹{total.toFixed(0)}</span>
                       </div>
                       
                       <div className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-xl group-hover:bg-emerald-700 transition-colors">
                           {placingOrder ? 'Processing...' : 'Place Order'} <ChevronRight size={18} className="translate-y-[0px] opacity-80" />
                       </div>
                   </motion.button>
               </div>
            </div>

          </div>
        )}
      </div>
    </AppShell>
  );
}
