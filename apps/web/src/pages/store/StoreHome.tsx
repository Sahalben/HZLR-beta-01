import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, Clock, ShoppingBag, Zap, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoreHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    storeApi.getCategories().then(setCategories).catch(() => {});
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setUserLocation({ lat, lng });
          try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const d = await r.json();
            setLocationName(d.address?.suburb || d.address?.city_district || d.address?.city || 'Your Area');
          } catch {
            setLocationName('Your Area');
          }
          loadMerchants(lat, lng);
        },
        () => {
          setLocationName('Enable location for stores');
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const loadMerchants = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const data = await storeApi.getNearby(lat, lng, 15);
      setMerchants(data);
    } catch {
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const filtered = merchants.filter(m =>
    (!searchQuery || m.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || m.storeType.includes(searchQuery.toLowerCase())) &&
    (!activeCategory || activeCategory === m.storeType) // Fallback as we don't have per-store category mappings easily yet
  );

  const storeTypeEmoji: Record<string, string> = {
    supermarket: '🏪', kirana: '🛒', pharmacy: '💊', bakery: '🥐', restaurant: '🍱',
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50 pb-20">
        
        {/* Dynamic Header & Location Sticky Strip */}
        <div className="sticky top-[58px] z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
            <button className="flex items-center gap-1.5 max-w-[70%]">
                <MapPin size={22} className="text-amber-500 shrink-0" fill="currentColor" strokeWidth={1} />
                <div className="text-left flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-1">
                        <span className="font-black text-sm text-slate-800 tracking-tight truncate">Home</span>
                        <ChevronDown size={14} className="text-slate-600" />
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{locationName}</p>
                </div>
            </button>
            <div className="bg-amber-100 rounded-lg px-2 py-1 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-400 opacity-20 animate-pulse" />
                <span className="font-black text-amber-700 text-xs">15 MINS</span>
                <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest">Delivery</span>
            </div>
        </div>

        <div className="px-4 mt-4 space-y-6">
          {/* Main Search Input */}
          <div className="relative shadow-sm rounded-2xl overflow-hidden">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 shadow-inner text-slate-800"
              placeholder="Search 'Milk' or 'Eggs'..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="store-search-input"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300">
                | 🎤
            </div>
          </div>

          {/* Promotional Banners Carousel */}
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide -mx-4 px-4">
              {[
                { title: 'Essentials', sub: 'Up to 50% OFF', color: 'from-purple-500 to-indigo-600', img: '🍞' },
                { title: 'Late Night', sub: 'Snacks & Cravings', color: 'from-amber-400 to-orange-500', img: '🍫' },
                { title: 'Pharmacy', sub: 'Needs within 15 Min', color: 'from-teal-400 to-emerald-500', img: '💊' }
              ].map((banner, i) => (
                  <motion.div 
                     key={i} 
                     whileTap={{ scale: 0.95 }}
                     className={`shrink-0 w-64 h-32 rounded-3xl bg-gradient-to-r ${banner.color} p-4 text-white relative overflow-hidden shadow-md`}
                  >
                      <div className="absolute -right-4 -bottom-4 text-6xl opacity-70 filter drop-shadow-lg">{banner.img}</div>
                      <div className="relative z-10 w-2/3">
                          <p className="text-[10px] font-black uppercase tracking-wider opacity-90">{banner.sub}</p>
                          <h3 className="font-black text-xl mt-1 leading-tight">{banner.title}</h3>
                          <button className="mt-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold w-fit">Shop Now</button>
                      </div>
                  </motion.div>
              ))}
          </div>

          {/* Categories Grid (Zepto Style) */}
          {categories.length > 0 && (
            <div>
              <h2 className="font-black text-sm text-slate-800 uppercase tracking-wider mb-3">Explore by Category</h2>
              <div className="grid grid-cols-4 gap-3">
                {categories.slice(0, 8).map((cat, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)}
                    className={cn('flex flex-col items-center gap-2 rounded-xl text-center',
                      activeCategory === cat.slug ? 'scale-105' : 'hover:scale-105 transition-transform')}
                  >
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100", 
                       activeCategory === cat.slug ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-white')}>
                        {cat.iconEmoji}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 leading-tight">{cat.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Merchant feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg text-slate-800">Stores near you</h2>
              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">{filtered.length} Open</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-2 bg-transparent shadow-none">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="font-bold text-slate-800">No stores found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {!userLocation ? 'Enable location to see nearby stores.' : 'No stores are open in your area yet.'}
                </p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filtered.map(m => (
                    <motion.div key={m.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Link to={`/store/merchant/${m.id}`} id={`store-card-${m.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white rounded-3xl relative">
                        {/* Store cover image area */}
                        <div className="bg-gradient-to-r from-slate-100 to-slate-200 h-28 relative flex p-3">
                           <div className="absolute right-0 bottom-0 text-7xl opacity-10 translate-x-4 translate-y-4 filter blur-[2px]">
                              {storeTypeEmoji[m.storeType] || '🏪'}
                           </div>
                           
                           {/* Delivery time pill overlay */}
                           <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-xl px-2 py-1 shadow-sm flex flex-col items-center">
                               <span className="text-xs font-black text-slate-800">{Math.round(m.distanceKm * 4 + 10)}</span>
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">MINS</span>
                           </div>

                           {/* Free Delivery badge */}
                           {m.freeDeliveryThreshold && (
                               <div className="absolute bottom-3 left-3 bg-green-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md shadow-sm">
                                   Free Delivery Available
                               </div>
                           )}
                        </div>

                        {/* Store Details Box */}
                        <div className="p-4 relative">
                          {/* Store Avatar overlapping */}
                          <div className="absolute -top-10 left-4 w-16 h-16 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center text-3xl">
                              {storeTypeEmoji[m.storeType] || '🏪'}
                          </div>
                          
                          <div className="mt-6 flex items-start justify-between">
                            <div className="pr-2">
                              <h3 className="font-black text-base text-slate-800 leading-tight">{m.storeName}</h3>
                              {m.tagline ? <p className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">{m.tagline}</p> : <p className="text-[11px] font-medium text-slate-500 mt-0.5 uppercase tracking-wider">{m.storeType}</p>}
                            </div>
                            {m.avgRating > 0 && (
                                <div className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-lg flex items-center gap-1 font-bold text-xs shrink-0 mt-0.5">
                                    <Star size={10} fill="currentColor" />
                                    {m.avgRating.toFixed(1)}
                                </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 mt-4 text-[11px] font-bold text-slate-400">
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                              <MapPin size={10} className="text-amber-500" />
                              {m.distanceKm?.toFixed(1)} KM AWAY
                            </span>
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                              ₹{m.minOrderValue} MIN ORDER
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </AppShell>
  );
}
