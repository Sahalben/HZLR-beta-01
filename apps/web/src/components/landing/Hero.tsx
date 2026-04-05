import { ArrowRight, Shield, Banknote, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "./HeroDemo";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20
    }
  }
};

export function Hero() {
  return (
    <section className="relative min-h-screen hero-gradient pt-16 md:pt-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div 
             className="text-center lg:text-left"
             variants={containerVariants}
             initial="hidden"
             animate="show"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 mb-6 backdrop-blur-md hover:bg-primary-foreground/10 transition-colors cursor-default">
              <Shield size={16} className="text-success" />
              <span className="text-sm font-medium text-primary-foreground/80 tracking-wide uppercase">
                Triple Guarantee Protection
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-primary-foreground leading-[1.05] tracking-tight mb-6"
            >
              Your Gig.
              <br />
              Your Terms.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-seafoam via-white to-primary-foreground">Your Credibility.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-primary-foreground/60 max-w-xl mx-auto lg:mx-0 mb-8 font-light leading-relaxed">
              Spot Payment. Verified Workers. No middlemen. India's first secure 
              daily gig marketplace with guaranteed fair pay and instant payouts.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="shadow-2xl shadow-seafoam/20 backdrop-blur-sm transition-transform hover:scale-105" asChild>
                <Link to="/worker/signup">
                  Start Working Today
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" className="backdrop-blur-sm border-white/10 hover:bg-white/5 transition-transform hover:scale-105" asChild>
                <Link to="/employer/signup">
                  Hire Verified Talent
                </Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10">
              <div className="flex items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
                <Banknote size={16} className="text-success/80" />
                <span className="text-xs uppercase tracking-widest font-semibold">Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
                <Shield size={16} className="text-info/80" />
                <span className="text-xs uppercase tracking-widest font-semibold">Aadhaar Verified</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
                <Award size={16} className="text-warning/80" />
                <span className="text-xs uppercase tracking-widest font-semibold">Digital Resume</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Demo */}
          <motion.div 
             initial={{ opacity: 0, x: 50, filter: "blur(20px)" }}
             animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
             transition={{ duration: 1, type: "spring", stiffness: 50, delay: 0.6 }}
             className="relative flex items-center justify-center"
          >
            <HeroDemo />
          </motion.div>
        </div>
      </div>

      {/* Extreme Vercel-style Blurs */}
      <motion.div 
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: 0.6, scale: 1 }}
         transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
         className="absolute top-1/4 right-[5%] w-[500px] h-[500px] bg-seafoam/10 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
         initial={{ opacity: 0, scale: 1.2 }}
         animate={{ opacity: 0.4, scale: 1 }}
         transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", delay: 1, ease: "easeInOut" }}
         className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-success/10 rounded-full blur-[120px] pointer-events-none" 
      />
    </section>
  );
}
