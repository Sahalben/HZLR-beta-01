import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function EmailOTPVerification() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { sendEmailOtp, verifyEmailOtp, user } = useAuth();
  
  // Extract email from location state or user profile
  const email = location.state?.email || user?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }
    // Automatically send OTP on mount
    handleSendOTP();
  }, [email]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOTP = async () => {
    try {
      await sendEmailOtp(email);
      setResendCooldown(30);
      toast({
        title: 'Email Sent',
        description: `We've sent a verification code to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Could not send email.',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setLoading(true);

    try {
      const result = await verifyEmailOtp(email, otp);
      toast({
        title: 'Email Verified!',
        description: 'Your email address has been successfully verified.',
      });
      
      const role = result.user?.role?.toLowerCase();
      if (role === 'employer') {
        navigate('/employer/onboarding');
      } else {
        navigate('/signup/profile');
      }
    } catch (error: any) {
      setAttempts(prev => prev + 1);
      toast({
        title: 'Verification Failed',
        description: error.message || `Incorrect code. ${5 - attempts - 1} attempts remaining.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={2}
      title="Verify your email"
      subtitle={`Enter the 6-digit code sent to ${email}`}
    >
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-center flex-col items-center gap-4">
              <Mail className="w-12 h-12 text-seafoam/50" />
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6 || attempts >= 5}
              className="w-full"
              size="lg"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleSendOTP}
                disabled={resendCooldown > 0 || loading || attempts >= 5}
                className="text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend OTP'}
              </Button>
            </div>
            
            {attempts >= 5 && (
              <p className="text-destructive text-sm text-center">Too many failed attempts. Please request a new code later.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}
