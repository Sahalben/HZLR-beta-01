import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart, Plus, Minus, Search, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
      // Build category list from products
      const cats = Array.from(new Set(p.filter((x: any) => x.category).map((x: any) => JSON.stringify({ id: x.category.id, name: x.category.name, slug: x.category.slug }))))
        .map((s: any) => JSON.parse(s));
      setCategories(cats);
      setCart(c);
    }).catch(() => navigate('/store')).finally(() => setLoading(false));
  }, [id]);

  const getCartQty = (productId: string) => {
    return cart?.items?.find((i: any) => i.productId === productId)?.quantity || 0;
  };
  const cartTotal = cart?.items?.reduce((s: number, i: any) => s + i.priceAtAdd * i.quantity, 0) || 0;
  const cartCount = cart?.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;

  const handleAddToCart = async (product: any) => {
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

  const handleUpdateQty = async (item: any, delta: number) => {
    const newQty = item.quantity + delta;
    try {
      if (newQty <= 0) {
        await storeApi.removeCartItem(item.id);
      } else {
        await storeApi.updateCartItem(item.id, newQty);
      }
      const updated = await storeApi.getCart();
      setCart(updated);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
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
        <div className="min-h-screen bg-background animate-pulse p-4 space-y-4 pt-8">
          <div className="h-40 bg-muted rounded-2xl" />
          <div className="h-8 bg-muted rounded-xl w-3/4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-muted rounded-2xl" />)}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!merchant) return null;

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-32">
        {/* Store header */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 pt-4 pb-8 px-4 relative overflow-hidden">
          <button onClick={() => navigate(-1)} className="mb-4 p-2 bg-white/20 rounded-xl backdrop-blur-sm inline-flex">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="text-white">
            <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">{merchant.storeType}</p>
            <h1 className="text-2xl font-black mt-1">{merchant.storeName}</h1>
            {merchant.tagline && <p className="text-amber-100 text-sm mt-1">{merchant.tagline}</p>}
            <div className="flex items-center gap-4 mt-3 text-sm">
              {merchant.avgRating > 0 && (
                <span className="flex items-center gap-1 font-bold">
                  <Star size={14} fill="currentColor" /> {merchant.avgRating.toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1 text-amber-100">
                <MapPin size={13} /> {merchant.city}
              </span>
              <span className="flex items-center gap-1 text-amber-100">
                <Clock size={13} /> Min ₹{merchant.minOrderValue}
              </span>
            </div>
          </div>
          {merchant.freeDeliveryThreshold && (
            <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold backdrop-blur-sm inline-block">
              🎉 Free delivery above ₹{merchant.freeDeliveryThreshold}
            </div>
          )}
        </div>

        <div className="px-4 -mt-3 space-y-4 relative z-10">
          {/* Search */}
          <div className="relative shadow-md rounded-xl overflow-hidden">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full bg-card border border-border/50 rounded-xl pl-9 pr-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder={`Search in ${merchant.storeName}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="storefront-search"
            />
          </div>

          {/* Category tabs */}
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => setActiveCategory('all')}
                className={cn('shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all',
                  activeCategory === 'all' ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground')}>
                All
              </button>
              {categories.map(c => (
                <button key={c.id} onClick={() => setActiveCategory(c.slug)}
                  className={cn('shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all',
                    activeCategory === c.slug ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground')}>
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Product grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => {
              const qty = getCartQty(product.id);
              const cartItem = cart?.items?.find((i: any) => i.productId === product.id);
              return (
                <Card key={product.id} className="p-0 overflow-hidden border border-border/50 flex flex-col">
                  {/* Product image */}
                  <div className="bg-muted h-28 flex items-center justify-center text-4xl overflow-hidden relative shrink-0">
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      : <span className="opacity-30">🛒</span>}
                    {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Low Stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="text-xs font-bold text-muted-foreground">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-xs text-muted-foreground line-clamp-1">{product.unit}</p>
                    <h3 className="font-bold text-sm text-foreground line-clamp-2 flex-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-black text-sm text-foreground">₹{product.price}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-muted-foreground text-xs line-through ml-1">₹{product.mrp}</span>
                        )}
                      </div>
                      {product.stock === 0 ? null : qty === 0 ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingId === product.id}
                          className="bg-amber-500 text-white rounded-xl p-1.5 hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/25 disabled:opacity-60"
                          id={`btn-add-${product.id}`}
                        >
                          <Plus size={16} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl px-1 py-0.5">
                          <button onClick={() => handleUpdateQty(cartItem, -1)} className="p-1 text-amber-600"><Minus size={14} /></button>
                          <span className="text-amber-700 font-black text-sm w-4 text-center">{qty}</span>
                          <button onClick={() => handleUpdateQty(cartItem, 1)} className="p-1 text-amber-600"><Plus size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-semibold">No products found</p>
            </div>
          )}
        </div>

        {/* Sticky cart bar */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
            <div className="max-w-lg mx-auto">
              <Link to="/store/cart" id="btn-view-cart">
                <div className="bg-amber-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-amber-500/40">
                  <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm font-black">
                    {cartCount} items
                  </div>
                  <span className="font-black text-base">View Cart</span>
                  <span className="font-black text-base">₹{cartTotal.toFixed(0)}</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
