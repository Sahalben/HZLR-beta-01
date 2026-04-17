import { useState, useEffect } from "react";
import { Clock, MapPin, BadgeCheck, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { GigCard } from "@/components/shared/GigCard";
import { CheckoutModal } from "@/components/shared/CheckoutModal";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function WorkerMyGigs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"upcoming" | "active" | "completed" | "applied">("upcoming");
  const [loading, setLoading] = useState(true);
  
  const [apps, setApps] = useState<{
      upcoming: any[], active: any[], completed: any[], applied: any[]
  }>({ upcoming: [], active: [], completed: [], applied: [] });

  const [checkoutGig, setCheckoutGig] = useState<any | null>(null);

  useEffect(() => {
     const fetchGigs = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || '';
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_URL}/api/v1/applications/worker`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 const data = await res.json();
                 const parsed = { upcoming: [] as any[], active: [] as any[], completed: [] as any[], applied: [] as any[] };

                 data.forEach((app: any) => {
                     if (!app.job) return;
                     const gig = {
                         id: app.id,
                         jobId: app.job.id,
                         title: app.job.title,
                         employer: app.job.employerProfile?.companyName || app.job.employerProfile?.firstName || "Employer",
                         pay: app.job.payPerWorker,
                         date: new Date(app.job.scheduledFor).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
                         status: app.status.toLowerCase(),
                         distance: "Live Network",
                         checkInTime: app.attendance?.checkInTime ? new Date(app.attendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
                     };

                     const isCheckedIn = app.attendance?.status === 'CHECKED_IN';
                     const isCheckedOut = app.attendance?.status === 'CHECKED_OUT';

                     if (app.status === 'COMPLETED' || app.status === 'CANCELLED' || app.status === 'REJECTED') {
                          gig.status = 'completed';
                          parsed.completed.push(gig);
                     } else if (app.status === 'ACCEPTED' || app.status === 'CONFIRMED') {
                          if (isCheckedOut) {
                               gig.status = 'completed';
                               parsed.completed.push(gig);
                          } else if (isCheckedIn) {
                               gig.status = 'active';
                               parsed.active.push(gig);
                          } else {
                               gig.status = 'confirmed';
                               parsed.upcoming.push(gig);
                          }
                     } else if (app.status === 'APPLIED' || app.status === 'QUEUED') {
                          gig.status = 'applied';
                          parsed.applied.push(gig);
                     }
                 });
                 setApps(parsed);
             }
         } catch(e) {
             toast({ title: "Fetch Failed", variant: "destructive" });
         } finally {
             setLoading(false);
         }
     };
     fetchGigs();
  }, [toast]);

  const handleCheckIn = (gigId: string) => {
    // The check in page invokes the camera and handles the QR scan payload generically.
    navigate("/worker/checkin");
  };

  const handleCheckout = (gig: typeof myGigs.active[0]) => {
    setCheckoutGig(gig);
  };

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: apps.upcoming.length },
    { key: "active", label: "Active", count: apps.active.length },
    { key: "completed", label: "Completed", count: apps.completed.length },
    { key: "applied", label: "Applied", count: apps.applied.length },
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
        {loading ? (
             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
            <>
        {activeTab === "upcoming" && (
          <div className="space-y-3">
            {apps.upcoming.length === 0 ? (
              <Card variant="outline" className="p-8 text-center">
                <Clock size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No upcoming gigs</p>
              </Card>
            ) : (
              apps.upcoming.map((gig) => (
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
            {apps.active.length === 0 ? (
              <Card variant="outline" className="p-8 text-center">
                <BadgeCheck size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No active gigs</p>
              </Card>
            ) : (
              apps.active.map((gig) => (
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
                    Checked in at {gig.checkInTime || "Just now"}
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
            {apps.completed.length === 0 ? (
              <Card variant="outline" className="p-8 text-center">
                <CheckCircle size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No completed gigs yet</p>
              </Card>
            ) : (
              apps.completed.map((gig) => (
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
            {apps.applied.length === 0 ? (
              <Card variant="outline" className="p-8 text-center">
                <MapPin size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No pending applications</p>
              </Card>
            ) : (
              apps.applied.map((gig) => (
                <GigCard
                  key={gig.id}
                  {...gig}
                  showActions={false}
                />
              ))
            )}
          </div>
        )}
            </>
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
