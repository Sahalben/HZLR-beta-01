import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  Bell,
  Search,
  User,
  BadgeCheck,
  TrendingUp,
  Calendar,
  MapPin,
  Briefcase,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { ReliabilityScore } from "@/components/shared/ReliabilityScore";
import { GigCard } from "@/components/shared/GigCard";
import { ApplicationModal } from "@/components/shared/ApplicationModal";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockUser = {
  name: "Priya Sharma",
  reliabilityScore: 94,
  gigsCompleted: 47,
  avgPay: "₹850",
  verified: true,
  groomingCertified: true,
  history: {
    completions: 47,
    cancellations: 2,
    punctualityRate: 96,
    averageRating: 4.8,
  },
};

const mockWallet = {
  available: 28350,
  pending: 850,
};

const mockUpcoming = [
  {
    id: 101,
    title: "Kitchen Staff",
    employer: "Taj Palace",
    pay: 950,
    date: "Today, 7 AM",
    status: "confirmed" as const,
  },
];

const mockNearby = [
  {
    id: 1,
    title: "F&B Staff",
    employer: "Grand Hyatt",
    pay: 900,
    date: "Today, 6 PM",
    distance: "2.1km",
    prefunded: true,
    spots: 2,
    grooming: true,
  },
  {
    id: 2,
    title: "Event Setup",
    employer: "Marriott Convention",
    pay: 1200,
    date: "Tomorrow, 8 AM",
    distance: "4.5km",
    prefunded: true,
    spots: 5,
    grooming: false,
  },
];

const gigCategories = [
  { id: "housekeeping", name: "House Keeping", icon: "🧹", color: "bg-teal-500" },
  { id: "plumbing", name: "Plumbing", icon: "🔧", color: "bg-orange-500" },
  { id: "driving", name: "Driving", icon: "🚗", color: "bg-blue-500" },
  { id: "fnb", name: "F&B Service", icon: "🍽️", color: "bg-amber-500" },
  { id: "events", name: "Events", icon: "🎉", color: "bg-purple-500" },
];

const longTermJobs = [
  "Cashier",
  "Barista", 
  "Shawarma maker",
  "Chef",
  "Shopkeeper",
];

