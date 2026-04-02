import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gig: {
    title: string;
    employer: string;
    pay: number;
    date: string;
    distance?: string;
  };
  onAccept: () => void;
  onDecline: () => void;
  expiresInSeconds?: number;
}

export function OfferModal({
  open,
  onOpenChange,
  gig,
  onAccept,
  onDecline,
  expiresInSeconds = 300, // 5 minutes
}: OfferModalProps) {
  const [timeLeft, setTimeLeft] = useState(expiresInSeconds);
  const [accepted, setAccepted] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!open) {
      setTimeLeft(expiresInSeconds);
      setAccepted(false);
      setExpired(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, expiresInSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      onAccept();
      onOpenChange(false);
    }, 1500);
  };

  const handleDecline = () => {
    onDecline();
    onOpenChange(false);
  };

  if (accepted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Gig Accepted!</h3>
            <p className="text-muted-foreground text-center">
              You're confirmed for this gig. Don't forget to check in on time!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (expired) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <XCircle size={32} className="text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Offer Expired</h3>
            <p className="text-muted-foreground text-center">
              The offer has been passed to the next worker in the queue.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const progress = (timeLeft / expiresInSeconds) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
            Gig Offer Available!
          </DialogTitle>
          <DialogDescription>
            A spot has opened up. Accept within the time limit to secure your position.
          </DialogDescription>
        </DialogHeader>

        {/* Countdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time remaining</span>
            <span className={`font-mono font-bold ${timeLeft < 60 ? "text-destructive" : "text-foreground"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

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

        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={handleDecline}>
            Decline
          </Button>
          <Button variant="success" className="flex-1" onClick={handleAccept}>
            Accept Gig
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
