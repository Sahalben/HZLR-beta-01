import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Bell, Search, User, BadgeCheck, TrendingUp, Calendar, MapPin, Briefcase, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { GigCard } from "@/components/shared/GigCard";
import { ApplicationModal } from "@/components/shared/ApplicationModal";
import { LocationMap } from "@/components/worker/LocationMap";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const gigCategories = [
  { id: "fnb", name: "F&B Service", icon: "🍽️", color: "bg-amber-500" },
  { id: "housekeeping", name: "House Keeping", icon: "🧹", color: "bg-teal-500" },
  { id: "plumbing", name: "Plumbing", icon: "🔧", color: "bg-orange-500" },
  { id: "driving", name: "Driving", icon: "🚗", color: "bg-blue-500" },
  { id: "events", name: "Events", icon: "🎉", color: "bg-purple-500" },
];

const longTermJobs = [
  "Cashier at Reliance Fresh",
  "Barista at Third Wave", 
  "Restaurant Manager",
  "Data Entry Executive",
];

export default function WorkerHome() {
  const navigate = useNavigate();
  const { profile: baseProfile, user } = useAuth();
  const profile = baseProfile as any; // Cast to access native backend WorkerProfile metrics
  
  // Dynamic Unmocked State
  const [readyToWork, setReadyToWork] = useState(true);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [upcomingJobs, setUpcomingJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletPending, setWalletPending] = useState(0);

  const [applicationModal, setApplicationModal] = useState<{ open: boolean; gig: any | null; type: "apply" | "queue" }>({ open: false, gig: null, type: "apply" });

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        
        // Parallel map fetching for dashboard hydration
        const [jobsRes, walletRes, upcomingRes] = await Promise.all([
             fetch(`${API_URL}/api/v1/jobs/available`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}),
             fetch(`${API_URL}/api/v1/wallets/${user?.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}),
             fetch(`${API_URL}/api/v1/jobs/worker/upcoming`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
        ]);

        if(jobsRes.ok) {
           const data = await jobsRes.json();
           setAvailableJobs(Array.isArray(data) ? data : []);
        }
        if(upcomingRes.ok) {
           const data = await upcomingRes.json();
           setUpcomingJobs(Array.isArray(data) ? data : []);
        }
        
        if(walletRes.ok) {
           const wData = await walletRes.json();
           setWalletBalance(wData.balance || 0);
           setWalletPending(wData.pendingBalance || 0);
        }
      } catch (e) {
          console.error("Dashboard hydration error", e);
      } finally { 
          setLoadingJobs(false); 
      }
    };
    
    if (user?.id) initDashboard();
  }, [user]);

  const handleApply = (gig: any) => { setApplicationModal({ open: true, gig, type: "apply" }); };
  const handleJoinQueue = (gig: any) => { setApplicationModal({ open: true, gig, type: "queue" }); };

  const handleConfirmApplication = async () => {
    try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_URL}/api/v1/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ jobId: applicationModal.gig.id })
        });
        const data = await res.json();
        
        if (!res.ok) {
           if (data.error === 'KYC_REQUIRED') {
               toast({ title: "KYC Required", description: data.message, variant: "destructive" });
               navigate('/signup/kyc');
               return;
           }
           throw new Error(data.message || data.error);
        }

        toast({
          title: "Application Submitted",
          description: data.status === 'QUEUED' ? "You've been added to the backup queue." : "Your application has been accepted!",
          className: "bg-success text-white border-0"
        });
        setApplicationModal({ open: false, gig: null, type: "apply" });
    } catch(e: any) {
        toast({ title: "Verification Needed", description: "You might need to complete KYC before applying to high-yield jobs.", variant: "destructive" });
    }
  };

  const nameTag = profile?.username || profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "Worker";

  return (
    <WorkerLayout showHeader={false}>
      {/* Dynamic Master Header */}
      <header className="bg-foreground text-background px-4 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-[0.03]" />
        
        <div className="relative flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-background/60 font-medium tracking-wide uppercase">Welcome back</p>
            <h1 className="text-3xl font-black mt-1">{nameTag}</h1>
          </div>
          <Link to="/worker/notifications" className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Bell size={22} className="text-white" />
            <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-success border-2 border-foreground rounded-full" />
          </Link>
        </div>

        {/* Dynamic Profile Stats */}
        <div className="relative grid grid-cols-3 gap-3 mb-6 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
          <div className="text-center">
            <span className="text-2xl font-black text-seafoam">{profile?.reliabilityScore || 0}%</span>
            <p className="text-xs text-background/60 mt-1 uppercase font-bold tracking-wider">Reliability</p>
          </div>
          <div className="text-center border-l border-white/10">
            <span className="text-2xl font-bold">{profile?.totalGigsDone || 0}</span>
            <p className="text-xs text-background/60 mt-1 uppercase font-bold tracking-wider">Gigs Done</p>
          </div>
          <div className="text-center border-l border-white/10">
            <span className="text-2xl font-bold text-amber-400">₹{profile?.avgPay || 0}</span>
            <p className="text-xs text-background/60 mt-1 uppercase font-bold tracking-wider">Avg Pay</p>
          </div>
        </div>

        {/* Badges */}
        <div className="relative flex items-center gap-2">
          {profile?.aadhaarVerified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-info/20 text-xs font-bold text-info border border-info/30">
              <BadgeCheck size={14} /> ID Verified
            </span>
          )}
          {profile?.groomingCertified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/20 text-xs font-bold text-success border border-success/30">
              <TrendingUp size={14} /> Certified Pro
            </span>
          )}
        </div>
      </header>

      <div className="px-4 -mt-4 space-y-6 pb-8 relative z-10">
        
        {/* Unmocked Wallet Card (Displays 0 by default) */}
        <Card className="p-0 border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600">
           <div className="p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold opacity-90 tracking-wide uppercase">Hzlr Wallet</p>
                <div className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Secure</div>
              </div>
              
              <div className="flex items-end justify-between">
                  <div>
                      <div className="text-4xl font-black tracking-tighter mb-1 relative">
                          <span className="text-2xl opacity-60 absolute -left-4 top-1">₹</span>
                          {Math.round(walletBalance).toLocaleString()}
                      </div>
                      <p className="text-xs opacity-70 font-medium">Pending: ₹{Math.round(walletPending).toLocaleString()}</p>
                  </div>
                  
                  <Button variant="secondary" size="sm" className="font-bold shadow-lg" asChild>
                      <Link to="/worker/wallet">Activate UPI</Link>
                  </Button>
              </div>
           </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Search, label: "Find Gigs", href: "/worker/search", bg: "bg-blue-500/10 text-blue-600" },
            { icon: Calendar, label: "My Gigs", href: "/worker/my-gigs", bg: "bg-purple-500/10 text-purple-600" },
            { icon: User, label: "Profile", href: "/worker/profile", bg: "bg-amber-500/10 text-amber-600" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.href}>
                <Card className="p-4 text-center hover:bg-secondary/20 transition-colors border-0 shadow-sm flex flex-col items-center">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-2", action.bg)}>
                     <Icon size={22} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground tracking-wide uppercase">{action.label}</span>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Active Upcoming Gigs Module */}
        <div>
           <div className="flex items-center justify-between mb-3 text-foreground tracking-tight">
               <h3 className="font-bold text-lg">Active Upcoming</h3>
               <span className="text-[10px] font-black uppercase text-muted-foreground">{upcomingJobs.length} Secured</span>
           </div>
           
           {upcomingJobs.length === 0 ? (
               <Card className="p-5 border-dashed border-2 bg-transparent text-center shadow-none hover:bg-secondary/10 transition-colors">
                   <Calendar className="w-10 h-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                   <p className="font-semibold text-foreground text-sm">Your schedule is clear</p>
                   <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto leading-relaxed">You haven't been confirmed for any shifts yet. Apply to nearby gigs to get started!</p>
               </Card>
           ) : (
               <div className="space-y-3">
                   {upcomingJobs.map((app) => (
                       <Card key={app.id} className="p-0 overflow-hidden border border-emerald-500/30 shadow-xl shadow-emerald-500/10">
                           <div className="bg-emerald-500 flex justify-between items-center px-4 py-2 text-white shadow-inner">
                               <p className="text-[10px] uppercase font-black tracking-widest">{app.status}</p>
                               <span className="text-xs font-bold">{new Date(app.job.scheduledFor).toLocaleDateString()}</span>
                           </div>
                           <div className="p-4 bg-card">
                               <h4 className="font-black text-base text-foreground leading-tight tracking-tight mb-1">{app.job.title}</h4>
                               <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5"><MapPin size={12} className="text-primary"/> {app.job.city || "Exact Address Processing"}</p>
                           </div>
                       </Card>
                   ))}
               </div>
           )}
        </div>

        {/* Dynamic Find Jobs from Map */}
        <div>
           <h3 className="font-bold text-lg text-foreground mb-3 tracking-tight">Active Radar</h3>
           <LocationMap 
             jobs={availableJobs} 
             onApply={handleApply} 
             initialLocation={profile?.latitude && profile?.longitude ? [profile.latitude, profile.longitude] : undefined}
             onLocationChange={async (lat, lng) => {
               try {
                 const API_URL = import.meta.env.VITE_API_URL || '';
                 await fetch(`${API_URL}/api/v1/auth/profile`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                   body: JSON.stringify({ location_lat: lat, location_lng: lng })
                 });
                 toast({ title: "Radar Offset Sent", description: "Your location was successfully corrected." });
               } catch(e) {}
             }}
           />
        </div>

        {/* Available Gigs Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg tracking-tight text-foreground">Nearby You</h3>
            <Link to="/worker/search" className="text-xs font-bold text-seafoam uppercase tracking-wider hover:underline">
              View Feed
            </Link>
          </div>
          <div className="space-y-4">
            {loadingJobs ? (
                <div className="py-8 text-center text-muted-foreground animate-pulse font-medium text-sm">Scanning coordinates...</div>
            ) : availableJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center bg-muted/50 p-4 rounded-xl">Area clear. No shifts inside your radius right now.</p>
            ) : (
                availableJobs.map((gig) => (
                <GigCard
                    key={gig.id}
                    id={gig.id}
                    title={gig.title}
                    employer={gig.employerProfile?.businessName || gig.employerProfile?.firstName ? `${gig.employerProfile.firstName} (Verified)` : 'Confidential Entity'}
                    pay={gig.payPerWorker}
                    date={new Date(gig.scheduledFor).toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    distance={gig.distance?.toFixed(1) + 'km' || '< 1km'}
                    prefunded={gig.isPrefunded}
                    spots={gig.totalSpots - (gig.filledSpots || 0)}
                    status={(gig.totalSpots - (gig.filledSpots || 0)) > 0 ? "available" : "available"}
                    onApply={() => handleApply(gig)}
                    onJoinQueue={() => handleJoinQueue(gig)}
                />
            )))}
          </div>
        </div>
      </div>

      {applicationModal.gig && (
        <ApplicationModal
          open={applicationModal.open}
          onOpenChange={(open) => setApplicationModal({ ...applicationModal, open })}
          gig={applicationModal.gig ? {
            title: applicationModal.gig.title,
            employer: applicationModal.gig.employerProfile?.firstName ? applicationModal.gig.employerProfile.firstName : 'Entity',
            pay: applicationModal.gig.payPerWorker,
            date: new Date(applicationModal.gig.scheduledFor).toLocaleString(),
            distance: applicationModal.gig.distance?.toFixed(1) + 'km',
          } : { title: '', employer: '', pay: 0, date: '', distance: '' }}
          type={applicationModal.type}
          onConfirm={handleConfirmApplication}
        />
      )}
    </WorkerLayout>
  );
}
