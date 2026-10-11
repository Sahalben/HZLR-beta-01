import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Wallet, FileText, Users } from "lucide-react";

const demoSteps = [
  {
    icon: Wallet,
    title: "Employer Prefunds",
    subtitle: "₹900 secured in escrow",
    colorClass: "text-[hsl(var(--status-success))]",
    bgClass: "bg-[hsl(var(--status-success)/0.15)]",
  },
  {
    icon: Users,
    title: "Worker Applies",
    subtitle: "Verified profile matched",
    colorClass: "text-[hsl(var(--status-info))]",
    bgClass: "bg-[hsl(var(--status-info)/0.15)]",
  },
  {
    icon: MapPin,
    title: "Geo Check-in",
    subtitle: "Worker arrives on-site",
    colorClass: "text-[hsl(var(--status-warning))]",
    bgClass: "bg-[hsl(var(--status-warning)/0.15)]",
  },
  {
    icon: CheckCircle2,
    title: "Employer Confirms",
    subtitle: "Work completed ✓",
    colorClass: "text-[hsl(var(--status-success))]",
    bgClass: "bg-[hsl(var(--status-success)/0.15)]",
  },
  {
    icon: Wallet,
    title: "Instant Payout",
    subtitle: "₹900 → Worker wallet",
    colorClass: "text-[hsl(var(--status-success))]",
    bgClass: "bg-[hsl(var(--status-success)/0.15)]",
  },
  {
    icon: FileText,
    title: "Resume Updated",
    subtitle: "Digital credential added",
    colorClass: "text-[hsl(var(--status-pending))]",
    bgClass: "bg-[hsl(var(--status-pending)/0.15)]",
  },
];

export function HeroDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
        setIsVisible(true);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const step = demoSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="relative w-full max-w-[280px] lg:max-w-[250px] xl:max-w-[270px] mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-[hsl(var(--surface-darker))] rounded-[2.5rem] p-2.5 shadow-2xl">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[hsl(var(--surface-darker))] rounded-b-xl" />
        
        {/* Screen */}
        <div className="bg-[hsl(var(--surface-lighter))] rounded-[2.1rem] overflow-hidden aspect-[9/19]">
          {/* Status Bar */}
          <div className="h-10 bg-primary flex items-center justify-center">
            <span className="text-[10px] font-semibold text-primary-foreground/80">HZLR.</span>
          </div>

          {/* Demo Content */}
          <div className="p-4 flex flex-col items-center justify-center h-[calc(100%-2.5rem)]">
            {/* Progress Dots */}
            <div className="flex gap-1.5 mb-6">
              {demoSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? "bg-primary w-5"
                      : idx < currentStep
                      ? "bg-primary/60 w-1.5"
                      : "bg-border w-1.5"
                  }`}
                />
              ))}
            </div>

            {/* Step Card */}
            <div
              className={`glass-card p-5 w-full text-center transition-all duration-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${step.bgClass} flex items-center justify-center mx-auto mb-3`}
              >
                <Icon size={24} className={step.colorClass} />
              </div>
              <h4 className="font-bold text-base text-foreground mb-1">{step.title}</h4>
              <p className="text-xs text-muted-foreground">{step.subtitle}</p>
            </div>

            {/* Step Counter */}
            <div className="mt-6 text-[10px] text-muted-foreground font-medium">
              Step {currentStep + 1} of {demoSteps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-seafoam/20 via-transparent to-[hsl(var(--status-success)/0.2)] rounded-[3.5rem] blur-2xl -z-10 animate-pulse-soft" />
    </div>
  );
}
