import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useToast } from '@/hooks/use-toast';

type Step = 'phone' | 'otp';

export default function OTPVerification() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');

    // Ensure it starts with country code (India +91)
    if (digits.startsWith('91') && digits.length > 2) {
      return `+${digits}`;
    } else if (digits.length === 10) {
      return `+91${digits}`;
    }
    return value;
  };

  const validatePhone = (value: string) => {
    const formatted = formatPhoneNumber(value);
    // E.164 format: +[country code][number]
    const e164Regex = /^\+[1-9]\d{10,14}$/;
    return e164Regex.test(formatted);
  };

  const handleSendOTP = async () => {
    if (!validatePhone(phone)) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid 10-digit phone number.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/v1/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, role: 'WORKER' }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Failed to send OTP',
          description: data.error || 'Network error',
          variant: 'destructive',
        });
        return;
      }

      setStep('otp');
      setResendCooldown(30);
      toast({
        title: 'OTP Sent',
        description: `We've sent a verification code to ${formattedPhone}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code.',
        variant: 'destructive',
      });
      return;
    }

    if (attempts >= 5) {
      toast({
        title: 'Too many failed attempts',
        description: 'Please request a new OTP.',
        variant: 'destructive',
      });
      setStep('phone');
      setOtp('');
      setAttempts(0);
      return;
    }

    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAttempts(prev => prev + 1);
        toast({
          title: 'Invalid OTP',
          description: data.error || `Incorrect code. ${5 - attempts - 1} attempts remaining.`,
          variant: 'destructive',
        });
        return;
      }

      if (data.token) {
        localStorage.setItem('hzlr_access_token', data.token);
        toast({
          title: 'Verified!',
          description: 'Your phone number has been verified.',
        });
        // The AuthContext will handle the redirect based on onboarding state
        navigate('/signup/role');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Verification failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setOtp('');
    setAttempts(0);
    await handleSendOTP();
  };

  return (
    <OnboardingLayout
      currentStep={2}
      title={step === 'phone' ? 'Enter your phone number' : 'Verify your phone'}
      subtitle={
        step === 'phone'
          ? 'We\'ll send you a verification code'
          : `Enter the 6-digit code sent to ${formatPhoneNumber(phone)}`
      }
    >
      <Card>
        <CardContent className="p-6">
          {step === 'phone' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    maxLength={15}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Indian numbers only (+91)
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={loading || !phone}
                className="w-full"
                size="lg"
              >
                {loading ? 'Sending...' : 'Send OTP'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
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
                disabled={loading || otp.length !== 6}
                className="w-full"
                size="lg"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || loading}
                  className="text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend OTP'}
                </Button>
              </div>

              <Button
                variant="link"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setAttempts(0);
                }}
                className="w-full text-muted-foreground"
              >
                Change phone number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}
