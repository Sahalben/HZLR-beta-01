import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Building2, Mails, Clock, Wallet, Check, Settings2, Code2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function MerchantSettings() {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    storeApi.getMerchantMe()
      .then(m => {
        setMerchant({
          ...m,
          petpoojaAppKey: m.petpoojaAppKey || '',
          petpoojaRestId: m.petpoojaRestId || '',
        });
        setLoading(false);
      })
      .catch(() => navigate('/merchant/onboard'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setMerchant(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await storeApi.updateMerchantMe({
        storeName: merchant.storeName,
        description: merchant.description,
        city: merchant.city,
        address: merchant.address,
        openTime: merchant.openTime,
        closeTime: merchant.closeTime,
        minOrderValue: merchant.minOrderValue,
        freeDeliveryThreshold: merchant.freeDeliveryThreshold,
        petpoojaAppKey: merchant.petpoojaAppKey,
        petpoojaRestId: merchant.petpoojaRestId,
        bankAccount: merchant.bankAccount,
        ifscCode: merchant.ifscCode,
        isActive: merchant.isActive,
      });
      toast({ title: 'Settings saved', description: 'Your store settings have been updated.' });
    } catch (e: any) {
      toast({ title: 'Error saving', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !merchant) {
    return <AppShell><div className="p-4 pt-8 animate-pulse space-y-4"><div className="h-20 bg-muted rounded-2xl" /><div className="h-64 bg-muted rounded-2xl" /></div></AppShell>;
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="-ml-2 rounded-full" onClick={() => navigate('/merchant/dashboard')}>
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <h1 className="font-black text-lg text-foreground">Settings</h1>
          </div>
          <Button 
            size="sm" 
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-8 flex items-center gap-1.5"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="p-4 space-y-5">
          {/* Status Toggle */}
          <Card className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/10 flex flex-row items-center justify-between">
            <div>
              <p className="font-bold text-sm text-foreground flex items-center gap-2">
                Store Visibility
                {merchant.isActive ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 py-0 text-[10px]">Active</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground py-0 text-[10px]">Offline</Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle whether customers can see your store</p>
            </div>
            <Switch 
              checked={merchant.isActive} 
              onCheckedChange={(c) => setMerchant(prev => ({ ...prev, isActive: c }))} 
              className="data-[state=checked]:bg-amber-500"
            />
          </Card>

          {/* Business Details */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-tight text-muted-foreground">
              <Building2 className="w-4 h-4" /> Business Details
            </h2>
            <div className="space-y-3 bg-white p-4 rounded-xl border shadow-sm">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">Store Name</Label>
                <Input name="storeName" value={merchant.storeName} onChange={handleChange} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">Description</Label>
                <Input name="description" value={merchant.description || ''} onChange={handleChange} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">City</Label>
                <Input name="city" value={merchant.city} onChange={handleChange} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">Full Address</Label>
                <Input name="address" value={merchant.address} onChange={handleChange} className="h-9" />
              </div>
            </div>
          </section>

          {/* Delivery & Timings */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-tight text-muted-foreground">
              <Clock className="w-4 h-4" /> Delivery & Timings
            </h2>
            <div className="space-y-3 bg-white p-4 rounded-xl border shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Open Time</Label>
                  <Input name="openTime" type="time" value={merchant.openTime} onChange={handleChange} className="h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Close Time</Label>
                  <Input name="closeTime" type="time" value={merchant.closeTime} onChange={handleChange} className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Min Order (₹)</Label>
                  <Input name="minOrderValue" type="number" value={merchant.minOrderValue} onChange={handleChange} className="h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Free Delivery Above (₹)</Label>
                  <Input name="freeDeliveryThreshold" type="number" value={merchant.freeDeliveryThreshold || ''} onChange={handleChange} className="h-9" />
                </div>
              </div>
            </div>
          </section>

          {/* Payout Details */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-tight text-muted-foreground">
              <Wallet className="w-4 h-4" /> Payout Details
            </h2>
            <div className="space-y-3 bg-white p-4 rounded-xl border shadow-sm">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">Bank Account Number</Label>
                <Input name="bankAccount" value={merchant.bankAccount || ''} onChange={handleChange} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">IFSC Code</Label>
                <Input name="ifscCode" value={merchant.ifscCode || ''} onChange={handleChange} className="h-9 uppercase" />
              </div>
            </div>
          </section>

          {/* POS Integration */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-tight text-muted-foreground">
              <Code2 className="w-4 h-4" /> POS Integration (Petpooja)
            </h2>
            <div className="space-y-3 bg-white p-4 rounded-xl border shadow-sm">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">Restaurant/Store ID</Label>
                <Input name="petpoojaRestId" value={merchant.petpoojaRestId} onChange={handleChange} className="h-9" placeholder="e.g. res_123456" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">App Key (Client Secret)</Label>
                <Input name="petpoojaAppKey" value={merchant.petpoojaAppKey} onChange={handleChange} className="h-9" type="password" placeholder="••••••••••••" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
