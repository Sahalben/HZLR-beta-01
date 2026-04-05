import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  type: "individual" | "company" | null;
  onFinish: () => void;
  isSubmitting: boolean;
  onPrev: () => void;
}

export function Step5Complete({ type, onFinish, isSubmitting, onPrev }: Props) {
  
  const rules = [
      { id: 1, text: 'Your workspace is ready.' },
      type === 'company' ? { id: 2, text: 'Organization flagged for verification.' } : null,
      { id: 3, text: 'Wallet infrastructure instantiated.' },
      { id: 4, text: 'Ready to post your first gig.' }
  ].filter(Boolean);

  return (
    <Card variant="elevated" className="border-0 shadow-2xl p-6 md:p-8 space-y-6 bg-gradient-to-br from-card to-secondary/10">
       <div className="text-center py-6">
         <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
             <Rocket className="w-10 h-10 text-white translate-y-[-2px] translate-x-[2px]" />
         </div>
         <h2 className="text-3xl font-black text-foreground tracking-tight">You're All Set!</h2>
         <p className="text-muted-foreground mt-2">Welcome to the future of workforce management.</p>
       </div>
       
       <div className="space-y-4 py-4 bg-background rounded-xl p-6 border border-border">
           <div className="flex items-center gap-3 text-emerald-600 mb-6 border-b border-border pb-4">
               <ShieldCheck className="w-6 h-6" />
               <span className="font-bold tracking-widest uppercase text-xs">System Diagnostics Status</span>
           </div>

           {rules.map((r: any, idx: number) => (
               <div key={idx} className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                   <p className="text-sm font-bold text-muted-foreground">{r.text}</p>
               </div>
           ))}
       </div>

       <div className="flex gap-3 pt-6">
           <Button onClick={onPrev} disabled={isSubmitting} variant="outline" className="w-14 h-14 p-0 shrink-0 border-border">
               <ArrowLeft className="w-5 h-5" />
           </Button>
           <Button onClick={onFinish} disabled={isSubmitting} className="flex-1 h-14 font-bold bg-primary text-primary-foreground group text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
               {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Go to Dashboard"}
           </Button>
       </div>
    </Card>
  );
}
