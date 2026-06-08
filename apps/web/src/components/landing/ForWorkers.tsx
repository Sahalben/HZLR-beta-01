import { Link } from "react-router-dom";
import { ArrowRight, Wallet, Shield, TrendingUp, Clock, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Bento card primitives ────────────────────────────────────────────────────

interface BentoCardProps {
  className?: string;
  children: React.ReactNode;
}

function BentoCard({ className, children }: BentoCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border border-border/60 bg-background overflow-hidden",
        "transition-all duration-300 hover:border-primary/30 hover:shadow-lg",
        className,
      )}
    >
      <div className="h-full">{children}</div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="inline-flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-primary/8 border border-primary/12">
      <span className="text-2xl font-black text-primary leading-none">{value}</span>
      <span className="text-[11px] font-medium text-muted-foreground mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  );
}

// ─── Timeline step (mini-process inside hero card) ────────────────────────────
function TimelineStep({
  n,
  label,
  sub,
}: {
  n: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[11px] font-bold text-primary-foreground">{n}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
        <p className="text-[12px] text-muted-foreground leading-snug">{sub}</p>
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function ForWorkers() {
  return (
    <section id="workers" className="py-20 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            For Workers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your skills deserve{" "}
            <span className="text-primary">fair pay</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Stop chasing payments. Earn on your terms, build your reputation.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        {/*
          Apple-style layout — asymmetric, breathing whitespace:
          Row 1: [Hero-tall (col 1-2)] [Instant Payouts (col 3)]
          Row 2: [Work When You Want] [Map/Local] [Credibility]
          Row 3: [Full-width CTA strip]
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-auto gap-4">

          {/* ── [1,1] HERO — How it flows ── */}
          <BentoCard
            className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between min-h-[340px]"
            glowColor="hsl(158 55% 30%)"
          >
            {/* Top: icon + title */}
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                Build Your Digital Resume
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Every completed gig writes to your permanent, verified work history —
                visible to every employer on HZLR.
              </p>
            </div>

            {/* Mid: mini timeline */}
            <div className="mt-8 space-y-4">
              <TimelineStep n="1" label="Complete a gig" sub="Geo-verified check-in + checkout" />
              <TimelineStep n="2" label="Earn a rating" sub="Reliability score updates instantly" />
              <TimelineStep n="3" label="Unlock better pay" sub="Top workers get priority offers" />
            </div>

            {/* Bottom: stats row */}
            <div className="flex flex-wrap gap-3 mt-8">
              <StatPill value="₹200–400" label="Avg hourly rate" />
              <StatPill value="94%" label="Fill rate" />
              <StatPill value="47" label="Avg gigs / month" />
            </div>
          </BentoCard>

          {/* ── [1,3] Instant Payouts ── */}
          <BentoCard
            className="p-7 flex flex-col justify-between min-h-[160px]"
            glowColor="hsl(142 60% 32%)"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Wallet size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Instant Payouts</h3>
              <p className="text-sm text-muted-foreground">
                Get paid the same day. Funds hit your HZLR wallet the moment the
                employer confirms checkout.
              </p>
            </div>
            {/* Visual accent */}
            <div className="mt-5 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-emerald-500/15">
                <div className="h-full w-[88%] rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-xs font-semibold text-emerald-600">Same-day</span>
            </div>
          </BentoCard>

          {/* ── [2,3] Guaranteed Fair Pay ── */}
          <BentoCard
            className="p-7 flex flex-col justify-between min-h-[160px]"
            glowColor="hsl(217 70% 45%)"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <Shield size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Guaranteed Fair Pay</h3>
              <p className="text-sm text-muted-foreground">
                Escrow protection ensures your earnings are locked before you even
                arrive on site.
              </p>
            </div>
            <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-xs font-semibold text-blue-600 w-fit">
              <Shield size={11} />
              Escrow Protected
            </div>
          </BentoCard>

          {/* ── [3,1] Work When You Want ── */}
          <BentoCard
            className="p-7 flex flex-col justify-between min-h-[160px]"
            glowColor="hsl(38 90% 48%)"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <Clock size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Work When You Want</h3>
              <p className="text-sm text-muted-foreground">
                No fixed shifts. Browse gigs by date and time — total scheduling freedom.
              </p>
            </div>
            {/* Mini calendar accent */}
            <div className="mt-5 flex gap-1.5">
              {["M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-6 rounded-md flex items-center justify-center text-[10px] font-semibold",
                    [0, 2, 4].includes(i)
                      ? "bg-amber-500/20 text-amber-600"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {d}
                </div>
              ))}
            </div>
          </BentoCard>

          {/* ── [3,2] Find Local Opportunities ── */}
          <BentoCard
            className="p-7 flex flex-col justify-between min-h-[160px]"
            glowColor="hsl(158 55% 35%)"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <MapPin size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Find Local Gigs</h3>
              <p className="text-sm text-muted-foreground">
                Distance-sorted listings with transparent pay and location details
                before you apply.
              </p>
            </div>
            {/* Pulse dot map accent */}
            <div className="mt-5 relative h-8 rounded-xl bg-primary/5 overflow-hidden flex items-center px-3 gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] text-muted-foreground">3 gigs within 2 km</span>
            </div>
          </BentoCard>

          {/* ── [3,3] Grow Your Credibility ── */}
          <BentoCard
            className="p-7 flex flex-col justify-between min-h-[160px]"
            glowColor="hsl(280 60% 50%)"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Award size={20} className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Grow Your Credibility</h3>
              <p className="text-sm text-muted-foreground">
                Your reliability score unlocks premium gigs and higher-paying positions.
              </p>
            </div>
            {/* Score bar */}
            <div className="mt-5">
              <div className="flex justify-between text-[11px] font-medium mb-1.5">
                <span className="text-muted-foreground">Reliability Score</span>
                <span className="text-purple-600 font-bold">94 / 100</span>
              </div>
              <div className="h-1.5 rounded-full bg-purple-500/15">
                <div className="h-full w-[94%] rounded-full bg-purple-500/70" />
              </div>
            </div>
          </BentoCard>

          {/* ── [4] Full-width CTA strip ── */}
          <BentoCard
            className="md:col-span-3 px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-10"
          >
            <div className="max-w-lg">
              <h3 className="text-xl font-bold text-foreground">
                Ready to start earning on your terms?
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Free to join. No commissions taken from your pay.
              </p>
            </div>
            <Button variant="default" size="lg" asChild className="flex-shrink-0 whitespace-nowrap">
              <Link to="/signup">
                Start Working Today
                <ArrowRight size={18} />
              </Link>
            </Button>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
