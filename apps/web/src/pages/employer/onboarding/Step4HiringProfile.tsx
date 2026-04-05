import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  formData: any;
  update: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CATEGORIES = [
    { id: 'fnb', label: 'F&B/Restaurant' },
    { id: 'events', label: 'Event Staff' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'cleaning', label: 'Cleaning/Facility' },
    { id: 'delivery', label: 'Delivery' }
];

export function Step4HiringProfile({ formData, update, onNext, onPrev }: Props) {

  const toggleCategory = (id: string) => {
      const current = formData.workerCategories || [];
      if (current.includes(id)) {
          update({ workerCategories: current.filter((c: string) => c !== id) });
      } else {
          update({ workerCategories: [...current, id] });
      }
  };

  return (
    <Card variant="elevated" className="border-0 shadow-2xl p-6 md:p-8 space-y-6">
       <div>
         <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Activity className="text-primary" />
            Hiring Target
         </h2>
         <p className="text-muted-foreground">What kind of workforce are you looking for?</p>
       </div>
       
       <div className="space-y-6 py-2">
           <div className="space-y-3">
               <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories Needed</Label>
               <div className="flex flex-wrap gap-2">
                   {CATEGORIES.map(c => {
                       const isSelected = (formData.workerCategories || []).includes(c.id);
                       return (
                           <div 
                               key={c.id} 
                               onClick={() => toggleCategory(c.id)}
                               className={cn(
                                   "px-4 py-2 rounded-full border text-sm font-bold cursor-pointer transition-all",
                                   isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50 text-muted-foreground"
                               )}
                           >
                               {c.label}
                           </div>
                       );
                   })}
               </div>
           </div>

           <div className="space-y-3">
               <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Monthly Hiring Volume</Label>
               <Select value={formData.monthlyHiringVolume} onValueChange={(v) => update({ monthlyHiringVolume: v })}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Estimates per month" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="1-5">1 - 5 shifts</SelectItem>
                      <SelectItem value="5-20">5 - 20 shifts</SelectItem>
                      <SelectItem value="20-50">20 - 50 shifts</SelectItem>
                      <SelectItem value="50+">50+ shifts</SelectItem>
                  </SelectContent>
               </Select>
           </div>
           
           <div className="space-y-3">
               <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preferred Hiring Speed</Label>
               <Select value={formData.preferredHiringMode} onValueChange={(v) => update({ preferredHiringMode: v })}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Urgency levels" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="instant">Instant (Within 2 Hours)</SelectItem>
                      <SelectItem value="scheduled">Scheduled (Advanced Booking)</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
               </Select>
           </div>
       </div>

       <div className="flex gap-3 pt-4">
           <Button onClick={onPrev} variant="outline" className="w-14 h-14 p-0 shrink-0 border-border">
               <ArrowLeft className="w-5 h-5" />
           </Button>
           <Button onClick={onNext} className="flex-1 h-14 font-bold bg-zinc-900 group">
               Review & Complete
               <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
           </Button>
       </div>
    </Card>
  );
}
