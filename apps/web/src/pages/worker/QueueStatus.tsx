import { useState, useEffect } from "react";
import { Clock, MapPin, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkerLayout } from "@/components/worker/WorkerLayout";

// Mock queue data
const mockQueues = [
  {
    id: 1,
    gigTitle: "F&B Staff",
    employer: "Grand Hyatt",
    date: "Today, 6 PM",
    pay: 900,
    position: 3,
    totalInQueue: 8,
    estimatedWait: "~2 hours",
    status: "waiting",
  },
  {
    id: 2,
    gigTitle: "Event Setup",
    employer: "Marriott Convention",
    date: "Tomorrow, 8 AM",
    pay: 1200,
    position: 1,
    totalInQueue: 5,
    estimatedWait: "Next in line",
    status: "next",
  },
];

// Mock offer data
const mockOffer = {
  id: 101,
  gigTitle: "Kitchen Staff",
  employer: "Taj Palace",
  date: "Dec 5, 7 AM",
  pay: 950,
  expiresIn: 300, // 5 minutes in seconds
};

export default function WorkerQueueStatus() {
  const [offer, setOffer] = useState(mockOffer);
  const [timeLeft, setTimeLeft] = useState(offer.expiresIn);

  // Countdown timer for offer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAcceptOffer = () => {
    // Handle accept
    setOffer(null as any);
  };

  const handleDeclineOffer = () => {
    // Handle decline
    setOffer(null as any);
  };

  return (
    <WorkerLayout title="Queue Status">
      <div className="px-4 py-6 space-y-6">
        {/* Active Offer */}
        {offer && timeLeft > 0 && (
          <Card variant="mint" className="p-6 border-2 border-success animate-pulse-glow">
            <div className="flex items-center justify-between mb-4">
              <span className="badge-prefunded">Offer Available</span>
              <div className="flex items-center gap-2 text-foreground">
                <Clock size={16} className="text-warning" />
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1">{offer.gigTitle}</h3>
            <p className="text-muted-foreground mb-4">{offer.employer}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {offer.date}
              </span>
              <span className="font-bold text-foreground">₹{offer.pay}</span>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="success" 
                className="flex-1"
                onClick={handleAcceptOffer}
              >
                Accept Offer
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleDeclineOffer}
              >
                Decline
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              <AlertCircle size={12} className="inline mr-1" />
              Offer expires automatically. Next worker will be notified.
            </p>
          </Card>
        )}

        {/* Current Queues */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Your Queue Positions</h3>
          
          {mockQueues.length === 0 ? (
            <Card variant="outline" className="p-8 text-center">
              <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">You're not in any queues</p>
              <Button variant="default" size="sm" className="mt-4" asChild>
                <a href="/worker/search">Find Gigs</a>
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {mockQueues.map((queue) => (
                <Card key={queue.id} variant="elevated" className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{queue.gigTitle}</h4>
                      <p className="text-sm text-muted-foreground">{queue.employer}</p>
                    </div>
                    <span className="text-lg font-bold text-foreground">₹{queue.pay}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {queue.date}
                    </span>
                  </div>

                  {/* Queue Position Indicator */}
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Your position</span>
                      <span className={`font-bold text-lg ${
                        queue.status === "next" ? "text-success" : "text-foreground"
                      }`}>
                        #{queue.position}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-success rounded-full transition-all"
                        style={{ 
                          width: `${((queue.totalInQueue - queue.position + 1) / queue.totalInQueue) * 100}%` 
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={10} /> {queue.totalInQueue} in queue
                      </span>
                      <span className={queue.status === "next" ? "text-success font-medium" : ""}>
                        {queue.estimatedWait}
                      </span>
                    </div>
                  </div>

                  {queue.status === "next" && (
                    <p className="text-xs text-success text-center mt-3 font-medium">
                      You're next! Stay ready for the offer.
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* How it works */}
        <Card variant="outline" className="p-4">
          <h4 className="font-semibold text-foreground mb-3">How the Queue Works</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              When a spot opens, top-ranked workers get a 5-minute offer
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              If not accepted, it auto-advances to the next person
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              Ranking is based on reliability score and distance
            </li>
          </ul>
        </Card>
      </div>
    </WorkerLayout>
  );
}
