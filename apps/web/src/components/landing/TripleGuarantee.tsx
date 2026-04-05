import { Banknote, Shield, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const guarantees = [
  {
    icon: Banknote,
    title: "Guaranteed Fair Pay",
    description:
      "Every gig is prefunded before you start. Escrow ensures your earnings are protected and paid out instantly upon completion.",
    highlight: "Escrow Protected",
    colorClass: "text-success",
    bgClass: "bg-success/10",
  },
  {
    icon: UserCheck,
    title: "Guaranteed Credibility",
    description:
      "Build your digital resume with every completed gig. Aadhaar-verified profiles and grooming badges prove your professionalism.",
    highlight: "Aadhaar Verified",
    colorClass: "text-info",
    bgClass: "bg-info/10",
  },
  {
    icon: Shield,
    title: "Guaranteed Safety",
    description:
      "Monitored in-app chat, one-click reporting, and a 2-hour SLA for ticket resolution. Plus backup queue ensures no lost opportunities.",
    highlight: "2-Hour SLA",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
  },
];

export function TripleGuarantee() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-seafoam mb-4 tracking-wide uppercase">
            Why HZLR
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Triple Guarantee
          </h2>
          <p className="text-lg text-muted-foreground">
            Three promises that set us apart. Every worker protected. Every employer confident.
          </p>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {guarantees.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={index * 100}>
                <Card
                  variant="elevated"
                  className="p-8 group h-full"
                >
                  <CardContent className="p-0">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={28} className={item.colorClass} />
                    </div>

                    {/* Badge */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.bgClass} ${item.colorClass} mb-4`}
                    >
                      {item.highlight}
                    </span>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
