import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Wallet Illustration for Workers
const WalletVisual = () => (
  <div className="relative w-36 h-28 mx-auto my-6 flex items-center justify-center">
    <svg className="w-full h-full" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="80" cy="110" rx="60" ry="8" fill="black" fillOpacity="0.3" />
      {/* Wallet back */}
      <rect x="20" y="30" width="120" height="70" rx="12" fill="url(#walletGrad)" />
      {/* Card slipping out */}
      <motion.rect
        x="35"
        y="15"
        width="90"
        height="55"
        rx="8"
        fill="url(#cardGrad)"
        initial={{ y: 10 }}
        animate={{ y: [10, 0, 10] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      {/* Card chip details */}
      <rect x="45" y="25" width="16" height="12" rx="2" fill="#34D399" fillOpacity="0.4" />
      {/* Wallet front */}
      <path d="M20 50C20 44.4772 24.4772 40 30 40H130C135.523 40 140 44.4772 140 50V90C140 95.5228 135.523 100 130 100H30C24.4772 100 20 95.5228 20 90V50Z" fill="url(#walletFrontGrad)" stroke="#1F2937" strokeWidth="1" />
      {/* Flap */}
      <path d="M110 55H140V85H110C101.716 85 95 78.2843 95 70C95 61.7157 101.716 55 110 55Z" fill="#10B981" />
      <circle cx="112" cy="70" r="4" fill="#34D399" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="walletGrad" x1="20" y1="30" x2="140" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064E3B" />
          <stop offset="1" stopColor="#022C22" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="35" y1="15" x2="125" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="walletFrontGrad" x1="20" y1="40" x2="140" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#047857" />
          <stop offset="1" stopColor="#064E3B" stopOpacity="0.95" />
        </linearGradient>
      </defs>
    </svg>
    {/* Floating coin 1 */}
    <motion.div
      className="absolute top-2 left-4 w-6 h-6 bg-amber-500 rounded-full border-2 border-amber-300 flex items-center justify-center font-bold text-[10px] text-amber-950 shadow-md"
      animate={{ y: [0, -12, 0], rotate: [0, 360, 0] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.2 }}
    >
      ₹
    </motion.div>
    {/* Floating coin 2 */}
    <motion.div
      className="absolute bottom-6 right-6 w-5 h-5 bg-amber-500 rounded-full border border-amber-300 flex items-center justify-center font-bold text-[9px] text-amber-950 shadow-md"
      animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.8 }}
    >
      ₹
    </motion.div>
  </div>
);

// Escrow / Verification Visual for Employers
const EscrowVisual = () => (
  <div className="relative w-36 h-28 mx-auto my-6 flex items-center justify-center">
    <svg className="w-full h-full" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="80" cy="110" rx="60" ry="8" fill="black" fillOpacity="0.3" />
      {/* Shield outline / base */}
      <motion.path
        d="M80 15L125 35V75C125 96.5416 105.772 109.117 80 115C54.2282 109.117 35 96.5416 35 75V35L80 15Z"
        fill="url(#shieldGrad)"
        stroke="#10B981"
        strokeWidth="2"
        initial={{ scale: 0.95 }}
        animate={{ scale: [0.95, 1, 0.95] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      {/* Inside padlock body */}
      <rect x="65" y="52" width="30" height="22" rx="4" fill="url(#lockBodyGrad)" />
      {/* Padlock shackle */}
      <path d="M71 52V45C71 40.0294 75.0294 36 80 36C84.9706 36 89 40.0294 89 45V52" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" />
      {/* Shield glowing nodes */}
      <circle cx="80" cy="62" r="3" fill="#047857" />
      
      {/* Circular network node 1 */}
      <motion.circle cx="48" cy="48" r="4" fill="#34D399" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} />
      {/* Circular network node 2 */}
      <motion.circle cx="112" cy="48" r="4" fill="#34D399" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut" }} />
      {/* Circular network node 3 */}
      <motion.circle cx="80" cy="98" r="4" fill="#34D399" animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} />
      
      {/* Network lines */}
      <line x1="48" y1="48" x2="65" y2="58" stroke="#34D399" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
      <line x1="112" y1="48" x2="95" y2="58" stroke="#34D399" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
      <line x1="80" y1="98" x2="80" y2="74" stroke="#34D399" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />

      {/* Gradients */}
      <defs>
        <linearGradient id="shieldGrad" x1="35" y1="15" x2="125" y2="115" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064E3B" stopOpacity="0.8" />
          <stop offset="1" stopColor="#022C22" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="lockBodyGrad" x1="65" y1="52" x2="95" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
    {/* Floating Check Badge */}
    <motion.div
      className="absolute -top-1 right-2 w-7 h-7 bg-emerald-500 rounded-full border-2 border-emerald-300 flex items-center justify-center shadow-lg"
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
    >
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </motion.div>
  </div>
);

interface PricingCardProps {
  children: React.ReactNode;
  highlight?: boolean;
  delay?: number;
  badgeText?: string;
}

// Interactive Apple-Style Tilt/Spotlight Pricing Card
function PricingCard({ children, highlight = false, delay = 0, badgeText }: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className={cn(
        "relative rounded-3xl p-8 overflow-hidden transition-all duration-300 border backdrop-blur-xl flex flex-col justify-between h-full group",
        highlight 
          ? "bg-slate-950/80 border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]" 
          : "bg-slate-950/40 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
      )}
    >
      {/* Spotlight glow effect */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(52, 211, 153, 0.12), transparent 80%)`,
          }}
        />
      )}

      {badgeText && (
        <div className={cn(
          "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
          highlight ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/80"
        )}>
          {badgeText}
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full justify-between">
        {children}
      </div>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 md:py-28 bg-primary text-primary-foreground overflow-hidden">
      {/* Background Decorative Glowing Blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-seafoam/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary-foreground/60 mb-4 tracking-wide uppercase">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Transparent. Fair. Always.
          </h2>
          <p className="text-lg text-primary-foreground/60">
            Workers pay nothing. Employers pay only for successful hires.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Worker Card */}
          <PricingCard badgeText="Free Forever" delay={0.1}>
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wider">For Workers</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">₹0</span>
                  <span className="text-white/60">/always</span>
                </div>
              </div>
              
              {/* Graphic Visual */}
              <WalletVisual />

              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited job applications",
                  "Digital resume builder",
                  "Instant wallet payouts",
                  "Backup queue access",
                  "Reliability score tracking",
                  "In-app messaging",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button variant="default" size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-0 py-6 text-base" asChild>
              <Link to="/worker/signup" className="flex items-center justify-center gap-2 group/btn">
                Start Working
                <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </PricingCard>

          {/* Employer Card */}
          <PricingCard highlight badgeText="Pay Per Hire" delay={0.25}>
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wider">For Employers</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">Custom</span>
                </div>
                <p className="text-sm text-white/50 mt-2">Based on role & volume</p>
              </div>

              {/* Graphic Visual */}
              <EscrowVisual />

              <ul className="space-y-4 mb-8">
                {[
                  "Verified worker pool",
                  "Reliability score access",
                  "Prefund & escrow system",
                  "Anti-flake backup queue",
                  "Bulk hiring tools",
                  "Priority support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="hero" size="lg" className="w-full bg-white hover:bg-white/90 text-primary border-0 py-6 text-base font-semibold" asChild>
              <Link to="/employer/signup" className="flex items-center justify-center gap-2 group/btn">
                Get Started
                <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </PricingCard>

        </div>
      </div>
    </section>
  );
}
