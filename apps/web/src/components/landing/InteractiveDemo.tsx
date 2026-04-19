import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Users, Lock, ArrowRight, Loader2, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DemoState = "idle" | "searching" | "results";
type Mode = "hire" | "work";

export function InteractiveDemo() {
  const [mode, setMode] = useState<Mode>("hire");
  const [state, setState] = useState<DemoState>("idle");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // Simulated metrics based on mode
  const metrics = mode === "hire" 
     ? { count: 184, label: "Verified Workers Available", match: "workers matched in your radius" }
     : { count: 42, label: "Active Pre-Funded Gigs", match: "plumbing & general gigs found" };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !location) return;

    setState("searching");
    // Simulate network delay for psychology "Endowed Progress"
    setTimeout(() => {
      setState("results");
    }, 1200);
  };

  // Reset state on mode change
  useEffect(() => {
     setState("idle");
     setCategory("");
     setLocation("");
  }, [mode]);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-background">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[150px] rounded-full opacity-30 pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 max-w-5xl">
        
        <div className="text-center mb-10 animate-fade-up">
           <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
              Test The Network
           </h2>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See live availability in your area without creating an account.
           </p>
        </div>

        {/* Master Card Frame */}
        <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-4 md:p-8 overflow-hidden animate-fade-up animation-delay-200">
           
           {/* Header Pivot Pill */}
           <div className="flex justify-center mb-8">
              <div className="inline-flex p-1 bg-secondary/50 rounded-full border border-white/5">
                 <button
                    onClick={() => setMode("hire")}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all",
                      mode === "hire" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                    )}
                 >
                    <Users size={16} /> Find Workers
                 </button>
                 <button
                    onClick={() => setMode("work")}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all",
                      mode === "work" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                    )}
                 >
                    <Briefcase size={16} /> Find Gigs
                 </button>
              </div>
           </div>

           {/* Search Form */}
           <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mb-10">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                 <Input 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   placeholder={mode === "hire" ? "e.g., Electrician, Warehouse, Waiter" : "e.g., Barista, Delivery, Event Staff"}
                   className="pl-12 h-14 bg-background/50 border-white/10 text-lg focus-visible:ring-primary rounded-xl"
                   required
                 />
              </div>
              <div className="relative flex-1">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                 <Input 
                   value={location}
                   onChange={(e) => setLocation(e.target.value)}
                   placeholder="Enter your location or ZIP"
                   className="pl-12 h-14 bg-background/50 border-white/10 text-lg focus-visible:ring-primary rounded-xl"
                   required
                 />
              </div>
              <Button type="submit" disabled={state === "searching"} className="h-14 px-8 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 md:w-auto w-full">
                 {state === "searching" ? <Loader2 className="animate-spin text-primary-foreground" /> : "Search Live"}
              </Button>
           </form>

           {/* Results Area */}
           <div className="relative min-h-[300px] border-t border-white/5 pt-8">
              
              {state === "idle" && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 opacity-60">
                    <Search size={64} className="mb-4 text-primary/20" />
                    <p className="font-medium text-lg">Enter details above to simulate the network</p>
                 </div>
              )}

              {state === "searching" && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative">
                       <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                       <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                    </div>
                    <p className="mt-6 text-foreground font-medium animate-pulse">Running geo-spatial matching...</p>
                 </div>
              )}

              {state === "results" && (
                 <div className="animate-fade-in relative w-full h-[450px] rounded-3xl overflow-hidden bg-black/60 border border-white/10 shadow-inner group">
                    
                    {/* Geographic Grid Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    
                    {/* Radar Concentric Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/20 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/30 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-primary/50 rounded-full bg-primary/5"></div>
                    
                    {/* Radar Center Ping */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),1)] animate-pulse"></div>

                    {/* Radar Sweeper Element */}
                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] origin-top-left border-l-2 border-primary/80 bg-gradient-to-r from-primary/30 to-transparent animate-[spin_4s_linear_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>

                    {/* Dynamic Map Pins & Avatars */}
                    {mode === "hire" ? (
                       <>
                         <div className="absolute top-[25%] left-[30%] animate-bounce delay-100"><img src="https://i.pravatar.cc/100?img=11" className="w-10 h-10 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" alt="Worker"/></div>
                         <div className="absolute top-[60%] left-[70%] animate-bounce delay-300"><img src="https://i.pravatar.cc/100?img=33" className="w-12 h-12 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" alt="Worker"/></div>
                         <div className="absolute top-[20%] left-[75%] animate-bounce delay-500"><img src="https://i.pravatar.cc/100?img=47" className="w-8 h-8 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" alt="Worker"/></div>
                         <div className="absolute top-[75%] left-[25%] animate-bounce delay-700"><img src="https://i.pravatar.cc/100?img=12" className="w-11 h-11 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" alt="Worker"/></div>
                         <div className="absolute top-[45%] left-[85%] animate-bounce delay-200"><img src="https://i.pravatar.cc/100?img=68" className="w-9 h-9 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" alt="Worker"/></div>
                       </>
                    ) : (
                       <>
                         <div className="absolute top-[30%] left-[40%] animate-pulse"><MapPin className="text-emerald-400 fill-emerald-400/20 h-10 w-10 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" /></div>
                         <div className="absolute top-[60%] left-[70%] animate-[pulse_2s_ease-in-out_infinite]"><MapPin className="text-emerald-400 fill-emerald-400/20 h-8 w-8 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" /></div>
                         <div className="absolute top-[20%] left-[80%] animate-[pulse_3s_ease-in-out_infinite]"><MapPin className="text-emerald-400 fill-emerald-400/20 h-12 w-12 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" /></div>
                         <div className="absolute top-[70%] left-[20%] animate-[pulse_1.5s_ease-in-out_infinite]"><MapPin className="text-emerald-400 fill-emerald-400/20 h-7 w-7 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" /></div>
                       </>
                    )}

                    {/* Friendly Floating Lead Capture Card */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-20">
                       <div className="bg-card/80 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl text-center shadow-2xl transition-transform hover:-translate-y-1">
                          
                          <div className="inline-flex items-center justify-center p-2 bg-success/20 text-success rounded-full mb-3">
                             <CheckCircle2 size={24} className="fill-success/20" />
                          </div>
                          
                          <h4 className="text-2xl font-black text-foreground mb-1 leading-tight">
                             Match Found!
                          </h4>
                          <p className="text-sm font-medium text-muted-foreground mb-5 px-2">
                             We pinpointed <span className="text-primary font-bold">{Math.floor(Math.random() * 50) + 12} {mode === "hire" ? "verified workers" : "active gigs"}</span> right in your radius.
                          </p>
                          
                          <Button asChild size="lg" className="w-full h-12 text-md font-bold shadow-primary/25 shadow-lg group rounded-xl">
                             <Link to={mode === "hire" ? "/employer/signup" : "/worker/signup"}>
                                {mode === "hire" ? "Connect & Hire Instantly" : "Start Earning Now"} 
                                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                             </Link>
                          </Button>
                       </div>
                    </div>
                    
                 </div>
              )}
           </div>

        </div>
      </div>
    </section>
  );
}
