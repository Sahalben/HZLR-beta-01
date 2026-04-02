import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const reasonCodes = [
  { value: "payment", label: "Payment Issue", icon: "💰" },
  { value: "no_show", label: "No-show by Employer", icon: "🚫" },
  { value: "harassment", label: "Harassment", icon: "⚠️" },
  { value: "safety", label: "Safety Concern", icon: "🛡️" },
  { value: "dispute", label: "Work Dispute", icon: "📋" },
  { value: "other", label: "Other", icon: "📝" },
];

export default function WorkerTicket() {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Please select a reason",
        variant: "destructive",
      });
      return;
    }

    if (!details.trim()) {
      toast({
        title: "Please provide details",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <WorkerLayout title="Raise a Ticket">
        <div className="px-4 py-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Report Submitted</h2>
          <p className="text-muted-foreground mb-8">
            Our moderation team will respond within 2 hours.
          </p>
          <Button variant="default" asChild>
            <a href="/worker/home">Back to Home</a>
          </Button>
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout title="Raise a Ticket">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} className="text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Report an Issue</h2>
            <p className="text-sm text-muted-foreground">
              We take all reports seriously and will help resolve your issue.
            </p>
          </div>
        </div>

        {/* Reason Selection */}
        <Card variant="elevated" className="p-4">
          <label className="text-sm font-medium text-foreground block mb-3">
            What's the issue?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {reasonCodes.map((code) => (
              <button
                key={code.value}
                onClick={() => setReason(code.value)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  reason === code.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <span className="text-2xl mb-2 block">{code.icon}</span>
                <span className="text-sm font-medium text-foreground">{code.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Details */}
        <Card variant="elevated" className="p-4">
          <label className="text-sm font-medium text-foreground block mb-2">
            Tell us more
          </label>
          <Textarea
            placeholder="Please describe the issue in detail. Include dates, names, and any relevant information..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {details.length}/500 characters
          </p>
        </Card>

        {/* SLA Notice */}
        <div className="flex items-center gap-3 p-4 bg-info/10 rounded-xl">
          <Clock size={20} className="text-info shrink-0" />
          <p className="text-sm text-foreground">
            Our moderation team will respond within <strong>2 hours</strong>
          </p>
        </div>

        {/* Submit */}
        <Button 
          size="lg"
          className="w-full" 
          onClick={handleSubmit}
          disabled={submitting || !reason}
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </WorkerLayout>
  );
}
