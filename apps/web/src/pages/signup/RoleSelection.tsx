import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ─── Inline keyframe styles injected once ───────────────────────────────────
const ANIM_STYLES = `
  @keyframes hzlr-tool-swing {
    0%, 100% { transform: rotate(-8deg) translateY(0px); }
    50%       { transform: rotate(8deg) translateY(-3px); }
  }
  @keyframes hzlr-coin-rise {
    0%   { transform: translateY(0px) scale(1);   opacity: 1; }
    60%  { transform: translateY(-14px) scale(1.1); opacity: 1; }
    100% { transform: translateY(-18px) scale(0.9); opacity: 0; }
  }
  @keyframes hzlr-hat-bob {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-5px) rotate(2deg); }
  }
  @keyframes hzlr-bar-grow {
    0%   { transform: scaleY(0.4); }
    100% { transform: scaleY(1); }
  }
  @keyframes hzlr-doc-slide {
    0%, 100% { transform: translateY(0px) rotate(-3deg); }
    50%       { transform: translateY(-6px) rotate(1deg); }
  }
  @keyframes hzlr-tick-pop {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg);   opacity: 1; }
  }
  @keyframes hzlr-glow-pulse {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.6; }
  }
  @keyframes hzlr-ring-expand {
    0%   { transform: scale(0.85); opacity: 0.5; }
    100% { transform: scale(1.35); opacity: 0; }
  }
  @keyframes hzlr-slide-up-in {
    from { transform: translateY(18px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes hzlr-card-enter {
    from { transform: translateY(24px) scale(0.97); opacity: 0; }
    to   { transform: translateY(0)    scale(1);    opacity: 1; }
  }
`;

// ─── Worker Illustration ─────────────────────────────────────────────────────
function WorkerIllustration({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <circle
        cx="40"
        cy="40"
        r="30"
        fill="hsl(158 60% 30% / 0.12)"
        style={active ? {
          animation: 'hzlr-glow-pulse 2s ease-in-out infinite',
        } : {}}
      />

      {/* Body */}
      <rect x="26" y="46" width="28" height="22" rx="6"
        fill="hsl(158 50% 20%)" />

      {/* Vest stripe */}
      <rect x="36" y="46" width="8" height="22" rx="1"
        fill="hsl(45 90% 55% / 0.85)" />

      {/* Head */}
      <circle cx="40" cy="38" r="10" fill="hsl(30 40% 78%)" />

      {/* Hard hat */}
      <g style={active ? { animation: 'hzlr-hat-bob 2.4s ease-in-out infinite' } : {}}>
        <ellipse cx="40" cy="29.5" rx="13" ry="3.5" fill="hsl(45 90% 52%)" />
        <rect x="30" y="22" width="20" height="10" rx="10"
          fill="hsl(45 90% 52%)" />
        <rect x="34" y="22" width="3" height="8" rx="1"
          fill="hsl(45 75% 38%)" opacity="0.5" />
      </g>

      {/* Arms */}
      <rect x="14" y="48" width="12" height="6" rx="3"
        fill="hsl(158 50% 20%)" />
      <rect x="54" y="48" width="12" height="6" rx="3"
        fill="hsl(158 50% 20%)" />

      {/* Tool (wrench) */}
      <g
        style={active ? {
          transformOrigin: '18px 51px',
          animation: 'hzlr-tool-swing 1.8s ease-in-out infinite',
        } : {}}
      >
        <rect x="8" y="49" width="10" height="4" rx="2"
          fill="hsl(210 15% 55%)" />
        <rect x="6" y="47" width="4" height="4" rx="1"
          fill="hsl(210 15% 45%)" />
      </g>

      {/* Floating coin */}
      {active && (
        <circle
          cx="58"
          cy="42"
          r="4"
          fill="hsl(45 90% 55%)"
          style={{
            animation: 'hzlr-coin-rise 2.2s ease-in-out infinite',
          }}
        />
      )}
      {active && (
        <text
          x="58"
          y="44.5"
          textAnchor="middle"
          fontSize="5"
          fontWeight="bold"
          fill="hsl(45 60% 25%)"
          style={{ animation: 'hzlr-coin-rise 2.2s ease-in-out infinite', userSelect: 'none' }}
        >
          ₹
        </text>
      )}
    </svg>
  );
}

