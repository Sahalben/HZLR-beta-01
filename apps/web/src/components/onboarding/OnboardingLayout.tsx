import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  title: string;
  subtitle?: string;
}

const steps = [
  { label: 'Role', step: 1 },
  { label: 'Verify', step: 2 },
  { label: 'Profile', step: 3 },
  { label: 'KYC', step: 4 },
  { label: 'Complete', step: 5 },
];

export function OnboardingLayout({ children, currentStep, title, subtitle }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-foreground">HZLR</span>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.step}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                      step.step < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step.step === currentStep
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {step.step < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.step
                    )}
                  </div>
                  <span
                    className={cn(
                      'hidden md:block text-sm font-medium',
                      step.step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 w-8 md:w-16',
                      step.step < currentStep ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
