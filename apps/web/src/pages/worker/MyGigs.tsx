import { useState } from "react";
import { Clock, MapPin, BadgeCheck, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { GigCard } from "@/components/shared/GigCard";
import { CheckoutModal } from "@/components/shared/CheckoutModal";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Mock data for worker's gigs
const myGigs = {
  upcoming: [
    {
      id: 101,
      title: "Kitchen Staff",
      employer: "Taj Palace",
      pay: 950,
      date: "Today, 7 AM",
      status: "confirmed" as const,
    },
    {
      id: 102,
      title: "F&B Service",
      employer: "Grand Hyatt",
      pay: 900,
      date: "Tomorrow, 6 PM",
      status: "confirmed" as const,
    },
  ],
  active: [
    {
      id: 103,
      title: "Banquet Service",
      employer: "ITC Grand",
      pay: 1100,
      date: "In Progress",
      status: "active" as const,
      checkInTime: "6:45 PM",
    },
  ],
  completed: [
    {
      id: 104,
      title: "Event Setup",
      employer: "Marriott Convention",
      pay: 1200,
      date: "Dec 3, 2024",
      status: "completed" as const,
    },
    {
      id: 105,
      title: "F&B Staff",
      employer: "Grand Hyatt",
      pay: 900,
      date: "Dec 1, 2024",
      status: "completed" as const,
    },
  ],
  applied: [
    {
      id: 106,
      title: "Warehouse Helper",
      employer: "Amazon FC",
      pay: 750,
      date: "Dec 5, 9 AM",
      distance: "8.2km",
      status: "applied" as const,
    },
  ],
};

export default function WorkerMyGigs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "active" | "completed" | "applied">("upcoming");
  const [checkoutGig, setCheckoutGig] = useState<typeof myGigs.active[0] | null>(null);

  const handleCheckIn = (gigId: number) => {
    navigate("/worker/checkin");
  };

  const handleCheckout = (gig: typeof myGigs.active[0]) => {
    setCheckoutGig(gig);
  };

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: myGigs.upcoming.length },
    { key: "active", label: "Active", count: myGigs.active.length },
    { key: "completed", label: "Completed", count: myGigs.completed.length },
    { key: "applied", label: "Applied", count: myGigs.applied.length },
  ];

  return (
    <WorkerLayout title="My Gigs">
      <div className="px-4 py-6 space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                "flex-shrink-0 py-3 px-4 text-sm font-medium transition-colors border-b-2",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "ml-2 px-2 py-0.5 text-xs rounded-full",
                  activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "upcoming" && (
          <div className="space-y-3">
            {myGigs.upcoming.length === 0 ? (
              <Card variant="outline" className="p-8 text-center">
                <Clock size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No upcoming gigs</p>
              </Card>
            ) : (
              myGigs.upcoming.map((gig) => (
                <GigCard
                  key={gig.id}
                  {...gig}
                  onCheckIn={() => handleCheckIn(gig.id)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "active" && (
          <div className="space-y-3">
            {myGigs.active.length === 0 ? (
              <Card variant="outline" className="p-8 text-center">
                <BadgeCheck size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No active gigs</p>
              </Card>
            ) : (
              myGigs.active.map((gig) => (
                <Card key={gig.id} variant="mint" className="p-4 border-2 border-success">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{gig.title}</h4>
                        <span className="badge-verified">Active</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{gig.employer}</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">₹{gig.pay}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Checked in at {gig.checkInTime}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleCheckout(gig)}
                  >
                    Check Out
                  </Button>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-3">
            {myGigs.completed.length === 0 ? (
              <Card variant="outline" className="p-8 text-center">
                <CheckCircle size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No completed gigs yet</p>
              </Card>
            ) : (
              myGigs.completed.map((gig) => (
                <GigCard
                  key={gig.id}
                  {...gig}
                  showActions={false}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "applied" && (
          <div className="space-y-3">
            {myGigs.applied.length === 0 ? (
              <Card variant="outline" className="p-8 text-center">
                <MapPin size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No pending applications</p>
              </Card>
            ) : (
              myGigs.applied.map((gig) => (
                <GigCard
                  key={gig.id}
                  {...gig}
                  showActions={false}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {checkoutGig && (
        <CheckoutModal
          open={!!checkoutGig}
          onOpenChange={(open) => !open && setCheckoutGig(null)}
          gig={{
            title: checkoutGig.title,
            employer: checkoutGig.employer,
            pay: checkoutGig.pay,
          }}
          onConfirm={() => {
            setCheckoutGig(null);
          }}
        />
      )}
    </WorkerLayout>
  );
}
