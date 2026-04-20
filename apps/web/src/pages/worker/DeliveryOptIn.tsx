import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, Car, Truck, CheckCircle, Zap, Clock, IndianRupee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';

const VEHICLES = [
  { id: 'bicycle', label: 'Bicycle', icon: '🚲', desc: 'Short distance deliveries' },
  { id: 'two-wheeler', label: 'Two Wheeler', icon: '🏍️', desc: 'Most popular, up to 10km' },
  { id: 'three-wheeler', label: 'Three Wheeler', icon: '🛺', desc: 'Larger orders, bulky items' },
];

const EARNING_EXAMPLE = [
  { order: '₹200', distance: '2km', earn: '₹32' },
  { order: '₹450', distance: '3.2km', earn: '₹49' },
  { order: '₹800', distance: '5km', earn: '₹70' },
];

export default function DeliveryOptIn() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('two-wheeler');
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    setActivating(true);
    try {
      await storeApi.deliveryOptIn(selectedVehicle);
      toast({ title: '🏍️ Delivery mode activated!', description: 'You can now go online and accept orders.', className: 'bg-green-500 text-white border-0' });
      navigate('/worker/delivery/live');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setActivating(false); }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-foreground to-foreground/90 text-white px-4 pt-10 pb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 text-[120px] opacity-5 leading-none">🏍️</div>
          <div className="relative">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">HZLR.store</p>
            <h1 className="text-3xl font-black mt-1">Become a<br/>Delivery Partner</h1>
            <p className="text-white/70 text-sm mt-2">Earn per drop. No targets, no commitment.</p>
          </div>
        </div>

        <div className="px-4 -mt-4 space-y-5 relative z-10">
          {/* Earnings explainer */}
          <Card className="p-5 border border-border/50 shadow-xl">
            <h3 className="font-black text-sm text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <IndianRupee size={16} className="text-amber-500" /> How You Earn
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Base ₹20 + ₹6/km + order size bonus. Earned <span className="font-bold text-foreground">instantly on delivery.</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {EARNING_EXAMPLE.map(ex => (
                <div key={ex.order} className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">{ex.order} order</p>
                  <p className="text-xs text-muted-foreground">{ex.distance}</p>
                  <p className="font-black text-sm text-amber-600 mt-1">{ex.earn}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Perks */}
          <Card className="p-5 border border-border/50">
            <h3 className="font-black text-sm text-foreground uppercase tracking-wider mb-3">Benefits</h3>
            <div className="space-y-2.5">
              {[
                { icon: Zap, text: 'Instant wallet credit on every delivery' },
                { icon: Clock, text: 'Work on your own schedule, no fixed hours' },
                { icon: CheckCircle, text: 'Unified HZLR wallet — gig + delivery earnings in one place' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-3">
                  <b.icon size={16} className="text-amber-500 shrink-0" />
                  <p className="text-sm text-foreground">{b.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted rounded-xl">
              <p className="text-xs text-muted-foreground">Monthly subscription: <span className="font-bold text-foreground">₹199/month</span></p>
              <p className="text-[11px] text-muted-foreground mt-0.5">First invoice after your first delivery. Cancel anytime.</p>
            </div>
          </Card>

          {/* Vehicle picker */}
          <div>
            <h3 className="font-black text-sm text-foreground uppercase tracking-wider mb-3">Your Vehicle</h3>
            <div className="space-y-2">
              {VEHICLES.map(v => (
                <button key={v.id} onClick={() => setSelectedVehicle(v.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${selectedVehicle === v.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-border'}`}
                  id={`vehicle-${v.id}`}>
                  <span className="text-3xl">{v.icon}</span>
                  <div>
                    <p className="font-bold text-foreground text-sm">{v.label}</p>
                    <p className="text-xs text-muted-foreground">{v.desc}</p>
                  </div>
                  {selectedVehicle === v.id && <CheckCircle size={18} className="text-amber-500 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-base py-6 rounded-2xl border-0 shadow-xl shadow-amber-500/30"
            disabled={activating}
            onClick={handleActivate}
            id="btn-activate-delivery"
          >
            {activating ? 'Activating...' : '🚀 Activate Delivery Mode'}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
