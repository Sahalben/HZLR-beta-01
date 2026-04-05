import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ArrowLeft, ArrowRight, Loader2, FileWarning } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  formData: any;
  update: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2GSTVerify({ formData, update, onNext, onPrev }: Props) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
      if (!formData.gstin || formData.gstin.length !== 15) {
          return toast({ title: "Invalid Format", description: "GSTIN must be exactly 15 characters long.", variant: 'destructive' });
      }

      setLoading(true);
      try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/api/v1/employers/onboard/gst-verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ gstin: formData.gstin.toUpperCase() })
          });
          const data = await res.json();
          
          if (data.verified) {
             toast({ title: 'Verified', description: 'Legal entity confirmed successfully.', className: 'bg-emerald-500 text-white' });
             update({ gstVerified: true, ...data.profile });
          } else {
             toast({ title: 'Submitted for Review', description: 'API rate limits triggered. We will manually verify your GSTIN. You may proceed.', className: 'bg-yellow-500 text-white' });
             update({ gstVerified: false });
          }
          setTimeout(() => onNext(), 1500);
      } catch (e) {
          toast({ title: "API Error", description: "Verification backend unavailable.", variant: 'destructive' });
      } finally {
          setLoading(false);
      }
  };

  return (
    <Card variant="elevated" className="border-0 shadow-2xl p-6 md:p-8 space-y-6">
       <div>
         <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            Verify Business
         </h2>
         <p className="text-muted-foreground">Instantly verify your organization and unlock the verified badge to attract 40% more workers.</p>
       </div>
       
       <div className="space-y-4 py-4">
           <div className="space-y-2">
               <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">GSTIN (15 Digits)</Label>
               <Input 
                   autoFocus
                   placeholder="e.g. 22AAAAA0000A1Z5" 
                   value={formData.gstin} 
                   onChange={(e) => update({ gstin: e.target.value.toUpperCase() })} 
                   maxLength={15}
                   className="h-14 text-xl tracking-widest uppercase font-mono bg-secondary/20"
               />
           </div>

           {formData.gstVerified && (
               <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                   <p className="text-sm text-emerald-600 font-bold">Successfully Verified</p>
                   <p className="text-xs text-muted-foreground mt-1">Ready to proceed.</p>
               </div>
           )}
       </div>

       <div className="flex gap-3 pt-4">
           <Button onClick={onPrev} variant="outline" className="w-14 h-14 p-0 shrink-0 border-border">
               <ArrowLeft className="w-5 h-5" />
           </Button>
           <Button onClick={handleVerify} disabled={loading || !formData.gstin} className="flex-1 h-14 font-bold bg-zinc-900 group">
               {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Verify Identity"}
           </Button>
       </div>
       
       <button onClick={() => { update({ gstin: '' }); onNext(); }} className="w-full text-center text-xs font-bold text-muted-foreground hover:text-foreground mt-4 block py-2">
           I don't have a GSTIN / Skip for now
       </button>
    </Card>
  );
}
