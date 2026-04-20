import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Clock, Package, CreditCard, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';

const STEPS = [
  { id: 1, title: 'Store Identity', icon: Store, desc: 'Name, type, branding' },
  { id: 2, title: 'Location & Hours', icon: MapPin, desc: 'Address, operating hours' },
  { id: 3, title: 'Delivery Config', icon: Clock, desc: 'Radius, min order' },
  { id: 4, title: 'Catalog Bootstrap', icon: Package, desc: 'Products — skip or upload' },
  { id: 5, title: 'Payout Setup', icon: CreditCard, desc: 'UPI & subscription' },
];

const STORE_TYPES = ['supermarket', 'kirana', 'pharmacy', 'bakery', 'restaurant'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MerchantOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    storeName: '', storeType: 'kirana', tagline: '', description: '',
    address: '', city: '', state: '', pincode: '', latitude: '', longitude: '',
    operatingHours: DAYS.map(d => ({ day: d, open: '09:00', close: '22:00', closed: d === 'Sun' })),
    minOrderValue: '100', maxDeliveryRadiusKm: '5', freeDeliveryThreshold: '500',
    posType: 'none', posMerchantId: '',
    upiId: '',
  });

  const update = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));
  const updateHours = (dayIdx: number, field: string, val: any) =>
    setForm(prev => {
      const h = [...prev.operatingHours];
      h[dayIdx] = { ...h[dayIdx], [field]: val };
      return { ...prev, operatingHours: h };
    });

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        update('latitude', pos.coords.latitude.toString());
        update('longitude', pos.coords.longitude.toString());
        toast({ title: 'Location pinned ✓', description: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` });
      },
      () => toast({ title: 'Location error', description: 'Could not detect location.', variant: 'destructive' })
    );
  };

  const handleSubmit = async () => {
    if (!form.upiId.trim()) {
      toast({ title: 'UPI ID required', variant: 'destructive' }); return;
    }
    setSubmitting(true);
    try {
      await storeApi.onboard({
        ...form,
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0,
        minOrderValue: parseFloat(form.minOrderValue),
        maxDeliveryRadiusKm: parseFloat(form.maxDeliveryRadiusKm),
        freeDeliveryThreshold: parseFloat(form.freeDeliveryThreshold),
      });
      navigate('/merchant/pending');
    } catch (e: any) {
      toast({ title: 'Onboarding failed', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-10">
        {/* Header */}
        <div className="bg-amber-500 text-white px-4 pt-10 pb-8">
          <h1 className="text-2xl font-black">List Your Store</h1>
          <p className="text-amber-100 text-sm mt-1">Step {step} of 5 — {STEPS[step - 1].title}</p>
          <div className="flex gap-1.5 mt-4">
            {STEPS.map(s => (
              <div key={s.id} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s.id ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>

        <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
          {/* Step 1 — Store Identity */}
          {step === 1 && (
            <>
              <div className="space-y-3">
                <input className="input-field" placeholder="Store name *" value={form.storeName} onChange={e => update('storeName', e.target.value)} id="input-store-name" />
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">Store Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STORE_TYPES.map(t => (
                      <button key={t} onClick={() => update('storeType', t)}
                        className={`py-2 px-3 rounded-xl text-sm font-bold capitalize border-2 transition-all ${form.storeType === t ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-900/20' : 'border-border text-muted-foreground'}`}
                        id={`store-type-${t}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <input className="input-field" placeholder="Tagline (optional)" value={form.tagline} onChange={e => update('tagline', e.target.value)} id="input-tagline" />
                <textarea className="input-field resize-none" rows={2} placeholder="Store description (optional)" value={form.description} onChange={e => update('description', e.target.value)} />
              </div>
            </>
          )}

          {/* Step 2 — Location & Hours */}
          {step === 2 && (
            <>
              <div className="space-y-3">
                <textarea className="input-field resize-none" rows={2} placeholder="Full address *" value={form.address} onChange={e => update('address', e.target.value)} id="input-address" />
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="City *" value={form.city} onChange={e => update('city', e.target.value)} id="input-city" />
                  <input className="input-field" placeholder="State" value={form.state} onChange={e => update('state', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Pincode" value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                  <Button variant="outline" onClick={handleDetectLocation} className="border-amber-500 text-amber-600 font-bold" id="btn-detect-location">
                    <MapPin size={16} className="mr-1" /> Pin Location
                  </Button>
                </div>
                {form.latitude && <p className="text-xs text-green-500 font-bold">📍 {parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}</p>}

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">Operating Hours</label>
                  <div className="space-y-2">
                    {DAYS.map((day, idx) => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground w-7 shrink-0">{day}</span>
                        <input type="checkbox" checked={!form.operatingHours[idx].closed}
                          onChange={e => updateHours(idx, 'closed', !e.target.checked)}
                          className="accent-amber-500" />
                        {!form.operatingHours[idx].closed && (
                          <>
                            <input type="time" value={form.operatingHours[idx].open}
                              onChange={e => updateHours(idx, 'open', e.target.value)}
                              className="text-xs bg-muted border border-border/50 rounded-lg px-2 py-1 flex-1 outline-none" />
                            <span className="text-xs text-muted-foreground">–</span>
                            <input type="time" value={form.operatingHours[idx].close}
                              onChange={e => updateHours(idx, 'close', e.target.value)}
                              className="text-xs bg-muted border border-border/50 rounded-lg px-2 py-1 flex-1 outline-none" />
                          </>
                        )}
                        {form.operatingHours[idx].closed && <span className="text-xs text-muted-foreground italic">Closed</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 3 — Delivery Config */}
          {step === 3 && (
            <div className="space-y-4">
              <Card className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50">
                <p className="text-xs text-amber-700 font-bold">ℹ️ Delivery fees are auto-calculated by HZLR based on distance and order size. You configure the bounds below.</p>
              </Card>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1 block">Minimum Order (₹)</label>
                  <input type="number" className="input-field" value={form.minOrderValue} onChange={e => update('minOrderValue', e.target.value)} id="input-min-order" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1 block">Maximum Delivery Radius (km)</label>
                  <input type="number" className="input-field" value={form.maxDeliveryRadiusKm} onChange={e => update('maxDeliveryRadiusKm', e.target.value)} id="input-radius" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1 block">Free Delivery Above (₹)</label>
                  <input type="number" className="input-field" value={form.freeDeliveryThreshold} onChange={e => update('freeDeliveryThreshold', e.target.value)} id="input-free-delivery" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Catalog Bootstrap */}
          {step === 4 && (
            <div className="space-y-3">
              <Card className="p-4 border border-border/50 space-y-2">
                {[
                  { val: 'none', label: 'Skip — add products manually later', emoji: '⏭️' },
                  { val: 'csv', label: 'Upload CSV catalog file', emoji: '📄' },
                  { val: 'petpooja', label: 'Connect Petpooja POS', emoji: '🔗' },
                ].map(opt => (
                  <button key={opt.val} onClick={() => update('posType', opt.val)}
                    className={`w-full text-left p-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center gap-3 ${form.posType === opt.val ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'border-border text-muted-foreground'}`}
                    id={`pos-type-${opt.val}`}>
                    <span>{opt.emoji}</span> {opt.label}
                  </button>
                ))}
              </Card>
              {form.posType === 'petpooja' && (
                <input className="input-field" placeholder="Petpooja Store ID" value={form.posMerchantId} onChange={e => update('posMerchantId', e.target.value)} id="input-pos-merchant-id" />
              )}
            </div>
          )}

          {/* Step 5 — Payout Setup */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1 block">UPI ID for Payouts *</label>
                <input className="input-field" placeholder="yourname@upi" value={form.upiId} onChange={e => update('upiId', e.target.value)} id="input-upi" />
              </div>
              <Card className="p-4 bg-foreground text-background border-0">
                <p className="text-xs text-background/60 uppercase font-bold tracking-wider mb-2">Monthly Subscription</p>
                <p className="font-black text-2xl">₹499<span className="text-sm font-medium text-background/60">/month</span></p>
                <ul className="mt-3 space-y-1.5 text-sm text-background/80">
                  {['Unlimited product catalog', 'Real-time order management', 'Analytics dashboard', 'HZLR dispatch network access'].map(f => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-400 shrink-0" />{f}</li>
                  ))}
                </ul>
                <p className="text-xs text-background/50 mt-3">First invoice after store approval. Cancel anytime.</p>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1" id="btn-prev-step">
                <ArrowLeft size={16} className="mr-1" /> Back
              </Button>
            )}
            {step < 5 ? (
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold border-0 shadow-lg shadow-amber-500/25"
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && !form.storeName.trim()}
                id="btn-next-step"
              >
                Continue <ArrowRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold border-0 shadow-lg shadow-amber-500/25"
                onClick={handleSubmit}
                disabled={submitting}
                id="btn-submit-onboarding"
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border) / 0.7);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: ring 0.15s;
        }
        .input-field:focus {
          ring: 2px;
          ring-color: rgb(245 158 11 / 0.4);
        }
      `}</style>
    </AppShell>
  );
}
