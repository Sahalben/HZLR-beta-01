import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart, Plus, Minus, Search, ChevronRight, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function MerchantStorefront() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      storeApi.getMerchant(id),
      storeApi.getProducts(id),
      storeApi.getCart(),
    ]).then(([m, p, c]) => {
      setMerchant(m);
      setProducts(p);
      const cats = Array.from(new Set(p.filter((x: any) => x.category).map((x: any) => JSON.stringify({ id: x.category.id, name: x.category.name, slug: x.category.slug }))))
        .map((s: any) => JSON.parse(s));
      setCategories(cats);
      setCart(c);
    }).catch(() => navigate('/store')).finally(() => setLoading(false));
  }, [id]);

  const getCartQty = (productId: string) => cart?.items?.find((i: any) => i.productId === productId)?.quantity || 0;
  const cartTotal = cart?.items?.reduce((s: number, i: any) => s + i.priceAtAdd * i.quantity, 0) || 0;
  const cartCount = cart?.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
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
    const newQty = item.quantity + delta;
    try {
      // Optimistic update locally
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
      storeApi.getCart().then(setCart); // revert
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category?.slug === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-slate-50 animate-pulse p-4 space-y-4 pt-8">
          <div className="h-48 bg-slate-200 rounded-3xl" />
          <div className="h-12 bg-slate-200 rounded-2xl w-full" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-slate-200 rounded-3xl" />)}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!merchant) return null;

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50 pb-32">
        {/* Top Header - Stores Info */}
        <div className="bg-white px-4 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
              <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-xl shrink-0">
                <ArrowLeft size={20} className="text-slate-700" />
              </button>
              <div className="min-w-0">
                  <h1 className="text-xl font-black text-slate-800 leading-tight truncate">{merchant.storeName}</h1>
                  <p className="text-xs text-slate-500 font-bold truncate">{merchant.tagline || merchant.storeType}</p>
              </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2">
                  <div className="bg-green-100 text-green-700 w-8 h-8 rounded-xl flex items-center justify-center font-black">
                      <Star size={16} fill="currentColor" />
                  </div>
                  <div>
                      <p className="text-sm font-black text-slate-800">{merchant.avgRating > 0 ? merchant.avgRating.toFixed(1) : 'New'}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Rating</p>
                  </div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex items-center gap-2">
                  <div className="bg-amber-100 text-amber-600 w-8 h-8 rounded-xl flex items-center justify-center font-black">
                      <Clock size={16} />
                  </div>
                  <div>
                      <p className="text-sm font-black text-slate-800">{Math.round(merchant.distanceKm * 4 + 10)} mins</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Delivery</p>
                  </div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex items-center gap-2">
                  <div className="bg-slate-200 text-slate-600 w-8 h-8 rounded-xl flex items-center justify-center font-black">
                      <MapPin size={16} />
                  </div>
                  <div>
                      <p className="text-sm font-black text-slate-800">{merchant.distanceKm?.toFixed(1)} km</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Away</p>
                  </div>
              </div>
          </div>
        </div>

        {/* Sticky Search and Category Bar - Blinkit Inspired */}
        <div className="sticky top-[58px] z-40 bg-white shadow-sm pb-3">
            <div className="px-4 pt-2 mb-3">
                <div className="relative shadow-sm rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                    className="w-full bg-transparent border-0 pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-400 text-slate-800"
                    placeholder={`Search in ${merchant.storeName.split(' ')[0]}...`}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {categories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
                <button onClick={() => setActiveCategory('all')}
                    className={cn('shrink-0 px-5 py-2 rounded-xl text-xs font-black transition-all border',
                    activeCategory === 'all' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}>
                    All
                </button>
                {categories.map(c => (
                    <button key={c.id} onClick={() => setActiveCategory(c.slug)}
                    className={cn('shrink-0 px-5 py-2 rounded-xl text-xs font-black transition-all border',
                        activeCategory === c.slug ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}>
                    {c.name}
                    </button>
                ))}
                </div>
            )}
        </div>
        
        {/* Free delivery banner if applicable */}
        {merchant.freeDeliveryThreshold && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-green-100 px-4 py-2 flex items-center justify-center gap-2">
                <span className="text-green-600">🎉</span>
                <span className="text-xs font-bold text-green-700">Free delivery on orders above ₹{merchant.freeDeliveryThreshold}</span>
            </div>
        )}

        <div className="p-4 relative z-10">
          {/* Zepto/Blinkit Dense Product grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {filteredProducts.map(product => {
              const qty = getCartQty(product.id);
              const cartItem = cart?.items?.find((i: any) => i.productId === product.id);
              return (
                <div key={product.id} className="flex flex-col relative group">
                  {/* Product Image Area */}
                  <div className="bg-white rounded-2xl mb-2 aspect-square flex items-center justify-center overflow-hidden relative shadow-sm border border-slate-100 p-2">
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                      : <div className="text-5xl opacity-10 filter blur-sm">🛒</div>}
                      
                      {/* Out of stock overlay */}
                      {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Sold Out</span>
                          </div>
                      )}
                      
                      {/* Discount or tag mock */}
                      {product.mrp && product.mrp > product.price && product.stock > 0 && (
                          <div className="absolute top-0 left-0 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-br-xl">
                              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                          </div>
                      )}
                      
                      {/* The dynamic Add button overlayed on Bottom Center of image like Zepto */}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 z-10">
                         {product.stock === 0 ? null : qty === 0 ? (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={addingId === product.id}
                                className="w-full bg-white border border-green-500 text-green-600 shadow-md rounded-xl py-1.5 font-black text-sm hover:bg-green-50 transition-colors uppercase tracking-wider relative overflow-hidden"
                            >
                                ADD
                                <div className="absolute right-1 top-0 bottom-0 flex items-center text-green-500/50"><Plus size={14}/></div>
                            </motion.button>
                        ) : (
                            <div className="w-full bg-green-600 text-white shadow-md rounded-xl py-1.5 flex items-center justify-between px-2">
                                <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => handleUpdateQty(cartItem, -1, e)} className="p-1"><Minus size={14} /></motion.button>
                                <motion.span key={qty} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-black text-sm">{qty}</motion.span>
                                <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => handleUpdateQty(cartItem, 1, e)} className="p-1"><Plus size={14} /></motion.button>
                            </div>
                        )}
                      </div>
                  </div>
                  
                  {/* Product Metadata */}
                  <div className="pt-4 flex flex-col flex-1">
                    <p className="text-xs text-slate-500 font-semibold mb-0.5 line-clamp-1">{product.unit || '1 pc'}</p>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight flex-1">{product.name}</h3>
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-slate-400">
               <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p className="font-bold text-slate-800">No products found</p>
               <p className="text-sm">Try searching for something else</p>
            </div>
          )}
        </div>

        {/* Instamart-style Floating Sticky Cart Strip */}
        <AnimatePresence>
            {cartCount > 0 && (
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-4 left-4 right-4 z-50 md:bottom-20 md:left-auto md:right-4 md:w-96"
            >
                <Link to="/store/cart" id="btn-view-cart">
                    <div className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-emerald-500/30 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-2 text-xs font-black flex flex-col items-center leading-none">
                                <span>{cartCount}</span>
                                <span className="opacity-70 text-[8px] uppercase mt-0.5">Items</span>
                            </div>
                            <div>
                                <p className="font-black text-base flex items-center gap-1">₹{cartTotal.toFixed(0)} <del className="text-xs opacity-60 font-medium ml-1">₹{Math.round(cartTotal * 1.15)}</del></p>
                                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-0.5">Extra discount applied</p>
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center gap-1 font-black text-emerald-50 text-sm">
                            View Cart <ChevronRight size={18} />
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
