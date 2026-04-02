import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, HardHat, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile, updateProfile, updateOnboardingState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If role is already selected, redirect to next step
  React.useEffect(() => {
    if (profile?.role) {
      navigate('/signup/profile', { replace: true });
    }
  }, [profile, navigate]);

  const handleContinue = async () => {
    if (!selectedRole) {
      toast({
        title: 'Please select a role',
        description: 'Choose whether you want to find work or hire workers.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ role: selectedRole });
      await updateOnboardingState('ROLE_SELECTED');
      navigate('/signup/profile');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save your selection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'worker' as UserRole,
      title: 'I want to find work',
      description: 'Browse and apply for gigs, build your reliability score, and get paid.',
      icon: HardHat,
    },
    {
      id: 'employer' as UserRole,
      title: 'I want to hire workers',
      description: 'Post jobs, manage applicants, and track attendance with ease.',
      icon: Briefcase,
    },
  ];

  return (
    <OnboardingLayout
      currentStep={1}
      title="What brings you to HZLR?"
      subtitle="Select your role to get started"
    >
      <div className="space-y-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectedRole === role.id
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-primary/50'
            )}
            onClick={() => setSelectedRole(role.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    selectedRole === role.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {role.description}
                  </p>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-colors',
                    selectedRole === role.id
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}
                >
                  {selectedRole === role.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          className="w-full mt-6"
          size="lg"
        >
          {loading ? 'Saving...' : 'Continue'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </OnboardingLayout>
  );
}
