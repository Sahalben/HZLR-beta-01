
-- Create onboarding state enum
CREATE TYPE public.onboarding_state AS ENUM (
  'ANONYMOUS',
  'ROLE_SELECTED',
  'OTP_REQUESTED',
  'OTP_VERIFIED',
  'PROFILE_DATA_COLLECTED',
  'E_KYC_PENDING',
  'E_KYC_VERIFIED',
  'ONBOARDING_COMPLETE'
);

-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('worker', 'employer');

-- Create KYC status enum
CREATE TYPE public.kyc_status AS ENUM ('pending', 'verified', 'failed');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role public.user_role,
  phone TEXT UNIQUE,
  full_name TEXT,
  photo_url TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  radius_km INTEGER,
  preferred_categories TEXT[],
  company_name TEXT,
  business_email TEXT,
  company_address TEXT,
  hiring_role TEXT,
  onboarding_state public.onboarding_state NOT NULL DEFAULT 'ANONYMOUS',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create KYC records table
CREATE TABLE public.kyc_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  reference TEXT NOT NULL,
  status public.kyc_status NOT NULL DEFAULT 'pending',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_timestamp TIMESTAMP WITH TIME ZONE,
  attempts INTEGER NOT NULL DEFAULT 0,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for kyc_records
CREATE POLICY "Users can view their own KYC records"
ON public.kyc_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC records"
ON public.kyc_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KYC records"
ON public.kyc_records FOR UPDATE
USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, phone, onboarding_state)
  VALUES (NEW.id, NEW.phone, 'OTP_VERIFIED');
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_records_updated_at
  BEFORE UPDATE ON public.kyc_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to validate state transitions
CREATE OR REPLACE FUNCTION public.validate_onboarding_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  valid_transitions TEXT[][] := ARRAY[
    ARRAY['ANONYMOUS', 'ROLE_SELECTED'],
    ARRAY['ROLE_SELECTED', 'OTP_REQUESTED'],
    ARRAY['OTP_REQUESTED', 'OTP_VERIFIED'],
    ARRAY['OTP_VERIFIED', 'PROFILE_DATA_COLLECTED'],
    ARRAY['PROFILE_DATA_COLLECTED', 'E_KYC_PENDING'],
    ARRAY['E_KYC_PENDING', 'E_KYC_VERIFIED'],
    ARRAY['E_KYC_VERIFIED', 'ONBOARDING_COMPLETE']
  ];
  is_valid BOOLEAN := false;
  transition TEXT[];
BEGIN
  -- Allow same state (no change)
  IF OLD.onboarding_state = NEW.onboarding_state THEN
    RETURN NEW;
  END IF;
  
  -- Check if transition is valid
  FOREACH transition SLICE 1 IN ARRAY valid_transitions LOOP
    IF OLD.onboarding_state::TEXT = transition[1] AND NEW.onboarding_state::TEXT = transition[2] THEN
      is_valid := true;
      EXIT;
    END IF;
  END LOOP;
  
  IF NOT is_valid THEN
    RAISE EXCEPTION 'Invalid onboarding state transition from % to %', OLD.onboarding_state, NEW.onboarding_state;
  END IF;
  
  -- Prevent role change after ROLE_SELECTED
  IF OLD.role IS NOT NULL AND NEW.role IS NOT NULL AND OLD.role != NEW.role THEN
    RAISE EXCEPTION 'Role cannot be changed after selection';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to validate state transitions
CREATE TRIGGER validate_onboarding_state_transition
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_onboarding_transition();
