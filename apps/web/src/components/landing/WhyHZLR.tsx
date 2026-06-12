import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Lenis from "lenis";

// ─── Inline SVG Icons (Apple/Stripe style, no generic Lucide colors) ───────────

const IconEscrow = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <rect x="3" y="9" width="26" height="18" rx="4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 15h26" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="16" cy="22" r="2.4" fill="currentColor" />
    <path d="M8 9V7a8 8 0 0 1 16 0v2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const IconVerify = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <path d="M16 3L4 8v8c0 7 6 11 12 13 6-2 12-6 12-13V8L16 3z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M11 16l3.5 3.5L21 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSafety = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.6" />
    <path d="M16 10v7M16 20.5v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconStep1 = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.4" opacity=".3" />
    <path d="M20 10c5.5 0 10 4.5 10 10s-4.5 10-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 18l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="12" r="2" fill="currentColor" />
  </svg>
);

const IconStep2 = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <rect x="8" y="12" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 17h24" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="14" cy="24" r="2" fill="currentColor" opacity=".6" />
    <rect x="19" y="22.5" width="9" height="3" rx="1.5" fill="currentColor" opacity=".4" />
  </svg>
);

const IconStep3 = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <path d="M10 30L20 10l10 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 24h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  { label: "Aadhaar Verified Workers" },
  { label: "Escrow-Protected Pay" },
  { label: "14,000+ Matches Weekly" },
  { label: "4.8 Min Avg Match Time" },
  { label: "Zero Commission" },
  { label: "Geo-Verified Check-in" },
  { label: "2-Hour SLA" },
  { label: "Instant UPI Payout" },
];

const GUARANTEES = [
  {
    Icon: IconEscrow,
    badge: "Escrow Protected",
    title: "Guaranteed Fair Pay",
    description:
      "Every gig is pre-funded before you start. Escrow holds the amount until completion — then it's yours instantly.",
    accentBg: "hsl(158 55% 40% / 0.08)",
    accentText: "text-emerald-500 dark:text-emerald-400",
    accentBorder: "border-emerald-500/15",
  },
  {
    Icon: IconVerify,
    badge: "Aadhaar Verified",
    title: "Guaranteed Credibility",
    description:
      "Government-grade identity verification powers every profile. Build a digital resume with every gig you complete.",
    accentBg: "hsl(214 80% 56% / 0.08)",
    accentText: "text-blue-500 dark:text-blue-400",
    accentBorder: "border-blue-500/15",
  },
  {
    Icon: IconSafety,
    badge: "2-Hour SLA",
    title: "Guaranteed Safety",
    description:
      "Monitored in-app communication, one-click dispute escalation, and a backup queue that ensures no missed opportunity.",
    accentBg: "hsl(38 85% 52% / 0.08)",
    accentText: "text-amber-500 dark:text-amber-400",
    accentBorder: "border-amber-500/15",
  },
] as const;

const STEPS = [
  {
    num: "01",
    Icon: IconStep1,
    title: "Verify",
    sub: "Build your trusted profile",
    description:
      "Complete Aadhaar e-KYC, upload a profile photo, and earn grooming certifications. Your identity is your resume.",
    accentText: "text-blue-500 dark:text-blue-400",
  },
  {
    num: "02",
    Icon: IconStep2,
    title: "Book & Earn",
    sub: "Gig, check-in, get paid",
    description:
      "Browse pre-funded gigs, geo-verify your arrival, complete the work, and receive instant UPI payout.",
    accentText: "text-emerald-500 dark:text-emerald-400",
  },
  {
    num: "03",
    Icon: IconStep3,
    title: "Grow",
    sub: "Build your career",
    description:
      "Reliability scores rise with every gig. Higher ratings unlock premium shifts, better pay, and new opportunities.",
    accentText: "text-amber-500 dark:text-amber-400",
  },
] as const;

// ─── Lenis smooth scroll hook ──────────────────────────────────────────────────

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ─── Marquee ───────────────────────────────────────────────────────────────────