// ─── Employer Illustration ───────────────────────────────────────────────────
function EmployerIllustration({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Ambient glow */}
      <circle
        cx="40"
        cy="40"
        r="30"
        fill="hsl(220 60% 40% / 0.10)"
        style={active ? { animation: 'hzlr-glow-pulse 2s ease-in-out infinite' } : {}}
      />

      {/* Body — suit */}
      <rect x="26" y="46" width="28" height="22" rx="6"
        fill="hsl(220 35% 22%)" />
      {/* Tie */}
      <polygon points="40,46 43,47 41,62 39,62 37,47"
        fill="hsl(158 55% 28%)" />
      {/* Lapels */}
      <polygon points="26,46 35,46 30,56" fill="hsl(220 30% 30%)" />
      <polygon points="54,46 45,46 50,56" fill="hsl(220 30% 30%)" />

      {/* Head */}
      <circle cx="40" cy="37" r="10" fill="hsl(30 40% 78%)" />

      {/* Hair */}
      <rect x="30" y="28" width="20" height="6" rx="5"
        fill="hsl(220 20% 20%)" />

      {/* Briefcase */}
      <g style={active ? { animation: 'hzlr-doc-slide 2.6s ease-in-out infinite' } : {}}>
        <rect x="52" y="52" width="16" height="12" rx="3"
          fill="hsl(158 55% 25%)" />
        <rect x="57" y="49" width="6" height="4" rx="2"
          fill="none"
          stroke="hsl(158 55% 25%)"
          strokeWidth="2" />
        <rect x="52" y="57" width="16" height="1.5"
          fill="hsl(158 45% 35%)" />
        <rect x="59" y="52" width="1.5" height="12"
          fill="hsl(158 45% 35%)" />
      </g>

      {/* Chart bars */}
      <g transform="translate(8, 46)">
        {[
          { h: 8,  x: 0,  delay: '0s',    color: 'hsl(158 55% 28%)' },
          { h: 13, x: 5,  delay: '0.15s', color: 'hsl(158 55% 32%)' },
          { h: 10, x: 10, delay: '0.3s',  color: 'hsl(158 55% 28%)' },
          { h: 16, x: 15, delay: '0.45s', color: 'hsl(45 80% 50%)' },
        ].map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={24 - bar.h}
            width="4"
            height={bar.h}
            rx="1.5"
            fill={bar.color}
            style={active ? {
              transformOrigin: `${bar.x + 2}px 24px`,
              animation: `hzlr-bar-grow 1.8s ease-out infinite alternate`,
              animationDelay: bar.delay,
            } : {}}
          />
        ))}
        {/* Baseline */}
        <rect x="0" y="24" width="20" height="1" rx="0.5"
          fill="hsl(220 20% 50% / 0.3)" />
      </g>
    </svg>
  );
}

// ─── Role Card ───────────────────────────────────────────────────────────────
interface RoleCardProps {
  id: UserRole;
  title: string;
  tagline: string;
  perks: string[];
  accentHsl: string;
  illustration: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  enterDelay: string;
}

