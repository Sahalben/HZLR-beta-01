import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, ChevronDown, Plus, Minus, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { useLocation } from '@/contexts/LocationContext';
import { LocationModal } from '@/components/store/LocationModal';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoreHome() {
  const navigate = useNavigate();
  const { coordinates, addressName, setIsModalOpen, isLoading: isLocLoading } = useLocation();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  // If a user tries to add from a different merchant, track the pending attempt
  const [pendingCrossMerchantAdd, setPendingCrossMerchantAdd] = useState<any | null>(null);

  useEffect(() => {
    storeApi.getCategories().then(setCategories).catch(() => {});
    storeApi.getCart().then(setCart).catch(() => {});
  }, []);

  useEffect(() => {
    if (coordinates) {
      setLoading(true);
      storeApi.getNearbyProducts(coordinates.lat, coordinates.lng, 15)
        .then(setProducts)
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [coordinates]);

  const getCartQty = (productId: string) => cart?.items?.find((i: any) => i.productId === productId)?.quantity || 0;
  
  const currentCartMerchantId = cart?.items?.[0]?.product?.merchantId;

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentCartMerchantId && currentCartMerchantId !== product.merchantId) {
        setPendingCrossMerchantAdd(product);
        return;
    }

    setAddingId(product.id);
    try {
      await storeApi.addToCart(product.id, 1);
      const updated = await storeApi.getCart();
      setCart(updated);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setAddingId(null);
    }
  };

  const handleUpdateQty = async (item: any, delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQty = item.quantity + delta;
    try {
      setCart((prev: any) => {
          const newItems = prev.items.map((i: any) => i.id === item.id ? { ...i, quantity: newQty } : i).filter((i: any) => i.quantity > 0);
          return { ...prev, items: newItems };
      });
      if (newQty <= 0) await storeApi.removeCartItem(item.id);
      else await storeApi.updateCartItem(item.id, newQty);
      const updated = await storeApi.getCart();
      setCart(updated);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
      storeApi.getCart().then(setCart);
    }
  };

  const handleDiscardAndAdd = async () => {
      if (!pendingCrossMerchantAdd) return;
      setAddingId(pendingCrossMerchantAdd.id);
      
      try {
          await storeApi.clearCart();
          await storeApi.addToCart(pendingCrossMerchantAdd.id, 1);
          const updated = await storeApi.getCart();
          setCart(updated);
          toast({ title: 'Cart Updated', description: `Started a new cart from ${pendingCrossMerchantAdd.merchant?.storeName}` });
      } catch (error: any) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
          setAddingId(null);
          setPendingCrossMerchantAdd(null);
      }
  };

  // Group products algorithmically
  const groupedProducts = useMemo(() => {
     const groups: Record<string, any[]> = {};
     products.forEach(p => {
         const name = p.category?.name || 'Other';
         if (!groups[name]) groups[name] = [];
         groups[name].push(p);
     });
     // Process arrays to render biggest categories first
     const sortedKeys = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length).slice(0, 5);
     return sortedKeys.map(key => ({ name: key, items: groups[key].slice(0, 10), icon: groups[key][0].category?.iconEmoji || '📦' }));
  }, [products]);

  const cartTotalAmount = cart?.items?.reduce((s: number, i: any) => s + i.priceAtAdd * i.quantity, 0) || 0;
  const cartCount = cart?.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50 pb-32">
        <LocationModal />

        {/* Dynamic Location Header Strip */}
        <div className="sticky top-[58px] z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between border-b border-slate-100">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 max-w-[70%] group">
                <MapPin size={22} className="text-amber-500 shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" strokeWidth={1} />
                <div className="text-left flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-1">
                        <span className="font-black text-sm text-slate-800 tracking-tight truncate">Delivery to</span>
                        <ChevronDown size={14} className="text-amber-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5 font-bold">
                        {isLocLoading ? 'Detecting...' : (coordinates ? addressName : 'Select Location')}
                    </p>
                </div>
            </button>
            <div className="bg-amber-100 rounded-lg px-2 py-1 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-400 opacity-20 animate-pulse" />
                <span className="font-black text-amber-700 text-xs">15 MINS</span>
                <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest">Delivery</span>
            </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
             <div className="p-4 space-y-6 animate-pulse">
                <div className="h-12 bg-slate-200 rounded-2xl w-full" />
                <div className="h-32 bg-slate-200 rounded-2xl w-full" />
                <div className="h-48 bg-slate-200 rounded-2xl w-full" />
             </div>
        ) : !coordinates ? (
            <div className="p-8 text-center pt-32">
                <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h2 className="font-black text-2xl text-slate-800 mb-2">Location Required</h2>
                <p className="text-sm text-slate-500 font-medium mb-6">We need your location to show products available near you.</p>
                <Button onClick={() => setIsModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 font-black px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/20 text-white">
                    Set Delivery Location
                </Button>
            </div>
        ) : (
            <div className="px-4 mt-4 space-y-8">
                
                {/* Search Engine */}
                <div className="relative shadow-sm rounded-2xl overflow-hidden bg-white border border-slate-200">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input
                        className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 text-slate-800"
                        placeholder="Search 'Milk', 'Eggs', 'Cola'..."
                        id="global-product-search"
                    />
                </div>

                {/* Categories Grid (Zepto Style) */}
                {categories.length > 0 && (
                    <div>
                        <h2 className="font-black text-sm text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                            Shop By Category
                        </h2>
                        <div className="grid grid-cols-4 gap-3">
                            {categories.slice(0, 8).map((cat, idx) => (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                key={cat.id}
                                className="flex flex-col items-center gap-2 rounded-xl text-center group"
                            >
                                <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-slate-100 bg-white group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                                     <div className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                                     <span className="relative z-10">{cat.iconEmoji}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-700 leading-tight w-full truncate">{cat.name}</span>
                            </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dynamic Product Ribbons */}
                {groupedProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="font-bold text-slate-800">No stores serving this area</p>
                        <p className="text-sm text-slate-500 mt-1">Try a different location or check back soon!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {groupedProducts.map((group, gIdx) => (
                            <div key={group.name}>
                                <div className="flex items-center justify-between mb-3">
                                   <h2 className="font-black text-lg text-slate-800 flex items-center gap-2">
                                       <span className="text-2xl">{group.icon}</span> {group.name}
                                   </h2>
                                   <button className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center">
                                       See all <ChevronRight size={14} className="ml-0.5" />
                                   </button>
                                </div>
                                
                                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                                    {group.items.map((product: any) => {
                                        const qty = getCartQty(product.id);
                                        const cartItem = cart?.items?.find((i: any) => i.productId === product.id);
                                        
                                        return (
                                            <div key={product.id} className="shrink-0 w-36 flex flex-col relative group cursor-pointer" onClick={() => navigate(`/store/merchant/${product.merchantId}`)}>
                                                {/* Product Image Area */}
                                                <div className="bg-white rounded-2xl mb-2 aspect-square flex items-center justify-center overflow-hidden relative shadow-sm border border-slate-100 p-2">
                                                    {product.imageUrl
                                                    ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                                    : <div className="text-5xl opacity-10 filter blur-[2px]">{group.icon}</div>}
                                                    
                                                    {/* Delivery Time Overlay */}
                                                    <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-md rounded-md px-1.5 py-0.5 shadow-sm text-[8px] font-black text-slate-800 flex items-center gap-0.5">
                                                        <Clock size={8} className="text-amber-500" />
                                                        {Math.round(product.merchant.distanceKm * 4 + 10)}m
                                                    </div>

                                                    {product.stock === 0 && (
                                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                                                            <span className="bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Sold Out</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Global Add Button Overlay */}
                                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] z-10">
                                                        {product.stock === 0 ? null : qty === 0 ? (
                                                            <motion.button
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={(e) => handleAddToCart(product, e)}
                                                                disabled={addingId === product.id}
                                                                className="w-full bg-white border border-green-500 text-green-600 shadow-md rounded-xl py-1 font-black text-[11px] hover:bg-green-50 transition-colors uppercase tracking-widest relative overflow-hidden"
                                                            >
                                                                ADD
                                                                <div className="absolute right-1 top-0 bottom-0 flex items-center text-green-500/50"><Plus size={12}/></div>
                                                            </motion.button>
                                                        ) : (
                                                            <div className="w-full bg-green-600 text-white shadow-md rounded-xl py-1 flex items-center justify-between px-1.5">
                                                                <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => handleUpdateQty(cartItem, -1, e)} className="p-0.5"><Minus size={14} /></motion.button>
                                                                <motion.span key={qty} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="font-black text-[11px]">{qty}</motion.span>
                                                                <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => handleUpdateQty(cartItem, 1, e)} className="p-0.5"><Plus size={14} /></motion.button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Details */}
                                                <div className="pt-3 flex flex-col flex-1 px-1">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <span className="text-[9px] text-slate-500 font-bold bg-slate-100 px-1.5 rounded uppercase">{product.merchant.storeName.split(' ')[0]}</span>
                                                    </div>
                                                    <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-tight flex-1">{product.name}</h3>
                                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{product.unit || '1 pc'}</p>
                                                    <div className="mt-1 flex items-end gap-1">
                                                        <span className="font-black text-sm text-slate-800">₹{product.price}</span>
                                                        {product.mrp && product.mrp > product.price && (
                                                        <span className="text-slate-400 text-[10px] font-semibold line-through mb-[2px]">₹{product.mrp}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Cross Merchant Discard Modal */}
        <AnimatePresence>
            {pendingCrossMerchantAdd && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4 mx-auto">
                            <ShoppingBag size={24} />
                        </div>
                        <h2 className="text-xl font-black text-center text-slate-800 mb-2">Checkout from multiple stores?</h2>
                        <p className="text-sm text-center text-slate-500 font-medium mb-6">Your cart currently has items from another store. Do you want to discard your previous cart and start a new one with <span className="font-bold text-slate-800">{pendingCrossMerchantAdd.merchant?.storeName}</span>?</p>
                        
                        <div className="flex gap-3">
                            <Button onClick={() => setPendingCrossMerchantAdd(null)} variant="outline" className="flex-1 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={handleDiscardAndAdd} className="flex-1 bg-amber-500 hover:bg-amber-600 rounded-xl font-black text-white border-0 shadow-lg shadow-amber-500/20">
                                Discard & Add
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Global Floating Cart (same as merchant but omnipresent on homepage) */}
        <AnimatePresence>
            {cartCount > 0 && !pendingCrossMerchantAdd && (
            <motion.div 
                initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                className="fixed bottom-[72px] md:bottom-4 left-4 right-4 z-[90] md:left-auto md:w-96"
            >
                <Link to="/store/cart" id="btn-view-global-cart">
                    <div className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-emerald-500/30 overflow-hidden relative border border-emerald-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-2 text-xs font-black flex flex-col items-center leading-none">
                                <span>{cartCount}</span>
                                <span className="opacity-70 text-[8px] uppercase mt-0.5">Items</span>
                            </div>
                            <div>
                                <p className="font-black text-base">₹{cartTotalAmount.toFixed(0)}</p>
                                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-0.5">Proceed to Checkout</p>
                            </div>
                        </div>
                        <div className="relative z-10 flex items-center gap-1 font-black text-emerald-50 text-sm">
                            View Cart <ArrowRight size={18} className="translate-y-[1px]" />
                        </div>
                    </div>
                </Link>
            </motion.div>
            )}
        </AnimatePresence>

      </div>
    </AppShell>
  );
}
