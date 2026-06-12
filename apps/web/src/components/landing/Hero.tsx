import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "./HeroDemo";

export function Hero() {
  return (
    <section className="relative min-h-screen hero-gradient pt-16 md:pt-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-primary-foreground leading-[1.1] mb-6 animate-fade-up animation-delay-200">
              Your Gig.
              <br />
              Your Terms.
              <br />
              <span className="text-gradient">Your Credibility.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up animation-delay-400">
              Spot Payment. Verified Workers. No middlemen. India's first secure 
              daily gig marketplace with guaranteed fair pay and instant payouts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up animation-delay-600">
              <Button variant="hero" size="xl" asChild>
                <Link to="/worker/signup">
                  Start Working Today
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
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
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-seafoam/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-success/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