export default function WorkerHome() {
  const navigate = useNavigate();
  const [readyToWork, setReadyToWork] = useState(true);
  const [applicationModal, setApplicationModal] = useState<{
    open: boolean;
    gig: typeof mockNearby[0] | null;
    type: "apply" | "queue";
  }>({ open: false, gig: null, type: "apply" });

  const handleApply = (gig: typeof mockNearby[0]) => {
    setApplicationModal({ open: true, gig, type: "apply" });
  };

  const handleJoinQueue = (gig: typeof mockNearby[0]) => {
    setApplicationModal({ open: true, gig, type: "queue" });
  };

  const handleConfirmApplication = () => {
    toast({
      title: applicationModal.type === "apply" ? "Application Submitted" : "Joined Queue",
      description: applicationModal.type === "apply" 
        ? "Your application has been sent to the employer." 
        : "You've been added to the backup queue.",
    });
    setApplicationModal({ open: false, gig: null, type: "apply" });
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Requested",
      description: "Your funds will be transferred within 24 hours.",
    });
  };

  return (
    <WorkerLayout showHeader={false}>
      {/* Custom Header with Stats */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-primary-foreground/70">Good morning,</p>
            <h1 className="text-2xl font-bold">{mockUser.name}</h1>
          </div>
          <Link to="/worker/notifications" className="relative">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full" />
          </Link>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <ReliabilityScore 
              score={mockUser.reliabilityScore} 
              history={mockUser.history}
              size="md"
            />
            <p className="text-xs text-primary-foreground/60 mt-1">Reliability</p>
          </div>
          <div className="text-center">
            <span className="text-xl font-bold">{mockUser.gigsCompleted}</span>
            <p className="text-xs text-primary-foreground/60">Gigs Done</p>
          </div>
          <div className="text-center">
            <span className="text-xl font-bold">{mockUser.avgPay}</span>
            <p className="text-xs text-primary-foreground/60">Avg Pay</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          {mockUser.verified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-info/20 text-xs text-info">
              <BadgeCheck size={12} /> Aadhaar Verified
            </span>
          )}
          {mockUser.groomingCertified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-xs text-success">
              <TrendingUp size={12} /> Grooming Certified
            </span>
          )}
        </div>
      </header>

      <div className="px-4 -mt-4 space-y-6 pb-8">
        {/* Ready Toggle */}
        <Card variant="elevated" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Ready to Work</h3>
              <p className="text-sm text-muted-foreground">Receive gig notifications</p>
            </div>
            <button
              onClick={() => setReadyToWork(!readyToWork)}
              className={cn(
                "w-14 h-8 rounded-full transition-colors relative",
                readyToWork ? "bg-success" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-6 h-6 rounded-full bg-primary-foreground shadow transition-transform",
                  readyToWork ? "left-7" : "left-1"
                )}
              />
            </button>
          </div>
        </Card>

        {/* Wallet Card */}
        <Card variant="mint" className="relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">HZLR Wallet</p>
              <h2 className="text-3xl font-black text-foreground">
                ₹{mockWallet.available.toLocaleString()}
              </h2>
            </div>
            <Wallet size={24} className="text-seafoam" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Pending: ₹{mockWallet.pending.toLocaleString()}
            </p>
        <Button variant="default" size="sm" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Search, label: "Find Gigs", href: "/worker/search" },
            { icon: Calendar, label: "My Gigs", href: "/worker/my-gigs" },
            { icon: User, label: "Profile", href: "/worker/profile" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} to={action.href}>
                <Card variant="outline" className="p-4 text-center hover:bg-secondary/50 transition-colors">
                  <Icon size={24} className="mx-auto mb-2 text-seafoam" />
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Upcoming Gig */}
        {mockUpcoming.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Upcoming</h3>
              <Link to="/worker/my-gigs" className="text-sm text-seafoam font-medium">
                View all
              </Link>
            </div>
            {mockUpcoming.map((gig) => (
              <GigCard
                key={gig.id}
                {...gig}
                status={gig.status}
                onCheckIn={() => navigate("/worker/checkin")}
              />
            ))}
          </div>
        )}

        {/* Find Jobs from Map */}
        <Link to="/worker/search?view=map">
          <Card variant="outline" className="p-0 overflow-hidden group">
            <div className="relative h-32 bg-gradient-to-br from-secondary to-muted">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <MapPin size={18} />
                  Find jobs from maps
                </div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Explore Gigs Categories */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Explore gigs</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {gigCategories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/worker/search?category=${cat.id}`}
                className="flex-shrink-0"
              >
                <Card variant="outline" className="w-28 h-20 p-3 flex flex-col items-center justify-center hover:bg-secondary/50 transition-colors">
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-xs font-medium text-foreground text-center leading-tight">{cat.name}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Available Gigs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Available Near You</h3>
            <Link to="/worker/search" className="text-sm text-seafoam font-medium">
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {mockNearby.map((gig) => (
              <GigCard
                key={gig.id}
                {...gig}
                status="available"
                onApply={() => handleApply(gig)}
                onJoinQueue={() => handleJoinQueue(gig)}
              />
            ))}
          </div>
        </div>

        {/* Classified Ads */}
        <Link to="/worker/classified-ads">
          <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 text-white border-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-amber-400" />
                <h3 className="font-bold text-lg">Classified Ads</h3>
              </div>
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
                Explore classified Ads from companies that offer temporary jobs.
              </p>
              <Button variant="secondary" size="sm" className="font-semibold">
                Show Ads
              </Button>
            </div>
          </Card>
        </Link>

        {/* Long Term Jobs */}
        <Link to="/worker/long-term-jobs">
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-900 to-amber-950 text-white border-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative p-4">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase size={18} className="text-amber-300" />
                <h3 className="font-bold text-lg">Long term jobs</h3>
              </div>
              <ul className="space-y-1 mb-4">
                {longTermJobs.map((job) => (
                  <li key={job} className="text-sm text-amber-100 flex items-center gap-2">
                    <ChevronRight size={14} className="text-amber-400" />
                    {job}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" size="sm" className="font-semibold">
                Explore more
              </Button>
            </div>
          </Card>
        </Link>
      </div>

      {/* Application Modal */}
      {applicationModal.gig && (
        <ApplicationModal
          open={applicationModal.open}
          onOpenChange={(open) => setApplicationModal({ ...applicationModal, open })}
          gig={{
            title: applicationModal.gig.title,
            employer: applicationModal.gig.employer,
            pay: applicationModal.gig.pay,
            date: applicationModal.gig.date,
            distance: applicationModal.gig.distance,
          }}
          type={applicationModal.type}
          onConfirm={handleConfirmApplication}
        />
      )}
    </WorkerLayout>
  );
}
