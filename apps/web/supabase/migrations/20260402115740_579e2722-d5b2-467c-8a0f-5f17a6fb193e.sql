
-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TYPE public.job_status AS ENUM ('draft', 'open', 'filled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.job_category AS ENUM ('construction', 'cleaning', 'delivery', 'warehouse', 'hospitality', 'retail', 'security', 'driving', 'other');

CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category public.job_category NOT NULL DEFAULT 'other',
  location_lat NUMERIC,
  location_lng NUMERIC,
  address TEXT,
  pay_per_hour INTEGER NOT NULL DEFAULT 0,
  guaranteed_hours INTEGER NOT NULL DEFAULT 0,
  total_pay INTEGER NOT NULL DEFAULT 0,
  qty_needed INTEGER NOT NULL DEFAULT 1,
  qty_filled INTEGER NOT NULL DEFAULT 0,
  status public.job_status NOT NULL DEFAULT 'draft',
  prefunded BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open jobs" ON public.jobs FOR SELECT USING (status = 'open' OR employer_id = auth.uid());
CREATE POLICY "Employers can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Employers can delete own draft jobs" ON public.jobs FOR DELETE USING (auth.uid() = employer_id AND status = 'draft');

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- APPLICATIONS TABLE
-- ============================================
CREATE TYPE public.application_type AS ENUM ('applied', 'queued');
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'completed');

CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  type public.application_type NOT NULL DEFAULT 'applied',
  queue_position INTEGER,
  status public.application_status NOT NULL DEFAULT 'pending',
  accepted_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view own applications" ON public.applications FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Employers can view applications for their jobs" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.employer_id = auth.uid())
);
CREATE POLICY "Workers can apply to jobs" ON public.applications FOR INSERT WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Workers can cancel own applications" ON public.applications FOR UPDATE USING (auth.uid() = worker_id);
CREATE POLICY "Employers can update applications for their jobs" ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.employer_id = auth.uid())
);

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- WALLETS TABLE
-- ============================================
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  available_cents INTEGER NOT NULL DEFAULT 0,
  pending_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TYPE public.transaction_type AS ENUM ('credit', 'debit', 'escrow_hold', 'escrow_release', 'withdrawal', 'refund');

CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  fee_cents INTEGER NOT NULL DEFAULT 0,
  type public.transaction_type NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.wallets WHERE wallets.id = transactions.wallet_id AND wallets.user_id = auth.uid())
);
CREATE POLICY "System can insert transactions" ON public.transactions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.wallets WHERE wallets.id = transactions.wallet_id AND wallets.user_id = auth.uid())
);

-- ============================================
-- ESCROW HOLDS TABLE
-- ============================================
CREATE TYPE public.escrow_status AS ENUM ('held', 'released', 'refunded');

CREATE TABLE public.escrow_holds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  employer_wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  status public.escrow_status NOT NULL DEFAULT 'held',
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.escrow_holds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view own escrow holds" ON public.escrow_holds FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.wallets WHERE wallets.id = escrow_holds.employer_wallet_id AND wallets.user_id = auth.uid())
);
CREATE POLICY "Employers can create escrow holds" ON public.escrow_holds FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.wallets WHERE wallets.id = escrow_holds.employer_wallet_id AND wallets.user_id = auth.uid())
);

CREATE TRIGGER update_escrow_holds_updated_at BEFORE UPDATE ON public.escrow_holds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- AUTO-CREATE WALLET ON PROFILE COMPLETION
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_wallet_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.onboarding_state = 'ONBOARDING_COMPLETE' AND OLD.onboarding_state != 'ONBOARDING_COMPLETE' THEN
    INSERT INTO public.wallets (user_id) VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_onboarding_complete_create_wallet
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_wallet_creation();
