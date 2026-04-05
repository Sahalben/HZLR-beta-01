import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, MapPin, Calendar, Phone, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

export default function ProfileSetup() {
  const { profile, updateProfile, updateOnboardingState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Deep Demographics Form
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [education, setEducation] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(profile?.phone ? true : false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!profile) {
      navigate('/signup', { replace: true });
    }
  }, [profile, navigate]);

  const handleSimulateVerify = () => {
    if (!phone || phone.length < 10) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsPhoneVerified(true);
      toast({ title: 'Phone Verified', description: 'Your number has been securely verified.', className: 'bg-emerald-500 text-white' });
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!username || !firstName || !lastName || !address || !age || !phone || !education) {
      toast({ title: 'Wait!', description: 'Please fill out all fields before continuing.', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        username,
        full_name: `${firstName} ${lastName}`,
        address,
        age: parseInt(age),
        phone,
        education
      } as any);

      await updateOnboardingState('PROFILE_DATA_COLLECTED');
      navigate('/signup/kyc');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={3}
      title="Complete your profile"
      subtitle="Gathering critical demographics for your identity"
    >
      <Card variant="elevated" className="overflow-hidden border-0 shadow-2xl">
        <div className="bg-muted p-2 border-b border-border text-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step 2: Basic Demographics</span>
        </div>
        <CardContent className="p-8 space-y-8">
          
          {/* USERNAME & AGE GRID */}
          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-seafoam transition-colors" />
                  <Input id="username" placeholder="hzlr24" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className="pl-10 font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-seafoam transition-colors" />
                  <Input id="age" type="number" min={16} max={99} placeholder="22" value={age} onChange={(e) => setAge(e.target.value)} className="pl-10" />
                </div>
              </div>
          </div>

          {/* LEGAL NAME */}
          <div className="space-y-2">
             <Label>Legal Name</Label>
             <div className="grid grid-cols-2 gap-4">
                 <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                 <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
             </div>
             <p className="text-xs text-muted-foreground mt-1 text-right">Must exactly match ID for KYC</p>
          </div>

          {/* ADDRESS */}
          <div className="space-y-2">
            <Label htmlFor="address">Physical Address</Label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-seafoam transition-colors" />
              <Input id="address" placeholder="123 Sector 4, Bangalore, 560001" value={address} onChange={(e) => setAddress(e.target.value)} className="pl-10" />
            </div>
          </div>

          {/* PHONE OPTIONAL OPT-IN */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-seafoam transition-colors" />
                    <Input id="phone" type="tel" placeholder="9999999999" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isPhoneVerified} className={`pl-10 ${isPhoneVerified ? 'bg-success/5 border-success/30 text-success' : ''}`} />
                    {isPhoneVerified && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />}
                </div>
                {!isPhoneVerified && (
                     <Button type="button" variant="outline" onClick={handleSimulateVerify} disabled={isVerifying || phone.length < 10}>
                         {isVerifying ? "Sending..." : "Verify"}
                     </Button>
                )}
            </div>
          </div>

          {/* EDUCATION */}
          <div className="space-y-2">
            <Label htmlFor="education">Educational Qualification</Label>
            <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Select value={education} onValueChange={setEducation}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select highest qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">10th / 12th Pass</SelectItem>
                    <SelectItem value="diploma">Diploma / ITI</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree or Higher</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div className="pt-4">
              <Button onClick={handleSubmit} disabled={loading} className="w-full text-lg h-14 bg-foreground group hover:opacity-90 transition-opacity">
                {loading ? 'Saving Profile...' : 'Save & Continue to KYC'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
          </div>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}
