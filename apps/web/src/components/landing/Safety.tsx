import { MessageSquare, AlertTriangle, Clock, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Safety() {
  return (
    <section className="dark py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary mb-4 tracking-wide uppercase">
            Your Safety First
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Safety & Moderation
          </h2>
          <p className="text-lg text-muted-foreground">
            Every interaction is protected. Report issues instantly and get resolution within 2 hours.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Monitored Chat",
              description: "All in-app messaging is encrypted and moderated. No phone numbers shared.",
            },
            {
              icon: AlertTriangle,
              title: "One-Click Report",
              description: "Report any issue instantly. Our team reviews with full context.",
            },
            {
              icon: Clock,
              title: "2-Hour SLA",
              description: "Every ticket gets a response within 2 hours. Urgent issues prioritized.",
            },
            {
              icon: Lock,
              title: "Data Privacy",
              description: "Aadhaar is verified but never stored. Your data stays yours.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="bg-secondary/40 border-border/50 p-6 hover:bg-secondary/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
