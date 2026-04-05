import { BadgeCheck, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 20 } }
};

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
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6, ease: "easeOut" }}
           className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-xs font-bold text-seafoam/80 mb-4 tracking-widest uppercase border border-seafoam/20 px-3 py-1 rounded-full bg-seafoam/5">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">
            How HZLR Works
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            From verification to payout in three simple steps. No middlemen, no delays.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
           variants={gridVariants}
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-100px" }}
           className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12"
        >
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.step} variants={cardVariants} className="relative group">
                {/* Connector Line (desktop) */}
                {index < steps.length - 1 && (
                  <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    className="hidden md:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-border via-border/50 to-transparent origin-left" 
                  />
                )}

                <div className="text-center">
                  {/* Step Number & Icon */}
                  <div className="relative inline-flex mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-2xl shadow-primary/10`}
                    >
                      <Icon size={48} className="text-white drop-shadow-md" />
                    </motion.div>
                    <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-background border-4 border-secondary flex items-center justify-center text-sm font-black text-foreground shadow-sm">
                      {item.step}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r uppercase tracking-wider mb-4" style={{ backgroundImage: "linear-gradient(to right, var(--seafoam), white)" }}>
                    {item.subtitle}
                  </p>
                  <p className="text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

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
