import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "./HeroDemo";
import { SpectraNoise } from "./SpectraNoise";

export function Hero() {
  return (
    <section className="relative lg:min-h-[640px] xl:min-h-[700px] min-h-[85vh] hero-gradient pt-20 md:pt-24 overflow-hidden flex items-center">
      {/* Dynamic Spectra Noise Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen z-0">
        <SpectraNoise 
          speed={0.08} 
          noiseIntensity={0.015} 
          warpAmount={0.3} 
          resolutionScale={0.5} 
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-primary-foreground leading-[1.1] mb-5 animate-fade-up animation-delay-200">
              Your Gig.
              <br />
              Your Terms.
              <br />
              <span className="text-gradient">Your Credibility.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-primary-foreground/70 max-w-xl mx-auto lg:mx-0 mb-6 animate-fade-up animation-delay-400">
              Spot Payment. Verified Workers. No middlemen. India's first secure 
              daily gig marketplace with guaranteed fair pay and instant payouts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up animation-delay-600">
              <Button variant="hero" size="lg" asChild>
                <Link to="/worker/signup">
                  Start Working Today
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/employer/signup">
                  Hire Verified Talent
                </Link>
              </Button>
            </div>


          </div>

          {/* Right Column - Demo */}
          <div className="relative flex items-center justify-center animate-fade-up animation-delay-400">
            <HeroDemo />
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-seafoam/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-success/10 rounded-full blur-[100px] pointer-events-none z-0" />
    </section>
  );
}
