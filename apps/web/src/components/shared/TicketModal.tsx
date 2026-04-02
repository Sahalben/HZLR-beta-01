import { useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface TicketModalProps {
  children: React.ReactNode;
  source?: "chat" | "gig" | "profile";
  gigId?: number;
  gigTitle?: string;
}

const reasonCodes = [
  { value: "payment", label: "Payment Issue" },
  { value: "no_show", label: "No-show by Employer" },
  { value: "harassment", label: "Harassment" },
  { value: "safety", label: "Safety Concern" },
  { value: "dispute", label: "Work Dispute" },
  { value: "other", label: "Other" },
];

export function TicketModal({ children, source = "profile", gigId, gigTitle }: TicketModalProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Please select a reason",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Report submitted",
      description: "Our moderation team will respond within 2 hours.",
    });
    
    setOpen(false);
    setReason("");
    setDetails("");
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-warning" size={20} />
            Raise a Ticket
          </DialogTitle>
          <DialogDescription>
            Report an issue and our team will help resolve it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {gigTitle && (
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Related Gig</p>
              <p className="font-medium text-foreground">{gigTitle}</p>
            </div>
          )}

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason</label>
            <div className="grid grid-cols-2 gap-2">
              {reasonCodes.map((code) => (
                <button
                  key={code.value}
                  onClick={() => setReason(code.value)}
                  className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                    reason === code.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  {code.label}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Details</label>
            <Textarea
              placeholder="Please describe the issue..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>

          {/* SLA Notice */}
          <div className="flex items-center gap-2 p-3 bg-info/10 rounded-lg">
            <Clock size={16} className="text-info" />
            <p className="text-sm text-muted-foreground">
              Our moderation team will respond within <strong className="text-foreground">2 hours</strong>
            </p>
          </div>

          {/* Submit */}
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
