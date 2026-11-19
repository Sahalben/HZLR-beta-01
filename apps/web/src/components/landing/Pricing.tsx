import { useState } from "react";
import { Check, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ─── Animated Border Wrapper ────────────────────────────────────────────────

function AnimatedBorderWrapper({
  children,
  glowColors,
}: {
  children: React.ReactNode;
  glowColors: string;
}) {
  return (
    <div className="relative rounded-[25px] p-[1px] overflow-hidden group h-full transition-shadow duration-500 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]">
      {/* Rotating conic gradient border */}
      <div
        className="absolute -inset-[150%] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from 0deg, ${glowColors})`,
          animation: "pricing-border-rotate 8s linear infinite",
        }}
      />
      {/* Inner container to crop the border to 1px */}
      <div className="relative w-full h-full rounded-[24px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ─── Audience Switcher ────────────────────────────────────────────────────────

type Audience = "workers" | "employers";

function AudienceSwitcher({
  value,
  onChange,
}: {
  value: Audience;
  onChange: (v: Audience) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-muted/40 border border-border/40 p-1 gap-1">
      {(
        [
          { key: "workers", label: "For HZLRs" },
          { key: "employers", label: "For Employers" },
        ] as const
      ).map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={[
            "relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
            value === key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Feature list shared styles ───────────────────────────────────────────────

function FeatureList({
  features,
  variant = "light",
}: {
  features: string[];
  variant?: "light" | "dark";
}) {
  const iconBg =
    variant === "dark"
      ? "bg-primary-foreground/20"
      : "bg-emerald-500/10";
  const iconColor =
    variant === "dark" ? "text-primary-foreground" : "text-emerald-600";
  const textColor =
    variant === "dark" ? "text-primary-foreground" : "text-foreground";

  return (
    <ul className="space-y-3 mb-4">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
          >
            <Check size={12} className={iconColor} />
          </div>
          <span className={textColor}>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Worker Pricing Panel ─────────────────────────────────────────────────────

function WorkerPanel() {
  return (
    <div className="max-w-lg mx-auto w-full">
      <AnimatedBorderWrapper glowColors="#10B981, #34D399, #059669, #F59E0B, #10B981">
        <Card
          variant="elevated"
          className="p-8 relative overflow-hidden border-0 shadow-none h-full"
        >
          {/* Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
            Zero Upfront Cost
          </div>

          {/* Price */}
          <div className="mb-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              For HZLRs
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-foreground">₹0</span>
              <span className="text-muted-foreground">/to join</span>
            </div>
          </div>

          {/* Transparent deduction note */}
          <div className="flex gap-2 items-start rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-4 py-3 mb-6">
            <Info
              size={15}
              className="text-emerald-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-muted-foreground leading-snug">
              A <span className="font-semibold text-foreground">10% platform contribution</span> is
              deducted from each gig's earnings. Once your total contributions reach{" "}
              <span className="font-semibold text-foreground">₹400 in a month</span>, deductions
              stop for that month. No separate fee is charged. The 10% <em>is</em> the ₹400
              monthly contribution.
            </p>
          </div>

          {/* Features */}
          <FeatureList
            features={[
              "Unlimited job applications",
              "Digital resume builder",
              "Instant UPI wallet payouts",
              "Backup queue access",
              "Reliability score tracking",
              "Aadhaar-verified credibility",
              "In-app messaging & support",
              "Grooming certification badges",
            ]}
            variant="light"
          />

          <Button variant="default" size="lg" className="w-full" asChild>
            <Link to="/signup">
              Start Working
              <ArrowRight size={18} />
            </Link>
          </Button>
        </Card>
      </AnimatedBorderWrapper>
    </div>
  );
}

// ─── Employer Pricing Panel ───────────────────────────────────────────────────

const EMPLOYER_PLANS = [
  {
    id: "household",
    badge: "Most Popular",
    label: "Households",
    price: "Free",
    priceSub: "always",
    description: "Hire verified workers for household jobs, no subscription needed.",
    features: [
      "Post household gigs instantly",
      "Browse Aadhaar-verified workers",
      "Escrow-protected payments",
      "Geo-verified check-in",
      "In-app messaging",
      "Reliability score visibility",
    ],
    cta: "Start Hiring",
    ctaTo: "/signup",
    ctaVariant: "hero" as const,
    cardVariant: "forest" as const,
    glowColors: "#10B981, #6EE7B7, #047857, #34D399, #10B981",
  },
  {
    id: "small-business",
    badge: "SME",
    label: "Small Businesses",
    price: "₹1,000",
    priceSub: "/month",
    description: "Scale your team with reliable gig workers on demand.",
    features: [
      "Everything in Households",
      "Bulk hiring tools",
      "Team management dashboard",
      "Priority worker matching",
      "Anti-flake backup queue",
      "Invoice & billing support",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    ctaTo: "mailto:sales@hzlr.in",
    ctaVariant: "default" as const,
    cardVariant: "elevated" as const,
    glowColors: "#10B981, #34D399, #059669, #F59E0B, #10B981",
  },
  {
    id: "enterprise",
    badge: "Enterprise",
    label: "Enterprises",
    price: "₹10,000",
    priceSub: "/month + custom",
    description: "Custom integrations and volume pricing for enterprise-scale operations.",
    features: [
      "Everything in Small Businesses",
      "Custom SLA agreements",
      "API & ATS integrations",
      "White-label options",
      "Multi-site workforce management",
      "Advanced analytics & reporting",
    ],
    cta: "Contact Sales",
    ctaTo: "mailto:sales@hzlr.in",
    ctaVariant: "default" as const,
    cardVariant: "elevated" as const,
    glowColors: "#10B981, #34D399, #059669, #F59E0B, #10B981",
  },
] as const;

function EmployerPanel() {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
      {EMPLOYER_PLANS.map((plan) => {
        const isDark = plan.cardVariant === "forest";
        const badgeCls = isDark
          ? "bg-primary-foreground/20 text-primary-foreground"
          : "bg-emerald-500/10 text-emerald-600";
        const labelCls = isDark
          ? "text-primary-foreground/70"
          : "text-muted-foreground";
        const priceCls = isDark
          ? "text-primary-foreground"
          : "text-foreground";
        const subCls = isDark
          ? "text-primary-foreground/60"
          : "text-muted-foreground";
        const descCls = isDark
          ? "text-primary-foreground/60"
          : "text-muted-foreground";

        return (
          <AnimatedBorderWrapper key={plan.id} glowColors={plan.glowColors}>
            <Card
              variant={plan.cardVariant}
              className="p-7 relative overflow-hidden border-0 shadow-none h-full flex flex-col"
            >
              {/* Badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeCls}`}
              >
                {plan.badge}
              </div>

              {/* Price */}
              <div className="mb-4">
                <h3 className={`text-sm font-medium ${labelCls} mb-2`}>
                  {plan.label}
                </h3>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className={`text-4xl font-black ${priceCls}`}>
                    {plan.price}
                  </span>
                  {plan.priceSub && (
                    <span className={`text-sm ${subCls}`}>{plan.priceSub}</span>
                  )}
                </div>
                <p className={`text-sm mt-2 ${descCls}`}>{plan.description}</p>
              </div>

              {/* Features */}
              <div className="flex-1">
                <FeatureList
                  features={plan.features as unknown as string[]}
                  variant={isDark ? "dark" : "light"}
                />
              </div>

              {/* CTA */}
              <Button
                variant={plan.ctaVariant}
                size="lg"
                className="w-full mt-auto"
                asChild
              >
                {plan.ctaTo.startsWith("mailto:") ? (
                  <a href={plan.ctaTo}>
                    {plan.cta}
                    <ArrowRight size={18} />
                  </a>
                ) : (
                  <Link to={plan.ctaTo}>
                    {plan.cta}
                    <ArrowRight size={18} />
                  </Link>
                )}
              </Button>
            </Card>
          </AnimatedBorderWrapper>
        );
      })}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function Pricing() {
  const [audience, setAudience] = useState<Audience>("workers");

  return (
    <section
      id="pricing"
      className="dark relative py-20 md:py-28 bg-background text-foreground overflow-hidden"
    >
      {/* Keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pricing-grid-anim {
              0%   { background-position: 0 0; }
              100% { background-position: 40px 40px; }
            }
            @keyframes pricing-border-rotate {
              0%   { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `,
        }}
      />

      {/* Subtle animated grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "pricing-grid-anim 25s linear infinite",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,1) 150px, rgba(0,0,0,1) calc(100% - 120px), transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,1) 150px, rgba(0,0,0,1) calc(100% - 120px), transparent)",
        }}
      />
      {/* Subtle vignette layer */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/10" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block text-sm font-semibold text-muted-foreground mb-4 tracking-wide uppercase">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Transparent. Fair. Always.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            HZLRs keep what they earn. Employers pay only for what they need.
          </p>

          {/* Audience Switcher */}
          <div className="flex justify-center">
            <AudienceSwitcher value={audience} onChange={setAudience} />
          </div>
        </div>

        {/* Dynamic panel */}
        <div className="mt-10">
          {audience === "workers" ? <WorkerPanel /> : <EmployerPanel />}
        </div>
      </div>

      {/* Bottom bleed — dissolves into Safety */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
    </section>
  );
}
