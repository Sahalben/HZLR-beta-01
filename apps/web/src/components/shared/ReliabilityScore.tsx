import { useState } from "react";
import { Star, Info, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReliabilityScoreProps {
  score: number;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
  history?: {
    completions: number;
    cancellations: number;
    punctualityRate: number;
    averageRating: number;
  };
}

export function ReliabilityScore({ 
  score, 
  showTooltip = true, 
  size = "md",
  history 
}: ReliabilityScoreProps) {
  const [open, setOpen] = useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-warning";
    return "text-destructive";
  };

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const ScoreDisplay = () => (
    <div className="flex items-center gap-1">
      <Star size={size === "lg" ? 24 : size === "md" ? 18 : 14} className="text-warning" />
      <span className={cn("font-bold", sizeClasses[size], getScoreColor(score))}>
        {score}
      </span>
    </div>
  );

  if (!showTooltip) {
    return <ScoreDisplay />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ScoreDisplay />
          <Info size={14} className="text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="text-warning" size={20} />
            Reliability Score
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Score Display */}
          <div className="text-center py-4">
            <div className={cn("text-6xl font-black", getScoreColor(score))}>
              {score}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {score >= 90 ? "Excellent" : score >= 75 ? "Good" : "Needs Improvement"}
            </p>
          </div>

          {/* How it's calculated */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">How it's calculated:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle size={14} className="text-success" />
                  Completion Rate
                </span>
                <span className="font-medium">40%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={14} className="text-info" />
                  Punctuality
                </span>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Star size={14} className="text-warning" />
                  Ratings
                </span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <XCircle size={14} className="text-destructive" />
                  Cancellation Penalty
                </span>
                <span className="font-medium">-15%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp size={14} className="text-success" />
                  Verification Bonus
                </span>
                <span className="font-medium">+5%</span>
              </div>
            </div>
          </div>

          {/* History if provided */}
          {history && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">Your Stats:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-success/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-success">{history.completions}</p>
                  <p className="text-xs text-muted-foreground">Completions</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-destructive">{history.cancellations}</p>
                  <p className="text-xs text-muted-foreground">Cancellations</p>
                </div>
                <div className="p-3 bg-info/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-info">{history.punctualityRate}%</p>
                  <p className="text-xs text-muted-foreground">On-time Rate</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-warning">{history.averageRating.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
