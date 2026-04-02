import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Complete() {
  const { profile, updateOnboardingState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (profile?.onboarding_state === 'ONBOARDING_COMPLETE') {
      setCompleted(true);
    }
  }, [profile]);

  const handleComplete = async () => {
    setLoading(true);

    try {
      await updateOnboardingState('ONBOARDING_COMPLETE');
      setCompleted(true);

      toast({
        title: 'Welcome to HZLR!',
        description: 'Your account is ready. Let\'s get started!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    const dashboardPath = profile?.role === 'worker' ? '/worker/home' : '/employer/home';
    navigate(dashboardPath, { replace: true });
  };

  return (
    <OnboardingLayout
      currentStep={5}
      title={completed ? 'Welcome to HZLR!' : 'Almost there!'}
      subtitle={completed ? 'Your account is ready' : 'Complete your setup to start'}
    >
      <Card>
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            {completed ? (
              <CheckCircle2 className="w-10 h-10 text-primary" />
            ) : (
              <Sparkles className="w-10 h-10 text-primary" />
            )}
          </div>

          {completed ? (
            <>
              <div>
                <h3 className="text-xl font-semibold mb-2">You're all set!</h3>
                <p className="text-muted-foreground">
                  {profile?.role === 'worker'
                    ? 'Start browsing gigs and building your reliability score.'
                    : 'Start posting jobs and finding reliable workers.'}
                </p>
              </div>

              <div className="space-y-3 text-left bg-muted/50 p-4 rounded-xl">
                <h4 className="font-medium">What you can do now:</h4>
                {profile?.role === 'worker' ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Browse available gigs in your area
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Apply to jobs matching your skills
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Build your reliability score
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Get paid quickly and securely
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Post your first job
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Review and hire verified workers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Track attendance with geo-validation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Manage your workforce efficiently
                    </li>
                  </ul>
                )}
              </div>

              <Button
                onClick={handleGoToDashboard}
                className="w-full"
                size="lg"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to join HZLR?</h3>
                <p className="text-muted-foreground">
                  Click below to complete your registration and access the platform.
                </p>
              </div>

              <Button
                onClick={handleComplete}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Completing...' : 'Complete Setup'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}
