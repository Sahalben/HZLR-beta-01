import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

export function OnboardingLayout({ 
   children, 
   currentStep, 
   type 
}: { 
   children: React.ReactNode, 
   currentStep: number, 
   type: "individual" | "company" | null 
}) {
  const totalSteps = type === 'individual' ? 3 : 5;
  const displayStep = type === 'individual' && currentStep > 1 ? currentStep - 2 : currentStep;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-seafoam/30">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6 shadow-xl shadow-primary/20">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
             Employer Setup
          </h1>
          <p className="text-muted-foreground mt-3 text-lg font-medium">Configure your workspace</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step {displayStep} of {totalSteps}</span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{Math.round((displayStep / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(displayStep / totalSteps) * 100}%` }}
                 />
            </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
        </div>
      </div>
    </div>
  );
}
