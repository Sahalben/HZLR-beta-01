import { Link } from "react-router-dom";
import { ArrowRight, Users, CheckCircle, Zap, Clock, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Users,
    title: "Verified Talent Pool",
    description: "Access Aadhaar-verified workers with proven track records and reliability scores.",
  },
  {
    icon: Zap,
    title: "Instant Hiring",
    description: "Post a gig and receive qualified applicants within minutes, not days.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "Backup queue ensures you always have reliable workers ready to step in.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description: "Geo-verified check-ins confirm workers arrive on time, every time.",
  },
  {
    icon: FileText,
    title: "Simplified Compliance",
    description: "Digital records, automated invoicing, and transparent payment trails.",
  },
  {
    icon: CheckCircle,
    title: "Pay for Results",
    description: "Only release payment when work is confirmed complete. No upfront risks.",
  },
];

export function ForEmployers() {
  return (
    <section id="employers" className="py-20 md:py-28 bg-primary">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-semibold text-primary-foreground mb-4">
            For Employers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Hire verified talent,{" "}
            <span className="text-seafoam">risk-free</span>
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Stop worrying about no-shows. Get reliable, verified workers with our backup queue guarantee.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                variant="glass"
                className="p-6 bg-primary-foreground/5 border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-seafoam" />
                </div>
                <h3 className="text-lg font-bold text-primary-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  {benefit.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="xl" asChild>
            <Link to="/employer/signup">
              Start Hiring Today
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
