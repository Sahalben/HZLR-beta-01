import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-seafoam mb-4 tracking-wide uppercase">
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
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Worker Card */}
          <Card variant="elevated" className="p-8 relative overflow-hidden">
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

          {/* Employer Card */}
          <Card variant="forest" className="p-8 relative overflow-hidden">
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
        </div>
      </div>
    </section>
  );
}
