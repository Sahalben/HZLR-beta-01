import { BadgeCheck, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    step: "01",
    icon: BadgeCheck,
    title: "Verify",
    subtitle: "Build Trust",
    description:
      "Complete Aadhaar e-KYC, upload your profile photo, and get grooming certified. Your verified digital identity opens doors.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "02",
    icon: Briefcase,
    title: "Book & Earn",
    subtitle: "Get Paid Instantly",
    description:
      "Browse prefunded gigs, apply or join backup queue. Check-in with geo-verification, complete work, get paid instantly to your wallet.",
    color: "from-emerald-500 to-green-500",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Grow",
    subtitle: "Build Your Career",
    description:
      "Every completed gig adds to your digital resume. Higher reliability scores unlock premium opportunities and better pay.",
    color: "from-amber-500 to-orange-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-seafoam mb-4 tracking-wide uppercase">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How HZLR Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From verification to payout in three simple steps. No middlemen, no delays.
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative group">
                {/* Connector Line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-border via-border to-transparent" />
                )}

                <div className="text-center">
                  {/* Step Number & Icon */}
                  <div className="relative inline-flex mb-6">
                    <div
                      className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon size={48} className="text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-background border-4 border-secondary flex items-center justify-center text-sm font-bold text-foreground">
                      {item.step}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-seafoam mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="default" size="lg" asChild>
            <Link to="/worker/signup">
              Start Working Today
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
