import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, Truck, MapPin, Home, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { io as SocketIO } from 'socket.io-client';
import { cn } from '@/lib/utils';

const STATUS_STEPS = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle, color: 'text-green-500' },
  { key: 'PREPARING', label: 'Store Preparing', icon: Package, color: 'text-blue-500' },
  { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: Clock, color: 'text-amber-500' },
  { key: 'ASSIGNED', label: 'Partner Assigned', icon: Truck, color: 'text-purple-500' },
  { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Truck, color: 'text-amber-500' },
  { key: 'DELIVERED', label: 'Delivered!', icon: Home, color: 'text-green-500' },
];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!id) return;
    storeApi.getOrder(id).then(setOrder).catch(() => navigate('/store/orders')).finally(() => setLoading(false));

    // Socket.io — join order room for live updates
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const socket = SocketIO(API_URL, { auth: { token: localStorage.getItem('token') } });
    socketRef.current = socket;

    socket.emit('join:order', id);
    socket.on('order:status', ({ status }: { status: string }) => {
      setOrder((prev: any) => prev ? { ...prev, status } : prev);
    });

    return () => { socket.disconnect(); };
  }, [id]);

  if (loading) {
    return (
      <AppShell>
        <div className="p-4 pt-8 space-y-4 animate-pulse">
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-8 bg-muted rounded" />
        </div>
      </AppShell>
    );
  }

  if (!order) return null;

  const currentIdx = STATUS_STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-10">
        <div className="px-4 pt-6">
          <button onClick={() => navigate('/store/orders')} className="flex items-center gap-2 text-muted-foreground mb-6">
            <ArrowLeft size={18} /> <span className="text-sm font-medium">My Orders</span>
          </button>

          {/* Status header */}
          <Card className={cn(
            'p-5 border-0 shadow-xl mb-6 text-white',
            isDelivered ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
            isCancelled ? 'bg-gradient-to-br from-red-500 to-red-600' :
            'bg-gradient-to-br from-amber-500 to-orange-500'
          )}>
            <p className="text-white/80 text-xs uppercase font-bold tracking-wider">Order #{order.id.slice(-8).toUpperCase()}</p>
            <h2 className="text-xl font-black mt-1">{isCancelled ? '❌ Order Cancelled' : isDelivered ? '✅ Delivered!' : '⏱ In Progress'}</h2>
            <p className="text-white/80 text-sm mt-1">{order.merchant?.storeName}</p>
            <div className="flex justify-between mt-4">
              <div>
                <p className="text-white/60 text-xs">Total</p>
                <p className="font-black text-lg">₹{order.totalAmount}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">Items</p>
                <p className="font-black text-lg">{order.items?.length}</p>
              </div>
            </div>
          </Card>

          {/* Progress stepper */}
          {!isCancelled && (
            <Card className="p-5 border border-border/50 mb-4">
              <h3 className="font-black text-sm text-foreground mb-4 uppercase tracking-wider">Live Status</h3>
              <div className="space-y-4">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                        isDone ? 'bg-amber-500 border-amber-500' : 'border-border bg-muted'
                      )}>
                        <Icon size={16} className={isDone ? 'text-white' : 'text-muted-foreground'} />
                      </div>
                      <div className="flex-1">
                        <p className={cn('text-sm font-bold', isDone ? 'text-foreground' : 'text-muted-foreground')}>
                          {step.label}
                        </p>
                        {isCurrent && !isDelivered && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                            <p className="text-xs text-amber-500 font-bold">In progress</p>
                          </div>
                        )}
                      </div>
                      {isDone && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Delivery partner info */}
          {order.assignment?.deliveryPartner && (
            <Card className="p-4 border border-border/50 mb-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-2xl shrink-0">
                🏍️
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Your Delivery Partner</p>
                <p className="font-black text-foreground">{order.assignment.deliveryPartner.vehicleType}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">Earning</p>
                <p className="font-bold text-sm text-amber-500">₹{order.assignment.totalEarning}</p>
              </div>
            </Card>
          )}

          {/* Order items */}
          <Card className="p-4 border border-border/50">
            <h3 className="font-black text-sm text-foreground mb-3">Order Summary</h3>
            <div className="space-y-2">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                  <span className="font-bold text-foreground">₹{item.totalPrice}</span>
                </div>
              ))}
              <div className="border-t border-border/50 pt-2 flex justify-between font-black">
                <span>Total</span>
                <span className="text-amber-500">₹{order.totalAmount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
