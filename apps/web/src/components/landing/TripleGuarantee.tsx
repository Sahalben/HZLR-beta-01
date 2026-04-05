import { Banknote, Shield, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "tween" as const, ease: "easeOut", duration: 0.5 } }
};

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
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-xs font-bold text-seafoam mb-4 tracking-widest uppercase border border-seafoam/20 px-3 py-1 rounded-full bg-seafoam/10">
            Why HZLR
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">
            The Triple Guarantee
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            Three promises that set us apart. Every worker protected. Every employer confident.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
           variants={gridVariants}
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-100px" }}
           className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {guarantees.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} variants={cardVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card
                  variant="elevated"
                  className="p-8 group h-full bg-secondary/30 backdrop-blur-md border-border/50 hover:border-border transition-colors shadow-xl"
                >
                  <CardContent className="p-0">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}
                    >
                      <Icon size={28} className={item.colorClass} />
                    </div>

                    {/* Badge */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${item.bgClass} ${item.colorClass} mb-4 shadow-sm`}
                    >
                      {item.highlight}
                    </span>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
