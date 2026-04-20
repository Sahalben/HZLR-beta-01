import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { cn } from '@/lib/utils';

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  READY_FOR_PICKUP: 'bg-orange-100 text-orange-700',
  ASSIGNED: 'bg-indigo-100 text-indigo-700',
  OUT_FOR_DELIVERY: 'bg-amber-100 text-amber-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

export default function CustomerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storeApi.getMyOrders().then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-10">
        <div className="px-4 pt-8">
          <h1 className="text-2xl font-black text-foreground mb-6">My Orders</h1>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="w-14 h-14 mx-auto text-muted-foreground/20 mb-4" />
              <h2 className="font-black text-xl text-foreground">No orders yet</h2>
              <p className="text-sm text-muted-foreground mt-2">Start shopping from nearby stores.</p>
              <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white border-0" onClick={() => navigate('/store')} id="btn-start-shopping">
                Browse Stores
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <Link key={order.id} to={`/store/orders/${order.id}`} id={`order-card-${order.id}`}>
                  <Card className="p-4 border border-border/50 hover:shadow-md transition-shadow flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {order.merchant?.logoUrl ? <img src={order.merchant.logoUrl} className="w-full h-full object-cover rounded-xl" alt="" /> : '🛒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-foreground">{order.merchant?.storeName}</p>
                      <p className="text-xs text-muted-foreground">{order.items?.length} items · ₹{order.totalAmount}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={cn('text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full', STATUS_COLOR[order.status] || 'bg-muted text-muted-foreground')}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
