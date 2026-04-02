import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type KYCStatus = 'pending' | 'verified' | 'failed';

interface KYCRecord {
  id: string;
  status: KYCStatus;
  attempts: number;
}

export default function KYCVerification() {
  const { profile, user, updateOnboardingState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [kycRecord, setKycRecord] = useState<KYCRecord | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!profile?.role) {
      navigate('/signup/role', { replace: true });
      return;
    }

    // Fetch existing KYC record
    fetchKYCRecord();
  }, [profile, navigate]);

  const fetchKYCRecord = async () => {
    if (!user) return;
    const localRec = localStorage.getItem(`hzlr_kyc_${user.id}`);
    if (localRec) setKycRecord(JSON.parse(localRec));
  };

  const initiateKYC = async () => {
    if (!consentGiven) {
      toast({
        title: 'Consent Required',
        description: 'Please agree to the KYC terms to proceed.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      // Check for existing record
      const newRecord = {
        id: `KYC_${Date.now()}`,
        status: 'pending' as KYCStatus,
        attempts: kycRecord ? kycRecord.attempts + 1 : 1
      };

      localStorage.setItem(`hzlr_kyc_${user.id}`, JSON.stringify(newRecord));
      setKycRecord(newRecord);

      await updateOnboardingState('E_KYC_PENDING');

      // Simulate KYC verification process
      setVerifying(true);

      // In production, this would redirect to the KYC provider
      // For demo, we simulate a verification process
      setTimeout(async () => {
        await simulateKYCVerification();
      }, 3000);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate KYC. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const simulateKYCVerification = async () => {
    if (!user) return;

    try {
      const successRecord = { ...kycRecord, status: 'verified' as KYCStatus, verified_at: new Date().toISOString() };
      localStorage.setItem(`hzlr_kyc_${user.id}`, JSON.stringify(successRecord));

      await updateOnboardingState('E_KYC_VERIFIED');

      toast({
        title: 'KYC Verified!',
        description: 'Your identity has been successfully verified.',
      });

      navigate('/signup/complete');
    } catch (error) {
      const failRecord = { ...kycRecord, status: 'failed' as KYCStatus, attempts: (kycRecord?.attempts || 0) + 1, id: '1' };
      localStorage.setItem(`hzlr_kyc_${user.id}`, JSON.stringify(failRecord));
      setKycRecord(failRecord);
      setVerifying(false);
      setLoading(false);

      toast({
        title: 'Verification Failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  const retryKYC = () => {
    setConsentGiven(false);
    setKycRecord(null);
  };

  if (verifying) {
    return (
      <OnboardingLayout
        currentStep={4}
        title="Verifying your identity"
        subtitle="Please wait while we verify your Aadhaar"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Processing...</h3>
            <p className="text-muted-foreground text-sm">
              This may take a few moments. Please do not close this page.
            </p>
          </CardContent>
        </Card>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      currentStep={4}
      title="Identity Verification"
      subtitle="Complete e-KYC to access all features"
    >
      <Card>
        <CardContent className="p-6 space-y-6">
          {kycRecord?.status === 'failed' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your previous verification attempt failed. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Aadhaar e-KYC</h3>
              <p className="text-sm text-muted-foreground">
                We use secure Aadhaar-based verification to confirm your identity.
                Your data is encrypted and we do not store your Aadhaar number.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Why KYC is required:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Builds trust with employers/workers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Enables secure payments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Unlocks all platform features
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Protects against fraud
              </li>
            </ul>
          </div>

          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
            />
            <label
              htmlFor="consent"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I consent to verify my identity using Aadhaar e-KYC. I understand that
              my Aadhaar number will not be stored and only a verification token
              will be retained.
            </label>
          </div>

          {kycRecord?.status === 'failed' ? (
            <Button
              onClick={retryKYC}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          ) : (
            <Button
              onClick={initiateKYC}
              disabled={!consentGiven || loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Initiating...' : 'Start Verification'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {kycRecord && kycRecord.attempts >= 3 && (
            <p className="text-xs text-center text-muted-foreground">
              Having trouble? Contact support at help@hzlr.in
            </p>
          )}
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}
