
-- Fix function search path for validate_onboarding_transition
CREATE OR REPLACE FUNCTION public.validate_onboarding_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
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
