import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  MapPin,
  Clock,
  Star,
  Bell,
  Search,
  User,
  Home,
  MessageSquare,
  BadgeCheck,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data
const mockUser = {
  name: "Priya Sharma",
  avatar: null,
  reliabilityScore: 94,
  gigsCompleted: 47,
  avgPay: "₹850",
  verified: true,
  groomingCertified: true,
};

const mockWallet = {
  available: 28350,
  pending: 850,
};

const mockGigs = [
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
  {
    id: 3,
    title: "Warehouse Helper",
    employer: "Amazon FC",
    pay: 750,
    date: "Dec 5, 9 AM",
    distance: "8.2km",
    prefunded: true,
    spots: 10,
    grooming: false,
  },
];

const mockUpcoming = [
  {
    id: 101,
    title: "Kitchen Staff",
    employer: "Taj Palace",
    pay: 950,
    date: "Dec 4, 7 AM",
    status: "confirmed",
  },
];

export default function WorkerDashboard() {
  const [readyToWork, setReadyToWork] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-primary-foreground/70">Good morning,</p>
            <h1 className="text-2xl font-bold">{mockUser.name}</h1>
          </div>
          <button className="relative">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full" />
          </button>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={16} className="text-warning" />
              <span className="text-xl font-bold">{mockUser.reliabilityScore}</span>
            </div>
            <p className="text-xs text-primary-foreground/60">Reliability</p>
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

      <div className="px-4 -mt-4 space-y-6">
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
            <Button variant="default" size="sm">
              Withdraw
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Search, label: "Find Gigs", href: "/worker/gigs" },
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
              <Card key={gig.id} variant="elevated" className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{gig.title}</h4>
                    <p className="text-sm text-muted-foreground">{gig.employer}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {gig.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{gig.pay}</p>
                    <span className="badge-prefunded text-xs">Confirmed</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Available Gigs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Available Near You</h3>
            <Link to="/worker/gigs" className="text-sm text-seafoam font-medium">
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {mockGigs.map((gig) => (
              <Card key={gig.id} variant="elevated" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{gig.title}</h4>
                      {gig.prefunded && <span className="badge-prefunded">Prefunded</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{gig.employer}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">₹{gig.pay}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {gig.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {gig.distance}
                  </span>
                  <span>{gig.spots} spots left</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="flex-1">
                    Apply
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Join Queue
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 flex items-center justify-around z-50">
        {[
          { icon: Home, label: "Home", href: "/worker", active: true },
          { icon: Search, label: "Search", href: "/worker/gigs", active: false },
          { icon: MessageSquare, label: "Messages", href: "/worker/messages", active: false },
          { icon: User, label: "Profile", href: "/worker/profile", active: false },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3",
                item.active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
