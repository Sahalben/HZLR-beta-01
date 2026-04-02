import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    value: "₹200-400",
    label: "Avg Hourly Rate",
    subtext: "F&B / Events",
    icon: TrendingUp,
  },
  {
    value: "94%",
    label: "Fill Rate",
    subtext: "Pilot data",
    icon: CheckCircle,
  },
  {
    value: "2.4 hrs",
    label: "Avg Time to Fill",
    subtext: "From post to confirm",
    icon: Clock,
  },
  {
    value: "47",
    label: "Avg Gigs/Worker",
    subtext: "Monthly active",
    icon: Users,
  },
];

const painPoints = [
  {
    problem: "Workers don't show up",
    solution: "Backup queue auto-fills within 5 minutes",
  },
  {
    problem: "Payment delays hurt trust",
    solution: "Instant payout on confirmed checkout",
  },
  {
    problem: "Unverified workers are risky",
    solution: "Aadhaar e-KYC + grooming certification",
  },
  {
    problem: "No track record for gig workers",
    solution: "Digital resume with reliability score",
  },
];

export function MarketProof() {
  return (
    <section id="workers" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Stats */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-seafoam mb-4 tracking-wide uppercase">
            Market Insights
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Built for the Real World
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="elevated" className="p-6 text-center">
                <Icon size={24} className="mx-auto mb-3 text-seafoam" />
                <p className="text-2xl md:text-3xl font-black text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </Card>
            );
          })}
        </div>

        {/* Pain Points */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground text-center mb-8">
            We solve the real problems
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {painPoints.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-destructive text-sm">✕</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground line-through">{item.problem}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle size={16} className="text-success flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
