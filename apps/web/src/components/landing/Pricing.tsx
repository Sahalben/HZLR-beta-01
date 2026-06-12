import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Reusable Animated Border Wrapper for Cards
function AnimatedBorderWrapper({ children, glowColors }: { children: React.ReactNode, glowColors: string }) {
  return (
    <div className="relative rounded-[25px] p-[1px] overflow-hidden group h-full transition-shadow duration-500 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]">
      {/* Rotating conic gradient border */}
      <div 
        className="absolute -inset-[150%] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from 0deg, ${glowColors})`,
          animation: 'pricing-border-rotate 8s linear infinite'
        }}
      />
      {/* Inner container to crop the border to 1px */}
      <div className="relative w-full h-full rounded-[24px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="dark relative py-20 md:py-28 bg-background text-foreground overflow-hidden">
      {/* Subtle animated grid background */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pricing-grid-anim {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }
        @keyframes pricing-border-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}} />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'pricing-grid-anim 25s linear infinite',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,1) 150px, rgba(0,0,0,1) calc(100% - 120px), transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,1) 150px, rgba(0,0,0,1) calc(100% - 120px), transparent)'
        }}
      />
      {/* Subtle vignette layer */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/10" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-muted-foreground mb-4 tracking-wide uppercase">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Transparent. Fair. Always.
          </h2>
          <p className="text-lg text-muted-foreground">
            Workers pay nothing. Employers pay only for successful hires.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Worker Card */}
          <AnimatedBorderWrapper glowColors="#10B981, #34D399, #059669, #F59E0B, #10B981">
            <Card variant="elevated" className="p-8 relative overflow-hidden border-0 shadow-none h-full">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                Free Forever
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">For Workers</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-foreground">₹0</span>
                  <span className="text-muted-foreground">/always</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited job applications",
                  "Digital resume builder",
                  "Instant wallet payouts",
                  "Backup queue access",
                  "Reliability score tracking",
                  "In-app messaging",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-emerald-600" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="default" size="lg" className="w-full" asChild>
                <Link to="/worker/signup">
                  Start Working
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </Card>
          </AnimatedBorderWrapper>

          {/* Employer Card */}
          <AnimatedBorderWrapper glowColors="#10B981, #6EE7B7, #047857, #34D399, #10B981">
            <Card variant="forest" className="p-8 relative overflow-hidden border-0 shadow-none h-full">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold">
                Pay Per Hire
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-primary-foreground/70 mb-2">For Employers</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-primary-foreground">Custom</span>
                </div>
                <p className="text-sm text-primary-foreground/60 mt-2">Based on role & volume</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Verified worker pool",
                  "Reliability score access",
                  "Prefund & escrow system",
                  "Anti-flake backup queue",
                  "Bulk hiring tools",
                  "Priority support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-primary-foreground" />
                    </div>
                    <span className="text-primary-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/employer/signup">
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </Card>
          </AnimatedBorderWrapper>

        </div>
      </div>
    </section>
  );
}
