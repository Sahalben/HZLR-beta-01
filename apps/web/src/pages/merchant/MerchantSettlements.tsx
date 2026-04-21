import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Building2, Calendar, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MerchantSettlements() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettlements = async () => {
    try {
      const res = await storeApi.getMerchantSettlements();
      setData(res);
    } catch (e: any) {
      toast({ title: 'Error fetching settlements', description: e.message, variant: 'destructive' });
      if (e.message.includes('required')) navigate('/merchant/onboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="p-4 pt-8 animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  if (!data) return null;

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 border-b relative px-4 py-8 overflow-hidden text-white">
          <div className="absolute right-4 top-8 opacity-20 text-6xl">💸</div>
          <div className="relative z-10">
            <Button variant="ghost" size="icon" className="-ml-2 mb-2 text-white/80 hover:text-white rounded-full hover:bg-white/20" onClick={() => navigate('/merchant/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <p className="text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">Pending Payout</p>
            <h1 className="text-4xl font-black">₹{Math.round(data.pendingAmount)}</h1>
            <p className="text-amber-100/80 text-xs mt-2">Next settlement scheduled for Monday</p>
          </div>
        </div>

        <div className="p-4 relative z-10 -mt-6">
          <Card className="p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Bank Account</p>
                <p className="text-xs text-muted-foreground uppercase">•••• {data.merchant?.bankAccount?.slice(-4) || 'XXXX'}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs font-bold" onClick={() => navigate('/merchant/settings')}>
              Edit
            </Button>
          </Card>

          <div className="mt-6">
            <h2 className="font-black text-lg text-foreground mb-3 px-1">Payout History</h2>

            {data.history?.length === 0 ? (
              <Card className="p-8 text-center bg-transparent border-dashed border-2 shadow-none">
                <Wallet className="w-10 h-10 mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-bold text-foreground text-sm">No payouts yet</p>
                <p className="text-xs text-muted-foreground mt-1">Your settlement history will appear here.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {data.history?.map((settlement: any) => (
                  <Card key={settlement.id} className="p-4 border-l-4 border-amber-400">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-sm text-foreground">₹{settlement.amount}</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Calendar size={12} /> {new Date(settlement.periodStart).toLocaleDateString()} - {new Date(settlement.periodEnd).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn('text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm',
                          settlement.status === 'SUCCESS' ? 'text-green-700 bg-green-50' : 'text-orange-700 bg-orange-50'
                        )}>
                          {settlement.status}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-1 cursor-pointer hover:underline flex items-center gap-1 justify-end">
                          <FileText size={10} /> {settlement.id.slice(-6).toUpperCase()}
                        </p>
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
