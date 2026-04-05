import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  type: "individual" | "company" | null;
  onChange: (t: "individual" | "company") => void;
  onNext: () => void;
}

export function Step1AccountType({ type, onChange, onNext }: Props) {
  return (
    <Card variant="elevated" className="border-0 shadow-2xl p-6 md:p-8 space-y-6">
       <div>
         <h2 className="text-2xl font-bold text-foreground mb-2">Account Type</h2>
         <p className="text-muted-foreground">Select how you intend to hire on HZLR.</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* INDIVIDUAL */}
           <div 
             onClick={() => onChange('individual')}
             className={cn(
                 "p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300",
                 type === 'individual' ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/40 bg-card hover:bg-secondary/10"
             )}
           >
               <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", type === 'individual' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                   <User />
               </div>
               <h3 className="font-bold text-lg mb-1">Individual</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">Perfect for personal tasks, home projects, or ad-hoc hiring without an organization.</p>
           </div>

           {/* COMPANY */}
           <div 
             onClick={() => onChange('company')}
             className={cn(
                 "p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300",
                 type === 'company' ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/40 bg-card hover:bg-secondary/10"
             )}
           >
               <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", type === 'company' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                   <Building2 />
               </div>
               <h3 className="font-bold text-lg mb-1">Company / Org</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">Built for businesses, restaurants, event agencies, and high volume recruitment.</p>
           </div>
       </div>

       <Button onClick={onNext} disabled={!type} className="w-full h-14 text-lg font-bold group" size="lg">
           Continue
           <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
       </Button>
    </Card>
  );
}
