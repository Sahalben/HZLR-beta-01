import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search, MapPin, Briefcase, Users, ArrowRight,
  Loader2, CheckCircle2, Sparkles, Star, Clock, Shield,
  ChevronRight, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DemoState = "idle" | "searching" | "results";
type Mode = "hire" | "work";

// ─── Data ──────────────────────────────────────────────────────────────────────
const ALL_CATEGORIES = [
  { label: "Food & Beverage", emoji: "🍽️" },
  { label: "Events & Hospitality", emoji: "🎪" },
  { label: "Kitchen & Cooking", emoji: "👨‍🍳" },
  { label: "Catering & Food Prep", emoji: "🥘" },
  { label: "Bartending", emoji: "🍸" },
  { label: "Cleaning & Housekeeping", emoji: "🧹" },
  { label: "Elder Care", emoji: "🤝" },
  { label: "Pet Care", emoji: "🐾" },
  { label: "Gardening & Landscaping", emoji: "🌿" },
  { label: "Babysitting & Childcare", emoji: "👶" },
  { label: "Laundry & Ironing", emoji: "👕" },
  { label: "Plumbing", emoji: "🔧" },
  { label: "Electrical", emoji: "⚡" },
  { label: "Carpentry & Woodwork", emoji: "🪵" },
  { label: "Painting & Decorating", emoji: "🎨" },
  { label: "Construction & Labour", emoji: "🏗️" },
  { label: "AC & Appliance Repair", emoji: "❄️" },
  { label: "Pest Control", emoji: "🪲" },
  { label: "Warehouse & Logistics", emoji: "📦" },
  { label: "Delivery & Courier", emoji: "🛵" },
  { label: "Moving & Shifting", emoji: "🚚" },
  { label: "Driving & Chauffeur", emoji: "🚗" },
  { label: "Ride Sharing", emoji: "🚕" },
  { label: "Car Wash & Detailing", emoji: "🚿" },
  { label: "Security & Guard", emoji: "🔒" },
  { label: "Beauty & Grooming", emoji: "💇" },
  { label: "Fitness & Personal Training", emoji: "💪" },
  { label: "Yoga & Wellness", emoji: "🧘" },
  { label: "Mehendi & Makeup", emoji: "💅" },
  { label: "Healthcare & Nursing", emoji: "🏥" },
  { label: "Pharmacy Assistance", emoji: "💊" },
  { label: "Photography & Videography", emoji: "📸" },
  { label: "Graphic Design", emoji: "✏️" },
  { label: "Content Writing", emoji: "📝" },
  { label: "DJ & Entertainment", emoji: "🎧" },
  { label: "Event Decoration", emoji: "🎀" },
  { label: "Modelling & Promotion", emoji: "🌟" },
  { label: "Wedding Services", emoji: "💍" },
  { label: "Data Entry & Admin", emoji: "💻" },
  { label: "Customer Support", emoji: "🎧" },
  { label: "Sales & Promotions", emoji: "📣" },
  { label: "Teaching & Tutoring", emoji: "📚" },
  { label: "IT & Tech Support", emoji: "🖥️" },
  { label: "Social Media Management", emoji: "📱" },
  { label: "Accounting & Finance", emoji: "📊" },
  { label: "Legal & Documentation", emoji: "⚖️" },
  { label: "Translation", emoji: "🌐" },
  { label: "Tailoring & Alterations", emoji: "🧵" },
];

// ─── Nominatim location type ───────────────────────────────────────────────────
interface LocationResult {
  display_name: string;
  city: string;
  state: string;
}

// ─── Dynamic results builders (contextual to search keyword) ──────────────────
const NAMES = [
  ["Arjun", "M."], ["Priya", "N."], ["Rahul", "S."], ["Divya", "K."],
  ["Kiran", "R."], ["Suresh", "P."], ["Meena", "B."], ["Vijay", "T."],
];
const IMGS = [11, 33, 47, 64, 12, 54, 68, 22];

function buildWorkerProfiles(category: string) {
  const role = category || "General Work";
  return NAMES.slice(0, 3).map((n, i) => ({
    img: IMGS[i],
    name: `${n[0]} ${n[1]}`,
    role,
    rating: parseFloat((4.7 + Math.random() * 0.3).toFixed(1)),
    gigs: Math.floor(Math.random() * 100) + 30,
  }));
}

