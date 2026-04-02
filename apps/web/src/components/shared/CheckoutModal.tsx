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
import { CheckCircle, Wallet, Star, TrendingUp } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gig: {
    title: string;
    employer: string;
    pay: number;
  };
  onConfirm: () => void;
}

export function CheckoutModal({ open, onOpenChange, gig, onConfirm }: CheckoutModalProps) {
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");

  const handleCheckout = () => {
    setStep("processing");
    setTimeout(() => setStep("success"), 2000);
  };

  const handleClose = () => {
    onConfirm();
    onOpenChange(false);
    setTimeout(() => setStep("confirm"), 300);
  };

  if (step === "processing") {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              <div className="absolute inset-0 rounded-full border-4 border-t-success animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Processing Checkout...</h3>
            <p className="text-muted-foreground text-center text-sm">
              Verifying work hours and processing payment
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
            {/* Payout Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center animate-pulse-glow">
                <Wallet size={36} className="text-success" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center animate-scale-in animation-delay-200">
                <CheckCircle size={18} className="text-success-foreground" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-1">₹{gig.pay}</h3>
            <p className="text-success font-medium mb-4">Payment Credited!</p>

            <Card variant="mint" className="w-full p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gig</span>
                <span className="text-sm font-medium text-foreground">{gig.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Employer</span>
                <span className="text-sm font-medium text-foreground">{gig.employer}</span>
              </div>
              <hr className="border-border" />
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={14} className="text-success" />
                <span className="text-foreground">Digital Resume Updated</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star size={14} className="text-warning" />
                <span className="text-foreground">Reliability Score +2</span>
              </div>
            </Card>

            <Button variant="default" className="w-full mt-6" onClick={handleClose}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check Out</DialogTitle>
          <DialogDescription>
            Confirm your checkout to receive payment and update your digital resume.
          </DialogDescription>
        </DialogHeader>

        <Card variant="mint" className="p-4">
          <h4 className="font-semibold text-foreground">{gig.title}</h4>
          <p className="text-sm text-muted-foreground">{gig.employer}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">Earnings</span>
            <span className="text-xl font-bold text-foreground">₹{gig.pay}</span>
          </div>
        </Card>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Payment will be credited instantly to your wallet</p>
          <p>• This gig will be added to your digital resume</p>
          <p>• Your reliability score will be updated</p>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="success" className="flex-1" onClick={handleCheckout}>
            Confirm Checkout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
