import React, { useState, useEffect } from 'react';
import { Bike, Zap, MapPin, Package, CheckCircle, Clock, XCircle, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { io as SocketIO } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function DeliveryLive() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [liveAssignment, setLiveAssignment] = useState<any>(null);
  const [dispatch, setDispatch] = useState<any>(null); // incoming dispatch modal
  const [dispatchCountdown, setDispatchCountdown] = useState(30);

  useEffect(() => {
    storeApi.getAssignments().then(setAssignments).catch(() => {});

    // Socket.io
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const socket = SocketIO(API_URL, { auth: { token: localStorage.getItem('token') } });

    socket.emit('join:delivery', user?.id);
    socket.on('dispatch:push', (data: any) => {
      setDispatch(data);
      setDispatchCountdown(30);
    });

    return () => { socket.disconnect(); };
  }, [user?.id]);

  // Countdown timer
  useEffect(() => {
    if (!dispatch) return;
    if (dispatchCountdown <= 0) {
      setDispatch(null); return;
    }
    const t = setTimeout(() => setDispatchCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [dispatch, dispatchCountdown]);

  const toggleOnline = async () => {
    setToggling(true);
    try {
      let lat: number | undefined, lng: number | undefined;
      if (!isOnline) {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        lat = pos.coords.latitude; lng = pos.coords.longitude;
      }
      await storeApi.setAvailability(!isOnline, lat, lng);
      setIsOnline(v => !v);
      toast({ title: !isOnline ? '🟢 You are online!' : '⚫ You are offline', className: !isOnline ? 'bg-green-500 text-white border-0' : '' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setToggling(false); }
  };

  const handleAccept = async () => {
    if (!dispatch) return;
    try {
      await storeApi.acceptAssignment(dispatch.assignmentId);
      setLiveAssignment(dispatch);
      setDispatch(null);
      toast({ title: '✅ Order accepted!', description: 'Head to the store for pickup.' });
      storeApi.getAssignments().then(setAssignments).catch(() => {});
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const handleDecline = async () => {
    if (!dispatch) return;
    try {
      await storeApi.declineAssignment(dispatch.assignmentId);
      setDispatch(null);
    } catch { setDispatch(null); }
  };

  const handleStep = async (step: 'picked-up' | 'delivered') => {
    if (!liveAssignment) return;
    try {
      if (step === 'picked-up') {
        await storeApi.pickedUp(liveAssignment.assignmentId);
        setLiveAssignment((la: any) => ({ ...la, pickedUp: true }));
        toast({ title: '📦 Picked up!', description: 'Now head to customer location.' });
      } else {
        const result: any = await storeApi.delivered(liveAssignment.assignmentId);
        toast({ title: `🎉 Delivered! ₹${result.earning} added to wallet`, className: 'bg-green-500 text-white border-0' });
        setLiveAssignment(null);
        storeApi.getAssignments().then(setAssignments).catch(() => {});
      }
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const todayEarning = assignments.filter(a => a.status === 'COMPLETED' && new Date(a.createdAt).toDateString() === new Date().toDateString())
    .reduce((s, a) => s + (a.totalEarning || 0), 0);

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-10">
        {/* Header */}
        <div className={cn('px-4 pt-10 pb-8 relative overflow-hidden text-white transition-all duration-500',
          isOnline ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-foreground to-foreground/90')}>
          <div className="relative">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Delivery Mode</p>
            <h1 className="text-2xl font-black mt-0.5">{isOnline ? '🟢 Online — Accepting Orders' : '⚫ Offline'}</h1>
            <div className="grid grid-cols-2 gap-3 mt-5 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-xl font-black">₹{Math.round(todayEarning)}</p>
                <p className="text-[10px] text-white/70 uppercase font-bold">Today's Earning</p>
              </div>
              <div className="text-center border-l border-white/15">
                <p className="text-xl font-black">{assignments.filter(a => a.status === 'COMPLETED').length}</p>
                <p className="text-[10px] text-white/70 uppercase font-bold">Deliveries Done</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-4 space-y-5 relative z-10">
          {/* Toggle online/offline */}
          <Button
            className={cn('w-full py-6 text-base font-black rounded-2xl border-0 shadow-xl transition-all',
              isOnline ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25' : 'bg-green-500 hover:bg-green-600 shadow-green-500/25')}
            disabled={toggling}
            onClick={toggleOnline}
            id="btn-toggle-online"
          >
            {toggling ? 'Updating...' : isOnline ? '⚫ Go Offline' : '🟢 Go Online & Accept Orders'}
          </Button>

          {/* Live Assignment */}
          {liveAssignment && (
            <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/10 p-5 space-y-4">
              <p className="font-black text-amber-600 uppercase tracking-wider text-xs">Active Delivery</p>
              <h3 className="font-black text-foreground text-base">{liveAssignment.merchant?.storeName}</h3>
              <p className="text-sm text-muted-foreground">{liveAssignment.merchant?.address}</p>
              <p className="text-sm font-bold text-foreground">Earning: <span className="text-amber-500">₹{liveAssignment.earning}</span></p>
              <div className="grid grid-cols-2 gap-2">
                {!liveAssignment.pickedUp ? (
                  <Button className="col-span-2 bg-amber-500 hover:bg-amber-600 text-white font-bold border-0"
                    onClick={() => handleStep('picked-up')} id="btn-picked-up">
                    <Package size={16} className="mr-2" /> Mark Picked Up
                  </Button>
                ) : (
                  <Button className="col-span-2 bg-green-500 hover:bg-green-600 text-white font-bold border-0"
                    onClick={() => handleStep('delivered')} id="btn-delivered">
                    <CheckCircle size={16} className="mr-2" /> Mark Delivered
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Recent assignments */}
          <div>
            <h2 className="font-black text-lg text-foreground mb-3">Recent Deliveries</h2>
            {assignments.slice(0, 10).map(a => (
              <Card key={a.id} className="p-4 border border-border/50 mb-2 flex items-center gap-3">
                <div className={cn('w-2 h-2 rounded-full shrink-0', a.status === 'COMPLETED' ? 'bg-green-500' : a.status === 'DECLINED' ? 'bg-red-400' : 'bg-amber-400')} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground line-clamp-1">{a.order?.merchant?.storeName || 'Order'}</p>
                  <p className="text-xs text-muted-foreground">{a.distanceKm?.toFixed(1)} km · {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={cn('font-black text-sm', a.status === 'COMPLETED' ? 'text-green-500' : 'text-muted-foreground')}>
                  {a.status === 'COMPLETED' ? `+₹${a.totalEarning}` : a.status}
                </span>
              </Card>
            ))}
            {assignments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No deliveries yet. Go online to start receiving orders.</p>
            )}
          </div>
        </div>

        {/* Incoming dispatch modal */}
        {dispatch && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end p-4">
            <div className="bg-card w-full max-w-lg mx-auto rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">New Delivery Order!</p>
                  <h2 className="text-xl font-black text-foreground">{dispatch.merchant?.storeName}</h2>
                </div>
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center font-black text-lg">
                  {dispatchCountdown}
                </div>
              </div>
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-amber-500" /> {dispatch.distanceKm} km to customer
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package size={14} className="text-amber-500" /> {dispatch.itemCount} items
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                  <p className="text-xs text-amber-700 font-bold">Your earning for this delivery:</p>
                  <p className="text-2xl font-black text-amber-600">₹{dispatch.earning}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-red-500 text-red-500 font-bold" onClick={handleDecline} id="btn-dispatch-decline">
                  <XCircle size={16} className="mr-1" /> Decline
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-black border-0 shadow-lg shadow-green-500/30" onClick={handleAccept} id="btn-dispatch-accept">
                  <Zap size={16} className="mr-1" /> Accept
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
