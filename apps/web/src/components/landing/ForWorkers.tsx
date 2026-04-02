import { Link } from "react-router-dom";
import { ArrowRight, Wallet, Shield, TrendingUp, Clock, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Wallet,
    title: "Instant Payouts",
    description: "Get paid the same day. No waiting weeks for your hard-earned money.",
  },
  {
    icon: Shield,
    title: "Guaranteed Fair Pay",
    description: "Escrow protection ensures you always receive what was promised.",
  },
  {
    icon: TrendingUp,
    title: "Build Your Resume",
    description: "Every completed gig adds to your verified digital work history.",
  },
  {
    icon: Clock,
    title: "Work When You Want",
    description: "Choose gigs that fit your schedule. You're in control.",
  },
  {
    icon: MapPin,
    title: "Find Local Opportunities",
    description: "Discover gigs near you with transparent location and pay details.",
  },
  {
    icon: Award,
    title: "Grow Your Credibility",
    description: "Higher reliability scores unlock better-paying opportunities.",
  },
];

export function ForWorkers() {
  return (
    <section id="workers" className="py-20 md:py-28 bg-mint">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
            For Workers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Your skills deserve{" "}
            <span className="text-primary">fair pay</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop chasing payments. Start building your verified work history while earning on your terms.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                variant="elevated"
                className="p-6 bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="default" size="xl" asChild>
            <Link to="/worker/signup">
              Start Working Today
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
