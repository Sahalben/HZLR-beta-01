import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, ChevronRight, Star, Clock, ShoppingBag, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

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
          // Reverse geocode with Nominatim
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
          setLocationName('Enable location for nearby stores');
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
    !searchQuery || m.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || m.storeType.includes(searchQuery.toLowerCase())
  );

  const storeTypeEmoji: Record<string, string> = {
    supermarket: '🏪', kirana: '🛒', pharmacy: '💊', bakery: '🥐', restaurant: '🍱',
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20">
        {/* Store Header */}
        <div className="bg-amber-500 text-white px-4 pt-10 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20" />
            <div className="absolute bottom-0 left-0 w-48 h-24 rounded-full bg-white/10" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-amber-100 text-xs font-bold tracking-wider uppercase">HZLR.store</p>
                <h1 className="text-2xl font-black mt-0.5">Deliver in Minutes</h1>
              </div>
              <div className="bg-white/20 rounded-xl p-2 backdrop-blur-sm">
                <Zap size={24} className="text-white" />
              </div>
            </div>

            {/* Location bar */}
            <button
              className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2.5 backdrop-blur-sm w-full text-left"
              onClick={() => void 0}
            >
              <MapPin size={16} className="text-amber-100 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-amber-100 tracking-wider">Delivering to</p>
                <p className="text-sm font-bold truncate">{locationName}</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-amber-200" />
            </button>
          </div>
        </div>

        <div className="px-4 -mt-8 relative z-10 space-y-5">
          {/* Search */}
          <div className="relative shadow-xl shadow-amber-500/10 rounded-2xl overflow-hidden">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full bg-card border-0 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-400/40 placeholder:text-muted-foreground"
              placeholder="Search stores, products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="store-search-input"
            />
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={cn('shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all',
                    !activeCategory ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground')}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)}
                    className={cn('shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all',
                      activeCategory === cat.slug ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground')}
                  >
                    {cat.iconEmoji} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Merchant grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-lg text-foreground">Stores Near You</h2>
              <span className="text-xs text-muted-foreground font-bold">{filtered.length} open</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-2 bg-transparent shadow-none">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="font-bold text-foreground">No stores found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {!userLocation ? 'Enable location to see nearby stores.' : 'No stores are open in your area yet.'}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filtered.map(m => (
                  <Link key={m.id} to={`/store/merchant/${m.id}`} id={`store-card-${m.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 border border-border/50 p-0">
                      {/* Store header strip */}
                      <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-20 relative flex items-end p-4">
                        <div className="text-3xl absolute top-3 right-4 opacity-60">
                          {storeTypeEmoji[m.storeType] || '🏪'}
                        </div>
                        <span className="text-[10px] bg-white/25 backdrop-blur-sm font-black uppercase tracking-wider text-white px-2 py-1 rounded-full">
                          {m.storeType}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-black text-base text-foreground leading-tight">{m.storeName}</h3>
                            {m.tagline && <p className="text-xs text-muted-foreground mt-0.5">{m.tagline}</p>}
                          </div>
                          <span className="text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg shrink-0">
                            ₹{m.minOrderValue}+
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {m.distanceKm?.toFixed(1)} km
                          </span>
                          {m.avgRating > 0 && (
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star size={11} fill="currentColor" />
                              {m.avgRating.toFixed(1)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {Math.round(m.distanceKm * 4 + 10)} min
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Become a merchant CTA */}
          <Card className="p-5 bg-gradient-to-br from-foreground to-foreground/90 text-background border-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-base">Own a store?</p>
                <p className="text-xs text-background/60 mt-0.5">List your products, reach more customers</p>
              </div>
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/30 border-0"
                onClick={() => navigate('/merchant/onboard')}
                id="btn-become-merchant"
              >
                List Store
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
