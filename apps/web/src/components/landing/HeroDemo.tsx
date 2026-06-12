import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Wallet, FileText, Users, Wifi, Battery } from "lucide-react";
import { IPhoneSimMockup } from "./IPhoneSimMockup";

const demoSteps = [
  {
    icon: Wallet,
    title: "Employer Prefunds",
    subtitle: "₹900 secured in escrow",
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#34d399",
  },
  {
    icon: Users,
    title: "Worker Applies",
    subtitle: "Verified profile matched",
    bg: "rgba(59, 130, 246, 0.15)",
    color: "#60a5fa",
  },
  {
    icon: MapPin,
    title: "Geo Check-in",
    subtitle: "Worker arrives on-site",
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#fbbf24",
  },
  {
    icon: CheckCircle2,
    title: "Employer Confirms",
    subtitle: "Work completed ✓",
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#34d399",
  },
  {
    icon: Wallet,
    title: "Instant Payout",
    subtitle: "₹900 → Worker wallet",
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#34d399",
  },
  {
    icon: FileText,
    title: "Resume Updated",
    subtitle: "Digital credential added",
    bg: "rgba(168, 85, 247, 0.15)",
    color: "#c084fc",
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
    <div className="relative w-full max-w-[310px] lg:max-w-[280px] xl:max-w-[300px] mx-auto">
      <IPhoneSimMockup variant="iPhone 17 Pro" className="w-full">
        {/* iOS Screen Content */}
        <div 
          className="w-full h-full bg-[#031510] text-white flex flex-col justify-between relative overflow-hidden"
          style={{
            paddingTop: "22cqw",
            paddingBottom: "8cqw",
            paddingLeft: "3cqw",
            paddingRight: "3cqw"
          }}
        >
          {/* iOS Status Bar */}
          <span 
            className="absolute text-white/90 z-10" 
            style={{ 
              left: "6cqw", 
              top: "7.5cqw", 
              fontSize: "2.8cqw", 
              fontWeight: 600 
            }}
          >
            9:41
          </span>
          <div 
            className="absolute flex items-center text-white/90 z-10" 
            style={{ 
              right: "6cqw", 
              top: "8cqw", 
              gap: "1cqw" 
            }}
          >
            <Wifi style={{ width: "3.2cqw", height: "3.2cqw" }} className="stroke-[2.5]" />
            <Battery style={{ width: "4cqw", height: "2.8cqw" }} className="stroke-[2.5]" />
          </div>

          {/* HZLR Internal Header */}
          <div className="text-center">
            <span 
              className="font-black tracking-widest text-emerald-400" 
              style={{ fontSize: "3.2cqw" }}
            >
              HZLR.
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Progress Dots */}
            <div className="flex" style={{ gap: "1.5cqw", marginBottom: "6cqw" }}>
              {demoSteps.map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-full transition-all duration-300"
                  style={{
                    height: "1.2cqw",
                    width: idx === currentStep ? "4cqw" : "1.2cqw",
                    backgroundColor: idx === currentStep 
                      ? "#34d399" 
                      : idx < currentStep 
                      ? "rgba(52, 211, 153, 0.6)" 
                      : "rgba(255, 255, 255, 0.1)"
                  }}
                />
              ))}
            </div>

            {/* Step Card */}
            <div
              className={`w-full bg-white/5 border border-white/10 backdrop-blur-md text-center transition-all duration-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{
                borderRadius: "3.5cqw",
                padding: "4cqw"
              }}
            >
              <div
                className="flex items-center justify-center mx-auto"
                style={{
                  width: "11cqw",
                  height: "11cqw",
                  borderRadius: "2.5cqw",
                  marginBottom: "2.5cqw",
                  backgroundColor: step.bg
                }}
              >
                <Icon style={{ width: "5.5cqw", height: "5.5cqw", color: step.color }} />
              </div>
              <h4 
                className="font-bold text-white leading-tight" 
                style={{ fontSize: "3.4cqw", marginBottom: "0.8cqw" }}
              >
                {step.title}
              </h4>
              <p 
                className="text-white/60 leading-normal" 
                style={{ fontSize: "2.5cqw" }}
              >
                {step.subtitle}
              </p>
            </div>

            {/* Step Counter */}
            <div 
              className="font-medium text-white/40" 
              style={{ marginTop: "6cqw", fontSize: "2.4cqw" }}
            >
              Step {currentStep + 1} of {demoSteps.length}
            </div>
          </div>

        </div>
      </IPhoneSimMockup>

      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-seafoam/20 via-transparent to-[hsl(var(--status-success)/0.2)] rounded-[3.5rem] blur-2xl -z-10 animate-pulse-soft" />
    </div>
  );
}
