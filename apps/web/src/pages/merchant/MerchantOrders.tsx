import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Package, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: 'border-blue-400 bg-blue-50 dark:bg-blue-900/10 text-blue-700',
  PREPARING: 'border-purple-400 bg-purple-50 dark:bg-purple-900/10 text-purple-700',
  READY_FOR_PICKUP: 'border-orange-400 bg-orange-50 dark:bg-orange-900/10 text-orange-700',
  ASSIGNED: 'border-indigo-400 bg-indigo-50 text-indigo-700',
  OUT_FOR_DELIVERY: 'border-amber-400 bg-amber-50 dark:bg-amber-900/10 text-amber-700',
  DELIVERED: 'border-green-400 bg-green-50 dark:bg-green-900/10 text-green-700',
  CANCELLED: 'border-red-400 bg-red-50 text-red-700',
};

export default function MerchantOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await storeApi.getMerchantOrders();
      setOrders(data);
    } catch (e: any) {
      toast({ title: 'Error fetching orders', description: e.message, variant: 'destructive' });
      if (e.message.includes('required')) navigate('/merchant/onboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await storeApi.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast({ title: 'Status updated', description: `Order is now ${status.replace(/_/g, ' ')}` });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await storeApi.cancelOrder(orderId, 'Cancelled by Merchant');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      toast({ title: 'Order Cancelled' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const liveOrders = orders.filter(o => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status));
  const pastOrders = orders.filter(o => ['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status));

  const OrderCard = ({ order, isLive }: { order: any; isLive: boolean }) => (
    <Card className={cn('p-4 border-l-4 mb-3', STATUS_COLOR[order.status] || 'border-border')}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-sm text-foreground">#{order.id.slice(-6).toUpperCase()}</span>
            <span className={cn('text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm', STATUS_COLOR[order.status])}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            {order.items?.length} items · ₹{order.totalAmount} · {order.paymentMethod}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock size={12} /> {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs font-bold text-foreground mb-2">Items:</p>
        <div className="space-y-1">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-xs text-muted-foreground">
              <span>{item.quantity}x {item.productName}</span>
              <span>₹{item.totalPrice}</span>
            </div>
          ))}
        </div>
      </div>

      {isLive && (
        <div className="mt-4 flex gap-2 justify-end">
          {order.status !== 'ASSIGNED' && order.status !== 'OUT_FOR_DELIVERY' && (
            <Button size="sm" variant="outline" className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => cancelOrder(order.id)}>
              Cancel Order
            </Button>
          )}
          
          {order.status === 'CONFIRMED' && (
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold h-8 border-0"
              onClick={() => updateStatus(order.id, 'PREPARING')}>
              Start Preparing
            </Button>
          )}
          
          {order.status === 'PREPARING' && (
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold h-8 border-0"
              onClick={() => updateStatus(order.id, 'READY_FOR_PICKUP')}>
              Mark Ready
            </Button>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="-ml-2 rounded-full" onClick={() => navigate('/merchant/dashboard')}>
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div>
            <h1 className="font-black text-lg text-foreground">All Orders</h1>
            <p className="text-xs text-muted-foreground font-medium">{orders.length} total orders</p>
          </div>
        </div>

        <div className="p-4 relative z-10">
          <Tabs defaultValue="live">
            <TabsList className="w-full bg-muted/50 p-1 rounded-xl mb-4">
              <TabsTrigger value="live" className="flex-1 rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm">
                Live ({liveOrders.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1 rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                History ({pastOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live">
              {loading ? (
                <div className="animate-pulse space-y-4 pt-4"><div className="h-32 bg-muted rounded-2xl" /></div>
              ) : liveOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-bold text-sm">No live orders</p>
                </div>
              ) : (
                liveOrders.map(o => <OrderCard key={o.id} order={o} isLive={true} />)
              )}
            </TabsContent>

            <TabsContent value="past">
              {loading ? (
                <div className="animate-pulse space-y-4 pt-4"><div className="h-32 bg-muted rounded-2xl" /></div>
              ) : pastOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-bold text-sm">No past orders</p>
                </div>
              ) : (
                pastOrders.map(o => <OrderCard key={o.id} order={o} isLive={false} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  );
}