function RoleCard({
  id,
  title,
  tagline,
  perks,
  accentHsl,
  illustration,
  selected,
  onSelect,
  enterDelay,
}: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'w-full text-left rounded-2xl border-2 p-5 cursor-pointer',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'relative overflow-hidden group',
        selected
          ? 'border-transparent shadow-lg scale-[1.01]'
          : 'border-border hover:border-border/80 hover:shadow-md bg-card',
      )}
      style={{
        animation: `hzlr-card-enter 0.45s cubic-bezier(0.22,1,0.36,1) ${enterDelay} both`,
        ...(selected
          ? {
              background: `linear-gradient(135deg, hsl(${accentHsl} / 0.08) 0%, hsl(var(--card)) 60%)`,
              borderColor: `hsl(${accentHsl})`,
              boxShadow: `0 6px 32px -6px hsl(${accentHsl} / 0.28), inset 0 1px 0 hsl(0 0% 100% / 0.6)`,
            }
          : {}),
      }}
    >
      {/* Subtle corner glow when selected */}
      {selected && (
        <span
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsl(${accentHsl} / 0.18) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Ring expand on select (decorative) */}
      {selected && (
        <span
          className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
          style={{
            borderColor: `hsl(${accentHsl} / 0.5)`,
            animation: 'hzlr-ring-expand 0.5s ease-out forwards',
          }}
          aria-hidden="true"
        />
      )}

      <div className="flex items-start gap-4">
        {/* Illustration box */}
        <div
          className="flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, hsl(${accentHsl} / 0.10) 0%, hsl(${accentHsl} / 0.05) 100%)`,
          }}
        >
          <div className="w-16 h-16">
            {illustration}
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-base text-foreground leading-tight">
              {title}
            </h3>
            {/* Selection indicator */}
            <span
              className={cn(
                'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                selected
                  ? 'border-transparent'
                  : 'border-muted-foreground/40',
              )}
              style={selected ? {
                background: `hsl(${accentHsl})`,
                boxShadow: `0 0 0 3px hsl(${accentHsl} / 0.2)`,
                animation: 'hzlr-tick-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
              } : {}}
            >
              {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </span>
          </div>

          <p
            className="text-sm mb-2.5 leading-snug"
            style={{ color: `hsl(${accentHsl})` }}
          >
            {tagline}
          </p>

          <ul className="space-y-1">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: `hsl(${accentHsl} / 0.7)` }}
                />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile, updateProfile, updateOnboardingState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Inject animation keyframes once
  React.useEffect(() => {
    const id = 'hzlr-role-anim';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = ANIM_STYLES;
      document.head.appendChild(style);
    }
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  React.useEffect(() => {
    if (profile?.role) {
      if (profile.role === 'employer') {
        navigate('/employer/onboarding', { replace: true });
      } else {
        navigate('/signup/profile', { replace: true });
      }
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
      if (selectedRole === 'employer') {
        navigate('/employer/onboarding');
      } else {
        navigate('/signup/profile');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save your selection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const roles: {
    id: UserRole;
    title: string;
    tagline: string;
    perks: string[];
    accentHsl: string;
    illustration: React.ReactNode;
    enterDelay: string;
  }[] = [
    {
      id: 'worker',
      title: "I'm here to work",
      tagline: 'Find gigs, get paid instantly',
      perks: [
        'Daily gig listings near you',
        'Same-day wallet payouts',
        'Build a verified work history',
      ],
      // Forest-teal — within HZLR brand
      accentHsl: '158 55% 28%',
      illustration: <WorkerIllustration active={selectedRole === 'worker'} />,
      enterDelay: '0ms',
    },
    {
      id: 'employer',
      title: "I'm here to hire",
      tagline: 'Post jobs, manage your team',
      perks: [
        'Verified, background-checked workers',
        'Prefund gigs — pay only on completion',
        'Real-time attendance tracking',
      ],
      // Slate-indigo — professional complement to forest green
      accentHsl: '220 45% 38%',
      illustration: <EmployerIllustration active={selectedRole === 'employer'} />,
      enterDelay: '80ms',
    },
  ];

  return (
    <OnboardingLayout
      currentStep={1}
      title="What brings you to HZLR?"
      subtitle="Choose your role — you can always change it later"
    >
      <div className="space-y-3">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            {...role}
            selected={selectedRole === role.id}
            onSelect={() => setSelectedRole(role.id)}
          />
        ))}

        {/* Continue button — slides in once a role is selected */}
        <div
          style={{
            animation: selectedRole
              ? 'hzlr-slide-up-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards'
              : 'none',
            opacity: selectedRole ? undefined : 0,
            pointerEvents: selectedRole ? 'auto' : 'none',
          }}
          className="pt-2"
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="28 10" />
                </svg>
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue as{' '}
                {selectedRole === 'worker' ? 'Worker' : 'Employer'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