const PAY_RANGE: Record<string, number> = {
  plumbing: 900, electrical: 950, carpentry: 800, painting: 750,
  delivery: 700, driving: 800, security: 650, cleaning: 600,
  events: 750, hospitality: 800, kitchen: 700, default: 750,
};

function buildGigSamples(category: string) {
  const base = category || "General";
  const key = Object.keys(PAY_RANGE).find(k => base.toLowerCase().includes(k)) || "default";
  const basePay = PAY_RANGE[key];
  return [
    { title: `${base} - Morning Shift`, pay: basePay, slots: Math.floor(Math.random() * 8) + 3, urgent: true },
    { title: `${base} - Full Day`, pay: Math.round(basePay * 1.4), slots: Math.floor(Math.random() * 15) + 5, urgent: false },
    { title: `${base} - Weekend`, pay: Math.round(basePay * 1.2), slots: Math.floor(Math.random() * 6) + 2, urgent: Math.random() > 0.5 },
  ];
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function InteractiveDemo() {
  const [mode, setMode] = useState<Mode>("hire");
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [matchCount] = useState(() => Math.floor(Math.random() * 40) + 18);
  const [locResults, setLocResults] = useState<LocationResult[]>([]);
  const [locLoading, setLocLoading] = useState(false);
  const [searchedCategory, setSearchedCategory] = useState("");
  const locDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const catRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  // Filtered category list
  const filteredCats = category.length === 0
    ? ALL_CATEGORIES.slice(0, 6)
    : ALL_CATEGORIES.filter(c => c.label.toLowerCase().includes(category.toLowerCase())).slice(0, 6);

  // Nominatim live location search
  useEffect(() => {
    if (location.trim().length < 2) { setLocResults([]); return; }
    if (locDebounce.current) clearTimeout(locDebounce.current);
    locDebounce.current = setTimeout(async () => {
      setLocLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}+India&format=json&addressdetails=1&limit=6&featuretype=city`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        const mapped: LocationResult[] = data
          .filter((r: any) => r.address)
          .map((r: any) => ({
            display_name: r.display_name,
            city: r.address.city || r.address.town || r.address.village || r.address.county || r.name,
            state: r.address.state || "",
          }))
          .filter((r: LocationResult) => r.city)
          .reduce((acc: LocationResult[], cur: LocationResult) => {
            if (!acc.find(a => a.city === cur.city)) acc.push(cur);
            return acc;
          }, []);
        setLocResults(mapped);
      } catch { setLocResults([]); }
      finally { setLocLoading(false); }
    }, 280);
    return () => { if (locDebounce.current) clearTimeout(locDebounce.current); };
  }, [location]);

  // Contextual results derived from the searched category
  const workerProfiles = useMemo(() => buildWorkerProfiles(searchedCategory), [searchedCategory]);
  const gigSamples = useMemo(() => buildGigSamples(searchedCategory), [searchedCategory]);

  const displayedLocResults = location.trim().length < 2 ? [] : locResults;

  // filteredCities now points to live Nominatim results
  const filteredCities = displayedLocResults;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset on mode switch
  useEffect(() => {
    setDemoState("idle");
    setCategory("");
    setLocation("");
  }, [mode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !location.trim()) return;
    setSearchedCategory(category); // capture for contextual results
    setDemoState("searching");
    setTimeout(() => setDemoState("results"), 1400);
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-background">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-500/5 blur-[80px] rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Live Network Preview</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight leading-tight">
            See What's Available
            <span className="block text-primary">Right Now, Near You</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            No account needed. Search the network and see exactly what HZLR can unlock for you.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_60px_-20px_rgba(0,0,0,0.5)] overflow-visible">

          {/* Mode Toggle */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setMode("hire")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 px-6 py-5 text-sm font-bold transition-all rounded-tl-3xl",
                mode === "hire"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Users size={17} />
              Hire Workers
              {mode === "hire" && <ChevronRight size={15} className="opacity-70" />}
            </button>
            <div className="w-px bg-white/5" />
            <button
              onClick={() => setMode("work")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 px-6 py-5 text-sm font-bold transition-all rounded-tr-3xl",
                mode === "work"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Briefcase size={17} />
              Find Gigs
              {mode === "work" && <ChevronRight size={15} className="opacity-70" />}
            </button>
          </div>

          {/* Search area */}
          <div className="p-5 md:p-8">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">

                {/* Category Combobox */}
                <div className="relative flex-1" ref={catRef}>
                  <div
                    className={cn(
                      "flex items-center gap-3 h-14 px-4 rounded-2xl border bg-background/60 cursor-text transition-all",
                      catOpen ? "border-primary ring-1 ring-primary/30" : "border-white/10 hover:border-white/20"
                    )}
                    onClick={() => { setCatOpen(true); }}
                  >
                    <Search size={17} className="text-muted-foreground shrink-0" />
                    <input
                      value={category}
                      onChange={e => { setCategory(e.target.value); setCatOpen(true); }}
                      onFocus={() => setCatOpen(true)}
                      placeholder={mode === "hire" ? "Job category, e.g. Plumbing" : "Type of work you want"}
                      className="flex-1 bg-transparent text-sm font-medium placeholder:text-muted-foreground/60 outline-none"
                      required
                    />
                    {category && (
                      <button type="button" onClick={() => setCategory("")}
                        className="text-muted-foreground/50 hover:text-muted-foreground text-lg leading-none">×</button>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  {catOpen && filteredCats.length > 0 && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-1.5">
                        {filteredCats.map((cat) => (
                          <button
                            key={cat.label}
                            type="button"
                            onMouseDown={() => { setCategory(cat.label); setCatOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/60 text-left transition-colors group"
                          >
                            <span className="text-xl leading-none">{cat.emoji}</span>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                      {category.length > 0 && ALL_CATEGORIES.filter(c => c.label.toLowerCase().includes(category.toLowerCase())).length > 6 && (
                        <div className="px-4 py-2.5 border-t border-white/5 text-xs text-muted-foreground">
                          + {ALL_CATEGORIES.filter(c => c.label.toLowerCase().includes(category.toLowerCase())).length - 6} more categories
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Location Combobox */}
                <div className="relative flex-1" ref={locRef}>
                  <div
                    className={cn(
                      "flex items-center gap-3 h-14 px-4 rounded-2xl border bg-background/60 cursor-text transition-all",
                      locOpen ? "border-primary ring-1 ring-primary/30" : "border-white/10 hover:border-white/20"
                    )}
                    onClick={() => setLocOpen(true)}
                  >
                    <MapPin size={17} className="text-muted-foreground shrink-0" />
                    <input
                      value={location}
                      onChange={e => { setLocation(e.target.value); setLocOpen(true); }}
                      onFocus={() => setLocOpen(true)}
                      placeholder="City, e.g. Mumbai"
                      className="flex-1 bg-transparent text-sm font-medium placeholder:text-muted-foreground/60 outline-none"
                      required
                    />
                    {location && (
                      <button type="button" onClick={() => setLocation("")}
                        className="text-muted-foreground/50 hover:text-muted-foreground text-lg leading-none">×</button>
                    )}
                  </div>

                  {/* Location Dropdown */}
                  {locOpen && location.trim().length >= 2 && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      {locLoading ? (
                        <div className="flex items-center gap-3 px-4 py-4 text-sm text-muted-foreground">
                          <Loader2 size={15} className="animate-spin shrink-0" />
                          Finding locations in India...
                        </div>
                      ) : filteredCities.length > 0 ? (
                        <div className="p-1.5">
                          {filteredCities.map(({ city, state }) => (
                            <button
                              key={city}
                              type="button"
                              onMouseDown={() => { setLocation(city); setLocOpen(false); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/60 text-left transition-colors group"
                            >
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <MapPin size={13} className="text-primary" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{city}</span>
                                <span className="text-xs text-muted-foreground ml-2">{state}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-4 text-sm text-muted-foreground">No locations found. Try a different name.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={demoState === "searching"}
                  className="h-14 px-7 rounded-2xl text-sm font-bold shadow-lg shadow-primary/25 shrink-0 sm:w-auto w-full"
                >
                  {demoState === "searching"
                    ? <Loader2 size={18} className="animate-spin" />
                    : <><Zap size={16} className="mr-1" /> Search</>
                  }
                </Button>
              </div>

              {/* Hint chips */}
              {demoState === "idle" && (
                <div className="flex flex-wrap gap-2">
                  {(mode === "hire"
                    ? ["Plumbing", "Event Staff", "Delivery", "Electrician"]
                    : ["Kitchen Assist", "Security Guard", "Warehouse", "Driver"]
                  ).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCategory(tag)}
                      className="px-3 py-1.5 rounded-lg bg-secondary/40 hover:bg-secondary/70 border border-white/5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Results Panel */}
            <div className="mt-6 relative">

              {/* Idle */}
              {demoState === "idle" && (
                <div className="h-56 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/8 bg-secondary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search size={22} className="text-primary/60" />
                  </div>
                  <p className="text-sm text-muted-foreground/60 font-medium">Fill in the fields above and hit Search</p>
                </div>
              )}

              {/* Searching */}
              {demoState === "searching" && (
                <div className="h-56 flex flex-col items-center justify-center gap-4">
                  <div className="relative w-14 h-14">
                    <div className="w-14 h-14 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                    <div className="absolute inset-2 w-10 h-10 rounded-full border border-primary/20 animate-ping" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">Scanning network...</p>
                    <p className="text-xs text-muted-foreground mt-1">Geo-matching {category} near {location}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {demoState === "results" && (
                <div className="space-y-4">
                  {/* Count banner */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/8 border border-primary/15">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {matchCount} {mode === "hire" ? "workers found" : "gigs available"}
                        </p>
                        <p className="text-xs text-muted-foreground">in {location} · {category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/15 border border-success/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-xs font-bold text-success">Live</span>
                    </div>
                  </div>

                  {/* Preview cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {mode === "hire"
                      ? workerProfiles.map((w, i) => (
                          <div
                            key={w.img}
                            className="relative p-4 rounded-2xl bg-secondary/20 border border-white/8 hover:border-primary/30 transition-all group cursor-default"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="relative">
                                <img
                                  src={`https://i.pravatar.cc/100?img=${w.img}`}
                                  className="w-10 h-10 rounded-full border border-white/10"
                                  alt={w.name}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{w.name}</p>
                                <p className="text-xs text-muted-foreground">{w.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star size={11} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-semibold text-foreground">{w.rating}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{w.gigs} gigs</span>
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                                <Shield size={9} className="text-success" />
                                <span className="text-[10px] font-bold text-success">Verified</span>
                              </div>
                            </div>
                          </div>
                        ))
                      : gigSamples.map((g, i) => (
                          <div
                            key={g.title}
                            className="relative p-4 rounded-2xl bg-secondary/20 border border-white/8 hover:border-primary/30 transition-all cursor-default"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            {g.urgent && (
                              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/25">
                                <span className="text-[10px] font-bold text-orange-400">URGENT</span>
                              </div>
                            )}
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3 border border-primary/15">
                              <Briefcase size={16} className="text-primary" />
                            </div>
                            <p className="text-sm font-bold text-foreground mb-2">{g.title}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-success">₹{g.pay}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users size={11} />
                                {g.slots} slots
                              </div>
                            </div>
                          </div>
                        ))
                    }
                  </div>

                  {/* Soft CTA */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/8 to-blue-500/5 border border-primary/15">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-bold text-foreground">
                        {mode === "hire"
                          ? `${matchCount} workers ready to hire in ${location}`
                          : `${matchCount} gigs paying up to ₹1,200/day in ${location}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Create an account to connect instantly. Free to join.</p>
                    </div>
                    <Button asChild size="sm" className="shrink-0 rounded-xl shadow-primary/20 shadow-md group px-5">
                      <Link to={mode === "hire" ? "/employer/signup" : "/worker/signup"}>
                        {mode === "hire" ? "Start Hiring" : "Start Earning"}
                        <ArrowRight size={15} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground/70">
          {[
            { icon: Shield, text: "Aadhaar Verified Workers" },
            { icon: Zap, text: "Instant Spot Payment" },
            { icon: Clock, text: "Available 24/7" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={15} className="text-primary/60" />
              <span className="text-xs font-medium">{text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