function MarqueeTicker() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden py-4 border-y border-border/40 select-none">
      <div className="absolute left-0 top-0 h-full w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest shrink-0"
          >
            <span className="text-primary/30 text-[7px]">◆</span>
            {item.label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Tilt card (Apple-feel 3D hover) ──────────────────────────────────────────

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "";
    el.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

// ─── Count-up number ──────────────────────────────────────────────────────────

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      if (ref.current) ref.current.textContent = `${Math.round(p * p * to)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Sub-section divider label ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="flex items-center gap-3 mb-10"
    >
      <span className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest whitespace-nowrap">
        {children}
      </span>
      <span className="flex-1 h-px bg-border/40" />
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function WhyHZLR() {
  useLenis();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const headerY = useSpring(
    useTransform(scrollYProgress, [0, 0.35], ["28px", "-8px"]),
    { stiffness: 80, damping: 22 }
  );
  const headerOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);

  // Destructure icons for JSX — bracket-access is not valid in JSX
  const HeroIcon = GUARANTEES[0].Icon;
  const Card2Icon = GUARANTEES[1].Icon;
  const Card3Icon = GUARANTEES[2].Icon;
  const Step1Icon = STEPS[0].Icon;
  const Step2Icon = STEPS[1].Icon;
  const Step3Icon = STEPS[2].Icon;

  const stepIcons = [Step1Icon, Step2Icon, Step3Icon] as const;

  return (
    <section ref={sectionRef} id="why-hzlr" className="dark relative bg-background overflow-hidden">
      {/* Bottom bleed — dissolves into ForWorkers */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none z-10" />

      {/* ── Parallax background ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[15%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[110px]" />
        <div className="absolute bottom-[8%] right-[8%] w-[420px] h-[420px] rounded-full bg-blue-500/[0.03] blur-[90px]" />
        <div className="absolute top-[42%] right-[28%] w-[320px] h-[320px] rounded-full bg-amber-400/[0.025] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(158 40% 30% / 0.2) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_35%,black_88%)]" />
      </motion.div>

      {/* ── Header ── */}
      <div className="pt-24 md:pt-32 pb-14 md:pb-16 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/12 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                Why HZLR · Simple Process
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-5 tracking-tight leading-[1.08]">
              Built for trust.<br />
              <span className="text-primary">Designed for speed.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed">
              Three promises that protect everyone. Three steps that take you from signup to paid — with nothing in between.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Marquee ── */}
      <MarqueeTicker />

      {/* ── Triple Guarantee bento ── */}
      <div className="py-20 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <SectionLabel>The Triple Guarantee</SectionLabel>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Hero card — col-span-3 */}
            <TiltCard className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(
                  "relative h-full min-h-[300px] rounded-3xl border p-8 md:p-10 overflow-hidden group cursor-default",
                  "bg-card/60 backdrop-blur-sm",
                  GUARANTEES[0].accentBorder
                )}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${GUARANTEES[0].accentBg} 0%, transparent 70%)` }}
                />
                <span className="absolute bottom-6 right-8 text-[96px] font-black leading-none text-muted-foreground/[0.04] select-none">
                  01
                </span>

                <div className="relative z-10 flex flex-col h-full">
                  <div
                    className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", GUARANTEES[0].accentText)}
                    style={{ background: GUARANTEES[0].accentBg }}
                  >
                    <HeroIcon />
                  </div>
                  <span className={cn("text-[11px] font-bold uppercase tracking-widest mb-3", GUARANTEES[0].accentText)}>
                    {GUARANTEES[0].badge}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4 leading-tight">
                    {GUARANTEES[0].title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-1 max-w-md">
                    {GUARANTEES[0].description}
                  </p>

                  <div className="mt-8 pt-6 border-t border-border/40 flex items-center gap-6">
                    <div>
                      <p className="text-2xl font-black text-foreground"><CountUp to={98} suffix="%" /></p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Payout success rate</p>
                    </div>
                    <div className="w-px h-8 bg-border/40" />
                    <div>
                      <p className="text-2xl font-black text-foreground"><CountUp to={14} suffix="k+" /></p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Gigs paid weekly</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TiltCard>

            {/* Right column — col-span-2, two stacked cards */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Card 2 */}
              <TiltCard className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={cn(
                    "relative rounded-3xl border p-6 overflow-hidden group cursor-default h-full",
                    "bg-card/60 backdrop-blur-sm",
                    GUARANTEES[1].accentBorder
                  )}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 30% 30%, ${GUARANTEES[1].accentBg} 0%, transparent 70%)` }}
                  />
                  <span className="absolute bottom-4 right-5 text-[60px] font-black leading-none text-muted-foreground/[0.04] select-none">
                    02
                  </span>
                  <div className="relative z-10">
                    <div
                      className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", GUARANTEES[1].accentText)}
                      style={{ background: GUARANTEES[1].accentBg }}
                    >
                      <Card2Icon />
                    </div>
                    <span className={cn("text-[11px] font-bold uppercase tracking-widest mb-2 block", GUARANTEES[1].accentText)}>
                      {GUARANTEES[1].badge}
                    </span>
                    <h3 className="text-lg font-black text-foreground mb-2 leading-tight">{GUARANTEES[1].title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{GUARANTEES[1].description}</p>
                  </div>
                </motion.div>
              </TiltCard>

              {/* Card 3 */}
              <TiltCard className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={cn(
                    "relative rounded-3xl border p-6 overflow-hidden group cursor-default h-full",
                    "bg-card/60 backdrop-blur-sm",
                    GUARANTEES[2].accentBorder
                  )}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 30% 30%, ${GUARANTEES[2].accentBg} 0%, transparent 70%)` }}
                  />
                  <span className="absolute bottom-4 right-5 text-[60px] font-black leading-none text-muted-foreground/[0.04] select-none">
                    03
                  </span>
                  <div className="relative z-10">
                    <div
                      className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", GUARANTEES[2].accentText)}
                      style={{ background: GUARANTEES[2].accentBg }}
                    >
                      <Card3Icon />
                    </div>
                    <span className={cn("text-[11px] font-bold uppercase tracking-widest mb-2 block", GUARANTEES[2].accentText)}>
                      {GUARANTEES[2].badge}
                    </span>
                    <h3 className="text-lg font-black text-foreground mb-2 leading-tight">{GUARANTEES[2].title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{GUARANTEES[2].description}</p>
                  </div>
                </motion.div>
              </TiltCard>

            </div>
          </div>
        </div>
      </div>

      {/* ── Process steps ── */}
      <div className="pb-24 md:pb-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <SectionLabel>Simple Process</SectionLabel>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[calc(33.33%+20px)] right-[calc(33.33%+20px)] h-px bg-gradient-to-r from-border/50 via-primary/15 to-border/50" />

            {STEPS.map((step, i) => {
              const StepIcon = stepIcons[i];
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.62, delay: i * 0.14, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <TiltCard>
                    <div className="relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-7 group cursor-default overflow-hidden h-full hover:border-border/80 transition-colors duration-300">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl bg-gradient-to-br from-primary/[0.025] to-transparent pointer-events-none" />

                      <div className="flex items-start justify-between mb-6">
                        <div
                          className={cn("p-2.5 rounded-2xl", step.accentText)}
                          style={{ background: "hsl(158 40% 40% / 0.07)" }}
                        >
                          <StepIcon />
                        </div>
                        <span className="text-[11px] font-black text-muted-foreground/25 tabular-nums">
                          {step.num}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-foreground mb-1 leading-tight">{step.title}</h3>
                      <p className={cn("text-[11px] font-bold uppercase tracking-wider mb-3", step.accentText)}>
                        {step.sub}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
          >
            <Button asChild size="lg" className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/15 group">
              <Link to="/worker/signup">
                Start Working Today
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-8 h-12 font-bold">
              <Link to="/employer/signup">Hire Workers</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
