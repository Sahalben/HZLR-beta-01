import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, TrendingUp, Bell, Settings, BarChart2, BookOpen, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { io as SocketIO } from 'socket.io-client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: 'border-blue-400 bg-blue-50 dark:bg-blue-900/10',
  PREPARING: 'border-purple-400 bg-purple-50 dark:bg-purple-900/10',
  READY_FOR_PICKUP: 'border-orange-400 bg-orange-50 dark:bg-orange-900/10',
  ASSIGNED: 'border-indigo-400 bg-indigo-50',
  OUT_FOR_DELIVERY: 'border-amber-400 bg-amber-50 dark:bg-amber-900/10',
  DELIVERED: 'border-green-400 bg-green-50 dark:bg-green-900/10',
  CANCELLED: 'border-red-400 bg-red-50',
};

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    Promise.all([storeApi.getMerchantMe(), storeApi.getMerchantOrders()])
      .then(([m, o]) => { setMerchant(m); setOrders(o.slice(0, 20)); })
      .catch(() => navigate('/merchant/onboard'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!merchant) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const socket = SocketIO(API_URL, { auth: { token: localStorage.getItem('token') } });
    socketRef.current = socket;
    socket.emit('join:merchant', merchant.id);
    socket.on('order:new', (data: any) => {
      toast({ title: '🛒 New Order!', description: `₹${data.total} — ${data.itemCount} items`, className: 'bg-amber-500 text-white border-0' });
      storeApi.getMerchantOrders().then(o => setOrders(o.slice(0, 20))).catch(() => {});
    });
    return () => { socket.disconnect(); };
  }, [merchant?.id]);

  const liveOrders = orders.filter(o => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status));
  const todayRevenue = orders.filter(o => o.status === 'DELIVERED' && new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((s, o) => s + o.totalAmount, 0);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await storeApi.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return <AppShell><div className="p-4 pt-8 animate-pulse space-y-4"><div className="h-32 bg-muted rounded-2xl" /><div className="h-48 bg-muted rounded-2xl" /></div></AppShell>;
  }

  if (!merchant) return null;

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-4 pt-10 pb-10 text-white relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-20 text-6xl">🏪</div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">Merchant Dashboard</p>
                <h1 className="text-2xl font-black mt-0.5">{merchant.storeName}</h1>
                <p className="text-amber-100 text-sm capitalize mt-0.5">{merchant.storeType} · {merchant.city}</p>
              </div>
              <Link to="/merchant/settings">
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm"><Settings size={20} /></div>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mt-5 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div className="text-center">
                <p className="text-xl font-black">₹{Math.round(todayRevenue)}</p>
                <p className="text-[10px] text-white/70 uppercase font-bold">Today</p>
              </div>
              <div className="text-center border-x border-white/15">
                <p className="text-xl font-black">{liveOrders.length}</p>
                <p className="text-[10px] text-white/70 uppercase font-bold">Live Orders</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black">{merchant.totalOrders}</p>
                <p className="text-[10px] text-white/70 uppercase font-bold">All Time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-4 space-y-5 relative z-10">
          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: BookOpen, label: 'Catalog', href: '/merchant/catalog' },
              { icon: ShoppingBag, label: 'Orders', href: '/merchant/orders' },
              { icon: BarChart2, label: 'Analytics', href: '/merchant/analytics' },
              { icon: Wallet, label: 'Payouts', href: '/merchant/settlements' },
            ].map(a => (
              <Link key={a.label} to={a.href} id={`merchant-nav-${a.label.toLowerCase()}`}>
                <Card className="p-3 text-center border border-border/50 hover:border-amber-300 transition-all flex flex-col items-center gap-1.5">
                  <a.icon size={20} className="text-amber-500" />
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wide">{a.label}</span>
                </Card>
              </Link>
            ))}
          </div>

          {/* Live orders queue */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-lg text-foreground">Live Orders</h2>
              <Link to="/merchant/orders" className="text-xs font-bold text-amber-500 uppercase tracking-wider">View All</Link>
            </div>

            {liveOrders.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-2 bg-transparent shadow-none">
                <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-bold text-foreground text-sm">No live orders</p>
                <p className="text-xs text-muted-foreground mt-1">New orders will appear here in real-time.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {liveOrders.map(order => (
                  <Card key={order.id} className={cn('p-4 border-l-4', STATUS_COLOR[order.status] || 'border-border')}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-black text-sm text-foreground">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{order.items?.length} items · ₹{order.totalAmount} · {order.paymentMethod}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 items-end">
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{order.status.replace(/_/g, ' ')}</span>
                        {order.status === 'CONFIRMED' && (
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 h-auto border-0"
                            onClick={() => updateStatus(order.id, 'PREPARING')} id={`btn-preparing-${order.id}`}>
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'PREPARING' && (
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1 h-auto border-0"
                            onClick={() => updateStatus(order.id, 'READY_FOR_PICKUP')} id={`btn-ready-${order.id}`}>
                            Mark Ready
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
