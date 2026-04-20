import React from 'react';
import { Clock, Mail, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { useNavigate } from 'react-router-dom';

const STAGES = [
  { label: 'Application Submitted', done: true, icon: CheckCircle },
  { label: 'Under HZLR Review', done: false, active: true, icon: Clock },
  { label: 'Decision', done: false, icon: Circle },
];

export default function ApprovalPending() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Illustration */}
        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-amber-500/10">
          <Clock className="w-12 h-12 text-amber-500" />
        </div>

        <h1 className="text-2xl font-black text-foreground">Application Under Review</h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-xs leading-relaxed">
          The HZLR team is reviewing your store. We'll notify you once it's approved — usually within 24–48 hours.
        </p>

        {/* Status tracker */}
        <Card className="w-full max-w-sm mt-8 p-6 border border-border/50 shadow-md">
          <h3 className="text-sm font-black text-left text-foreground mb-4 uppercase tracking-wider">Application Status</h3>
          <div className="space-y-4">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div key={stage.label} className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={stage.done ? 'text-green-500' : stage.active ? 'text-amber-500 animate-pulse' : 'text-muted-foreground/30'}
                  />
                  <p className={`text-sm font-bold ${stage.done ? 'text-foreground' : stage.active ? 'text-amber-500' : 'text-muted-foreground/40'}`}>
                    {stage.label}
                  </p>
                  {stage.active && (
                    <span className="ml-auto text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      In Progress
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle size={14} className="text-amber-400 shrink-0" />
            Estimated review time: 24–48 hours
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-8 w-full max-w-sm">
          <Button
            variant="outline"
            className="w-full border-amber-500 text-amber-600 font-bold"
            onClick={() => window.open('mailto:support@hzlr.in')}
            id="btn-contact-support"
          >
            <Mail size={16} className="mr-2" /> Contact Support
          </Button>
          <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate('/worker/home')} id="btn-back-to-hzlr">
            Back to HZLR
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
