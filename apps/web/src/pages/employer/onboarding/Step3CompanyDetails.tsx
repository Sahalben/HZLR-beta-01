import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Building } from 'lucide-react';

interface Props {
  formData: any;
  update: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3CompanyDetails({ formData, update, onNext, onPrev }: Props) {
  return (
    <Card variant="elevated" className="border-0 shadow-2xl p-6 md:p-8 space-y-6">
       <div>
         <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Building className="text-primary" />
            Company Details
         </h2>
         <p className="text-muted-foreground">{formData.gstVerified ? 'Please confirm the details retrieved from your GSTIN.' : 'Tell us about your organization.'}</p>
       </div>
       
       <div className="space-y-4 py-2">
           <div className="space-y-2">
               <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Legal Company Name</Label>
               <Input 
                   placeholder="HZLR Technologies Pvt Ltd" 
                   value={formData.gstLegalName || formData.companyName} 
                   onChange={(e) => update({ companyName: e.target.value })} 
                   readOnly={formData.gstVerified}
                   className={formData.gstVerified ? 'bg-secondary/30 pointer-events-none text-muted-foreground font-bold' : ''}
               />
           </div>

           <div className="space-y-2">
               <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Registered Address</Label>
               <Input 
                   placeholder="123 Example Street, City, State" 
                   value={formData.registeredAddress} 
                   onChange={(e) => update({ registeredAddress: e.target.value })} 
               />
           </div>

           <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                   <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contact Person</Label>
                   <Input 
                       placeholder="Rahul Sharma" 
                       value={formData.contactPerson} 
                       onChange={(e) => update({ contactPerson: e.target.value })} 
                   />
               </div>
               <div className="space-y-2">
                   <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Designation</Label>
                   <Input 
                       placeholder="HR Manager" 
                       value={formData.designation} 
                       onChange={(e) => update({ designation: e.target.value })} 
                   />
               </div>
           </div>
       </div>

       <div className="flex gap-3 pt-4">
           <Button onClick={onPrev} variant="outline" className="w-14 h-14 p-0 shrink-0 border-border">
               <ArrowLeft className="w-5 h-5" />
           </Button>
           <Button onClick={onNext} className="flex-1 h-14 font-bold bg-zinc-900 group">
               Continue to Profile
               <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
           </Button>
       </div>
    </Card>
  );
}
