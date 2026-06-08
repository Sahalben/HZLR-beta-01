import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search, MapPin, Briefcase, Users, ArrowRight,
  Loader2, CheckCircle2, Sparkles, Star, Clock, Shield,
  Zap, Activity, Percent, Check
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

// ─── Dynamic results builders ──────────────────────────────────────────────────
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

interface ActivityEvent {
  id: number;
  name: string;
  role: string;
  loc: string;
  status: string;
  time: string;
}

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

  // ─── Live Matching Feed Simulation ──────────────────────────────────────────
  const [activities, setActivities] = useState<ActivityEvent[]>([
    { id: 1, name: "Arjun M.", role: "Plumbing", loc: "Mumbai, MH", status: "matched & active", time: "Just now" },
    { id: 2, name: "Priya S.", role: "Event Staff", loc: "Delhi, DL", status: "payout processed", time: "2m ago" },
    { id: 3, name: "Rahul K.", role: "Driver", loc: "Bengaluru, KA", status: "matched & booked", time: "5m ago" },
    { id: 4, name: "Divya N.", role: "Catering", loc: "Pune, MH", status: "payout processed", time: "9m ago" },
  ]);

  useEffect(() => {
    const roles = ["Plumber", "Event Host", "Chef Assist", "Delivery Agent", "Electrician", "AC Tech", "Security Guard", "Store Keeper"];
    const locationsList = ["Mumbai, MH", "Delhi, DL", "Bengaluru, KA", "Pune, MH", "Hyderabad, TS", "Chennai, TN", "Kolkata, WB", "Ahmedabad, GJ"];
    const names = ["Aarav Sharma", "Pooja Patel", "Rohan Das", "Sneha Reddy", "Vikram Singh", "Anjali Nair", "Aditya Joshi", "Kriti Verma"];
    const statuses = ["matched & booked", "payout processed", "gig started", "verified active"];

    const interval = setInterval(() => {
      setActivities((prev) => {
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        const randomLoc = locationsList[Math.floor(Math.random() * locationsList.length)];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const newAct = {
          id: Date.now(),
          name: randomName,
          role: randomRole,
          loc: randomLoc,
          status: randomStatus,
          time: "Just now"
        };

        const updated = prev.map((act) => {
          let newTime = act.time;
          if (act.time === "Just now") newTime = "1m ago";
          else if (act.time === "1m ago") newTime = "3m ago";
          else if (act.time === "3m ago") newTime = "5m ago";
          else if (act.time === "5m ago") newTime = "8m ago";
          else {
            const num = parseInt(act.time);
            newTime = isNaN(num) ? "10m ago" : `${num + 2}m ago`;
          }
          return { ...act, time: newTime };
        });

        return [newAct, ...updated.slice(0, 3)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    setSearchedCategory(category); 
    setDemoState("searching");
    setTimeout(() => setDemoState("results"), 1400);
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-background">
      {/* Dot Background from Aceternity */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none opacity-[0.22] dark:opacity-[0.28]",
          "[background-size:24px_24px]",
          "[background-image:radial-gradient(hsl(var(--primary)/0.18)_1.5px,transparent_1.5px)]",
        )}
      />
      {/* Radial gradient mask for faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)]"></div>

      <div className="container relative mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles size={12} className="text-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Live Network Pulse</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight leading-tight">
            See What's Available
            <span className="block text-primary">Right Now, Near You</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-medium">
            Search our localized grid of verified workers and available gigs in real-time. No account required.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Interactive Search & Results Cockpit */}
          <div className="lg:col-span-2 bg-card/40 backdrop-blur-md border border-white/5 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-visible">
            <div>
              {/* Apple-style sliding pill toggle */}
              <div className="flex p-1 bg-secondary/30 rounded-2xl border border-white/5 max-w-xs mx-auto mb-8">
                <button
                  type="button"
                  onClick={() => setMode("hire")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                    mode === "hire"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Users size={14} />
                  Hire Workers
                </button>
                <button
                  type="button"
                  onClick={() => setMode("work")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                    mode === "work"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Briefcase size={14} />
                  Find Gigs
                </button>
              </div>

              {/* Form fields */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Category dropdown combobox */}
                  <div className="relative flex-1" ref={catRef}>
                    <div
                      className={cn(
                        "flex items-center gap-3 h-12 px-4 rounded-xl border bg-background/50 cursor-text transition-all",
                        catOpen ? "border-primary ring-1 ring-primary/20" : "border-white/5 hover:border-white/10"
                      )}
                      onClick={() => setCatOpen(true)}
                    >
                      <Search size={16} className="text-muted-foreground shrink-0" />
                      <input
                        value={category}
                        onChange={e => { setCategory(e.target.value); setCatOpen(true); }}
                        onFocus={() => setCatOpen(true)}
                        placeholder={mode === "hire" ? "e.g. Plumbing, Events, Electrician" : "Type of work you want"}
                        className="flex-1 bg-transparent text-xs font-medium placeholder:text-muted-foreground/60 outline-none"
                        required
                      />
                      {category && (
                        <button type="button" onClick={() => setCategory("")}
                          className="text-muted-foreground/50 hover:text-muted-foreground text-sm leading-none">×</button>
                      )}
                    </div>

                    {catOpen && filteredCats.length > 0 && (
                      <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-1.5">
                          {filteredCats.map((cat) => (
                            <button
                              key={cat.label}
                              type="button"
                              onMouseDown={() => { setCategory(cat.label); setCatOpen(false); }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/60 text-left transition-colors group"
                            >
                              <span className="text-lg leading-none">{cat.emoji}</span>
                              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{cat.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location combobox */}
                  <div className="relative flex-1" ref={locRef}>
                    <div
                      className={cn(
                        "flex items-center gap-3 h-12 px-4 rounded-xl border bg-background/50 cursor-text transition-all",
                        locOpen ? "border-primary ring-1 ring-primary/20" : "border-white/5 hover:border-white/10"
                      )}
                      onClick={() => setLocOpen(true)}
                    >
                      <MapPin size={16} className="text-muted-foreground shrink-0" />
                      <input
                        value={location}
                        onChange={e => { setLocation(e.target.value); setLocOpen(true); }}
                        onFocus={() => setLocOpen(true)}
                        placeholder="City, e.g. Mumbai, Pune"
                        className="flex-1 bg-transparent text-xs font-medium placeholder:text-muted-foreground/60 outline-none"
                        required
                      />
                      {location && (
                        <button type="button" onClick={() => setLocation("")}
                          className="text-muted-foreground/50 hover:text-muted-foreground text-sm leading-none">×</button>
                      )}
                    </div>

                    {locOpen && location.trim().length >= 2 && (
                      <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        {locLoading ? (
                          <div className="flex items-center gap-3 px-4 py-3 text-xs text-muted-foreground">
                            <Loader2 size={13} className="animate-spin shrink-0" />
                            Locating grid nodes...
                          </div>
                        ) : filteredCities.length > 0 ? (
                          <div className="p-1">
                            {filteredCities.map(({ city, state }) => (
                              <button
                                key={city}
                                type="button"
                                onMouseDown={() => { setLocation(city); setLocOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/60 text-left transition-colors group"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <MapPin size={11} className="text-primary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{city}</span>
                                  <span className="text-[10px] text-muted-foreground">{state}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-xs text-muted-foreground">No matches found in India.</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={demoState === "searching"}
                    className="h-12 px-6 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 shrink-0 sm:w-auto w-full transition-all duration-300"
                  >
                    {demoState === "searching"
                      ? <Loader2 size={16} className="animate-spin" />
                      : <><Zap size={14} className="mr-1.5" /> Scan Network</>
                    }
                  </Button>
                </div>

                {/* Hint chips */}
                {demoState === "idle" && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(mode === "hire"
                      ? ["Plumbing", "Event Staff", "Delivery", "Electrician"]
                      : ["Kitchen Assist", "Security Guard", "Warehouse", "Driver"]
                    ).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setCategory(tag)}
                        className="px-2.5 py-1 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-white/5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Results Display Panel */}
            <div className="mt-8 flex-1 flex flex-col justify-center min-h-[260px]">
              {/* Idle state */}
              {demoState === "idle" && (
                <div className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border border-dashed border-white/5 bg-secondary/5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Search size={18} className="text-primary/60" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Select a category, location and scan the live network</p>
                </div>
              )}

              {/* Scanning State */}
              {demoState === "searching" && (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                  <div className="relative w-12 h-12">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                    <div className="absolute inset-2.5 w-7 h-7 rounded-full border border-primary/20 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-foreground">Scoping coordinates...</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Matching {category} in {location}</p>
                  </div>
                </div>
              )}

              {/* Results State */}
              {demoState === "results" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Matching banner */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary/8 border border-primary/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {matchCount} active {mode === "hire" ? "workers found" : "gigs available"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">in {location} · {category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/15 border border-success/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-[9px] font-bold text-success uppercase tracking-wider">Connected</span>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {mode === "hire"
                      ? workerProfiles.map((w) => (
                          <div
                            key={w.img}
                            className="p-3.5 rounded-xl bg-secondary/15 border border-white/5 hover:border-primary/25 transition-all duration-300 group cursor-default relative overflow-hidden"
                          >
                            <div className="flex items-center gap-2.5 mb-2.5">
                              <div className="relative">
                                <img
                                  src={`https://i.pravatar.cc/100?img=${w.img}`}
                                  className="w-8 h-8 rounded-full border border-white/10"
                                  alt={w.name}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-foreground truncate max-w-[90px]">{w.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate max-w-[90px]">{w.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-muted-foreground">
                              <div className="flex items-center gap-0.5">
                                <Star size={10} className="text-amber-400 fill-amber-400" />
                                <span className="font-bold text-foreground">{w.rating}</span>
                              </div>
                              <span>{w.gigs} gigs</span>
                              <span className="text-success font-semibold">Verified</span>
                            </div>
                          </div>
                        ))
                      : gigSamples.map((g) => (
                          <div
                            key={g.title}
                            className="p-3.5 rounded-xl bg-secondary/15 border border-white/5 hover:border-primary/25 transition-all duration-300 cursor-default relative"
                          >
                            {g.urgent && (
                              <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                                <span className="text-[8px] font-black text-orange-400">URGENT</span>
                              </div>
                            )}
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mb-2.5 border border-primary/15">
                              <Briefcase size={12} className="text-primary" />
                            </div>
                            <p className="text-xs font-bold text-foreground mb-1 truncate pr-8">{g.title}</p>
                            <div className="flex items-center justify-between border-t border-white/5 pt-2">
                              <span className="text-xs font-black text-success">₹{g.pay}</span>
                              <span className="text-[10px] text-muted-foreground">{g.slots} slots</span>
                            </div>
                          </div>
                        ))
                    }
                  </div>

                  {/* Soft CTA */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/5 border border-primary/15 mt-4">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-xs font-bold text-foreground">
                        {mode === "hire"
                          ? `Hire Aadhaar-verified workers in ${location} instantly`
                          : `Get matched to shifts paying up to ₹1,200/day in ${location}`}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Connect with zero agent commissions. Set up in 2 minutes.</p>
                    </div>
                    <Button asChild size="sm" className="shrink-0 rounded-lg shadow-md group px-4 h-9 text-xs font-bold">
                      <Link to={mode === "hire" ? "/employer/signup" : "/worker/signup"}>
                        {mode === "hire" ? "Hire Now" : "Earn Now"}
                        <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Bento Column */}
          <div className="flex flex-col gap-6">
            
            {/* Card 2: Live Network Pulse Feed */}
            <div className="bg-card/40 backdrop-blur-md border border-white/5 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between h-[250px] shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-primary animate-pulse" />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Matching Stream</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Ticker stream */}
              <div className="flex-1 my-3 overflow-hidden relative">
                <div className="space-y-2.5">
                  {activities.map((act, index) => (
                    <div
                      key={act.id}
                      className={cn(
                        "flex items-center justify-between text-[11px] p-2 rounded-lg transition-all duration-500 border border-transparent hover:bg-secondary/20 hover:border-white/5",
                        index === 0 ? "animate-fade-up border-primary/15 bg-primary/5" : "opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-5 h-5 rounded-full bg-secondary/80 flex items-center justify-center text-[10px]">
                          👤
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-foreground">{act.name}</span>
                          <span className="text-muted-foreground ml-1">({act.role})</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-success capitalize">{act.status}</p>
                        <p className="text-[9px] text-muted-foreground">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Trust & Aadhaar Verification */}
            <div className="bg-card/40 backdrop-blur-md border border-white/5 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between h-[180px] shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Shield className="text-emerald-400" size={14} />
                </div>
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">Aadhaar Secured</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-foreground mb-1">Identity Lock Protection</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Automatic government-grade background verifications. Guaranteed zero-fraud gig network.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                <Check size={10} className="stroke-[3]" />
                <span>100% Verified Workforce</span>
              </div>
            </div>

            {/* Card 4: Network Health Metrics */}
            <div className="bg-card/40 backdrop-blur-md border border-white/5 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between h-[180px] shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <Percent className="text-primary" size={14} />
                </div>
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">Efficiency Index</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-2">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Avg Matching</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-foreground">4.8</span>
                    <span className="text-[10px] text-muted-foreground">mins</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Fulfillment</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-success">98.4%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground">
                <Clock size={9} />
                <span>Computed across 14,000+ matches this week</span>
              </div>
            </div>

          </div>
        </div>

        {/* Small trust banner footer */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs text-muted-foreground/50 border-t border-white/5 pt-6">
          <div className="flex items-center gap-1.5">
            <Shield size={12} className="text-primary/60" />
            <span>Encrypted Identity Protocol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-primary/60" />
            <span>Spot Payments via UPI escrow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-primary/60" />
            <span>Zero Agency Commissions</span>
          </div>
        </div>

      </div>
    </section>
  );
}
