import { Link } from "react-router-dom";
import { ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CTASection() {
  return <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative bg-primary rounded-3xl p-8 md:p-16 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-seafoam/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to transform how you work?
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0">
                Join thousands of workers earning on their terms and employers hiring verified talent instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup">
                    Get Started Free
                    <ArrowRight size={20} />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-3 shadow-2xl">
                  <div className="bg-gradient-to-br from-mint to-mint-dark rounded-[2.5rem] h-full flex flex-col items-center justify-center p-6">
                    <Smartphone size={48} className="text-forest mb-4" />
                    <p className="text-center text-forest font-bold text-lg">
                      Mobile-first experience
                    </p>
                    <p className="text-center text-muted-foreground text-sm mt-2">
                      Apply, track, and get paid from your phone
                    </p>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-lg animate-float">
                  <p className="text-xs font-semibold text-forest">₹900 received!</p>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-lg animate-float animation-delay-400">
                  <p className="text-xs font-semibold text-emerald-600">✓ Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}