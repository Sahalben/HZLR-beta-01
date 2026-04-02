import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, MapPin, Building2, Mail, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const workerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  photo_url: z.string().optional(),
  preferred_categories: z.array(z.string()).min(1, 'Select at least one category'),
  location_lat: z.number(),
  location_lng: z.number(),
  radius_km: z.number().min(1).max(100),
});

const employerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  company_name: z.string().min(2, 'Company name is required').max(200),
  business_email: z.string().email('Invalid email address'),
  company_address: z.string().min(5, 'Address is required').max(500),
  hiring_role: z.enum(['hr', 'ops', 'owner']),
});

const categories = [
  'Food & Beverage',
  'Logistics',
  'Events',
  'Retail',
  'Hospitality',
  'Cleaning',
  'Security',
  'Warehouse',
];

export default function ProfileSetup() {
  const { profile, updateProfile, updateOnboardingState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Worker fields
  const [fullName, setFullName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState('10');

  // Employer fields
  const [companyName, setCompanyName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [hiringRole, setHiringRole] = useState<string>('');

  const isWorker = profile?.role === 'worker';

  useEffect(() => {
    if (!profile?.role) {
      navigate('/signup/role', { replace: true });
    }
  }, [profile, navigate]);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support location services.',
        variant: 'destructive',
      });
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
        toast({
          title: 'Location captured',
          description: 'Your location has been saved.',
        });
      },
      (error) => {
        setLocationLoading(false);
        toast({
          title: 'Location error',
          description: 'Unable to get your location. Please enable location services.',
          variant: 'destructive',
        });
      }
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isWorker) {
        const validation = workerSchema.safeParse({
          full_name: fullName,
          preferred_categories: selectedCategories,
          location_lat: location?.lat,
          location_lng: location?.lng,
          radius_km: parseInt(radius),
        });

        if (!validation.success) {
          const error = validation.error.errors[0];
          toast({
            title: 'Validation Error',
            description: error.message,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        await updateProfile({
          full_name: fullName,
          preferred_categories: selectedCategories,
          location_lat: location!.lat,
          location_lng: location!.lng,
          radius_km: parseInt(radius),
        });
      } else {
        const validation = employerSchema.safeParse({
          full_name: fullName,
          company_name: companyName,
          business_email: businessEmail,
          company_address: companyAddress,
          hiring_role: hiringRole,
        });

        if (!validation.success) {
          const error = validation.error.errors[0];
          toast({
            title: 'Validation Error',
            description: error.message,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        await updateProfile({
          full_name: fullName,
          company_name: companyName,
          business_email: businessEmail,
          company_address: companyAddress,
          hiring_role: hiringRole,
        });
      }

      await updateOnboardingState('PROFILE_DATA_COLLECTED');
      navigate('/signup/kyc');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={3}
      title={isWorker ? 'Complete your profile' : 'Tell us about your company'}
      subtitle={isWorker ? 'Help employers find you' : 'Set up your hiring profile'}
    >
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Common: Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isWorker ? (
            <>
              {/* Worker: Categories */}
              <div className="space-y-2">
                <Label>Preferred Job Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Worker: Location */}
              <div className="space-y-2">
                <Label>Your Location</Label>
                <Button
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {locationLoading
                    ? 'Getting location...'
                    : location
                    ? 'Location captured ✓'
                    : 'Get Current Location'}
                </Button>
                {location && (
                  <p className="text-xs text-muted-foreground text-center">
                    Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Worker: Radius */}
              <div className="space-y-2">
                <Label htmlFor="radius">Work Radius (km)</Label>
                <Select value={radius} onValueChange={setRadius}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="20">20 km</SelectItem>
                    <SelectItem value="50">50 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {/* Employer: Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Employer: Business Email */}
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="businessEmail"
                    type="email"
                    placeholder="email@company.com"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Employer: Address */}
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  placeholder="Enter full address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>

              {/* Employer: Hiring Role */}
              <div className="space-y-2">
                <Label htmlFor="hiringRole">Your Role</Label>
                <Select value={hiringRole} onValueChange={setHiringRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR / Recruitment</SelectItem>
                    <SelectItem value="ops">Operations</SelectItem>
                    <SelectItem value="owner">Business Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Saving...' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </OnboardingLayout>
  );
}
