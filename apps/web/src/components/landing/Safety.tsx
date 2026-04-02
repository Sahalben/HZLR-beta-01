import { MessageSquare, AlertTriangle, Clock, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Safety() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-success mb-4 tracking-wide uppercase">
            Your Safety First
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Safety & Moderation
          </h2>
          <p className="text-lg text-primary-foreground/70">
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
                className="bg-primary-foreground/5 border-primary-foreground/10 p-6 hover:bg-primary-foreground/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-success" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-primary-foreground">{item.title}</h3>
                <p className="text-sm text-primary-foreground/70">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
