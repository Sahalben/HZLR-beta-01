import { useState } from "react";
import { MapPin, CheckCircle, Clock, AlertCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { cn } from "@/lib/utils";

// Mock active gig
const mockActiveGig = {
  id: 101,
  title: "Kitchen Staff",
  employer: "Taj Palace",
  address: "Apollo Bunder, Colaba, Mumbai 400001",
  pay: 950,
  startTime: "7:00 AM",
  endTime: "3:00 PM",
  lat: 18.9217,
  lng: 72.8332,
};

type CheckInStatus = "pending" | "checking" | "success" | "out_of_range";

export default function WorkerCheckIn() {
  const [status, setStatus] = useState<CheckInStatus>("pending");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    setStatus("checking");
    
    // Simulate geo-check
    setTimeout(() => {
      // Simulate successful check-in (90% chance)
      if (Math.random() > 0.1) {
        setStatus("success");
        setCheckedIn(true);
        setCheckInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } else {
        setStatus("out_of_range");
      }
    }, 2000);
  };

  const handleCheckOut = () => {
    // Handle checkout
    setCheckedIn(false);
    setStatus("pending");
  };

  return (
    <WorkerLayout title="Check-in">
      <div className="px-4 py-6 space-y-6">
        {/* Gig Info */}
        <Card variant="elevated" className="p-4">
          <h3 className="font-bold text-foreground text-lg mb-1">{mockActiveGig.title}</h3>
          <p className="text-muted-foreground">{mockActiveGig.employer}</p>
          
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={14} />
              <span>{mockActiveGig.address}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={14} />
              <span>{mockActiveGig.startTime} - {mockActiveGig.endTime}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground">Pay</span>
            <span className="text-xl font-bold text-foreground">₹{mockActiveGig.pay}</span>
          </div>
        </Card>

        {/* Check-in Card */}
        <Card 
          variant={checkedIn ? "mint" : "elevated"} 
          className={cn("p-8 text-center", checkedIn && "border-2 border-success")}
        >
          {!checkedIn ? (
            <>
              {/* Check-in button */}
              <div className="mb-6">
                <div className={cn(
                  "w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all",
                  status === "pending" && "bg-primary/10",
                  status === "checking" && "bg-primary/20 animate-pulse",
                  status === "out_of_range" && "bg-destructive/10"
                )}>
                  {status === "pending" && (
                    <Navigation size={48} className="text-primary" />
                  )}
                  {status === "checking" && (
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  {status === "out_of_range" && (
                    <AlertCircle size={48} className="text-destructive" />
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">
                {status === "pending" && "Ready to Check In?"}
                {status === "checking" && "Verifying Location..."}
                {status === "out_of_range" && "Out of Range"}
              </h3>

              <p className="text-sm text-muted-foreground mb-6">
                {status === "pending" && "Make sure you're at the work location"}
                {status === "checking" && "Please wait while we verify your location"}
                {status === "out_of_range" && "You need to be within 100m of the work location"}
              </p>

              <Button 
                size="lg" 
                className="w-full"
                onClick={handleCheckIn}
                disabled={status === "checking"}
              >
                {status === "pending" && "Check In Now"}
                {status === "checking" && "Checking..."}
                {status === "out_of_range" && "Try Again"}
              </Button>

              {status === "out_of_range" && (
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  <MapPin size={14} className="mr-1" />
                  Open in Maps
                </Button>
              )}
            </>
          ) : (
            <>
              {/* Checked in state */}
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle size={48} className="text-success" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">Checked In!</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You checked in at {checkInTime}
              </p>
              <p className="text-sm text-success font-medium mb-6">
                Your shift is in progress
              </p>

              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={handleCheckOut}
              >
                Check Out
              </Button>
            </>
          )}
        </Card>

        {/* Info Card */}
        <Card variant="outline" className="p-4">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-seafoam" />
            Geo-fence Check-in
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• You must be within 100m of the work location</li>
            <li>• Check-in confirms your presence to the employer</li>
            <li>• Payment is released after employer confirms your check-out</li>
          </ul>
        </Card>
      </div>
    </WorkerLayout>
  );
}
