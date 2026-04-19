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
                 <div className="animate-fade-in">
                    <div className="text-center mb-8">
                       <h3 className="text-2xl font-black text-foreground">
                          {Math.floor(Math.random() * 50) + 12} {metrics.match}
                       </h3>
                       <p className="text-primary font-bold mt-1 tracking-wide uppercase text-sm">
                          Live Data Pinged Successfully
                       </p>
                    </div>

                    {/* Faux Grid & Glass Overlay Lock */}
                    <div className="relative">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                             <div key={i} className="p-5 rounded-2xl bg-secondary/30 border border-white/5 flex gap-4 items-start filter blur-[2px] opacity-70 select-none">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                   {mode === "hire" ? <Users size={20} className="text-primary" /> : <Briefcase size={20} className="text-primary" />}
                                </div>
                                <div className="flex-1 space-y-2">
                                   <div className="h-4 bg-muted/60 rounded w-2/3"></div>
                                   <div className="h-3 bg-muted/40 rounded w-1/2"></div>
                                   <div className="flex gap-2 pt-2">
                                     <div className="h-2 bg-success/40 rounded w-16"></div>
                                     <div className="h-2 bg-info/40 rounded w-16"></div>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>

                       {/* The Lock Overlay */}
                       <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/90 to-transparent pt-20">
                          <div className="bg-card/90 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl text-center shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)] max-w-sm w-full mx-4 animate-scale-in">
                             <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                                <Lock size={24} className="text-primary" />
                             </div>
                             <h4 className="text-xl font-black text-foreground mb-2 tracking-tight">Database Locked</h4>
                             <p className="text-sm font-medium text-muted-foreground mb-6">
                                Create an account to interact with these {mode === "hire" ? "workers" : "gigs"} and unlock full platform features.
                             </p>
                             <Button asChild size="lg" className="w-full text-md h-12 shadow-primary/25 shadow-lg group">
                                <Link to={mode === "hire" ? "/employer/signup" : "/worker/signup"}>
                                   Unlock Network <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                             </Button>
                          </div>
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
