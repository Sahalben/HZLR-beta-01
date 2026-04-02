import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BadgeCheck, TrendingUp, Clock, MapPin, CheckCircle } from "lucide-react";
import { ReliabilityScore } from "./ReliabilityScore";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gig: {
    title: string;
    employer: string;
    pay: number;
    date: string;
    distance?: string;
    spots?: number;
  };
  worker?: {
    name: string;
    reliabilityScore: number;
    verified: boolean;
    groomingCertified: boolean;
    history: {
      completions: number;
      cancellations: number;
      punctualityRate: number;
      averageRating: number;
    };
  };
  onConfirm: () => void;
  type: "apply" | "queue";
}

export function ApplicationModal({
  open,
  onOpenChange,
  gig,
  worker,
  onConfirm,
  type,
}: ApplicationModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = () => {
    setSubmitted(true);
    setTimeout(() => {
      onConfirm();
      onOpenChange(false);
      setSubmitted(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {type === "apply" ? "Application Submitted!" : "Joined Queue!"}
            </h3>
            <p className="text-muted-foreground text-center">
              {type === "apply"
                ? "The employer will review your application shortly."
                : "You're now in the backup queue. We'll notify you when a spot opens."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "apply" ? "Apply for Gig" : "Join Backup Queue"}
          </DialogTitle>
          <DialogDescription>
            {type === "apply"
              ? "Review the details and confirm your application."
              : "Join the queue and get notified when a spot opens."}
          </DialogDescription>
        </DialogHeader>

        <Card variant="mint" className="p-4">
          <h4 className="font-semibold text-foreground">{gig.title}</h4>
          <p className="text-sm text-muted-foreground">{gig.employer}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} /> {gig.date}
            </span>
            {gig.distance && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {gig.distance}
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-foreground mt-3">₹{gig.pay}</p>
        </Card>

        {worker && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Your Profile</p>
            <div className="flex items-center gap-4">
              <ReliabilityScore
                score={worker.reliabilityScore}
                history={worker.history}
                size="md"
              />
              <div className="flex flex-wrap gap-2">
                {worker.verified && (
                  <span className="badge-verified">
                    <BadgeCheck size={12} /> Verified
                  </span>
                )}
                {worker.groomingCertified && (
                  <span className="badge-prefunded">
                    <TrendingUp size={12} /> Grooming
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" className="flex-1" onClick={handleConfirm}>
            {type === "apply" ? "Confirm Application" : "Join Queue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
