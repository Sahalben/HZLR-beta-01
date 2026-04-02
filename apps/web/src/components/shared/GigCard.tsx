import { Clock, MapPin, BadgeCheck, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GigCardProps {
  id: number;
  title: string;
  employer: string;
  pay: number;
  date: string;
  distance?: string;
  prefunded?: boolean;
  spots?: number;
  grooming?: boolean;
  status?: "available" | "applied" | "confirmed" | "active" | "completed";
  onApply?: () => void;
  onJoinQueue?: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  showActions?: boolean;
}

export function GigCard({
  title,
  employer,
  pay,
  date,
  distance,
  prefunded = false,
  spots,
  grooming = false,
  status = "available",
  onApply,
  onJoinQueue,
  onCheckIn,
  onCheckOut,
  showActions = true,
}: GigCardProps) {
  return (
    <Card variant="elevated" className="p-4 transition-all hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground">{title}</h4>
            {prefunded && <span className="badge-prefunded">Prefunded</span>}
            {grooming && (
              <span className="badge-verified">
                <TrendingUp size={10} /> Grooming
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{employer}</p>
        </div>
        <p className="text-lg font-bold text-foreground">₹{pay}</p>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Clock size={12} /> {date}
        </span>
        {distance && (
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {distance}
          </span>
        )}
        {spots !== undefined && <span>{spots} spots left</span>}
      </div>

      {showActions && status === "available" && (
        <div className="flex gap-2">
          <Button variant="default" size="sm" className="flex-1" onClick={onApply}>
            Apply
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onJoinQueue}>
            Join Queue
          </Button>
        </div>
      )}

      {showActions && status === "confirmed" && (
        <div className="flex gap-2">
          <Button variant="success" size="sm" className="flex-1" onClick={onCheckIn}>
            <BadgeCheck size={14} className="mr-1" />
            Check In
          </Button>
        </div>
      )}

      {showActions && status === "active" && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onCheckOut}>
            Check Out
          </Button>
        </div>
      )}

      {status === "applied" && (
        <span className="badge-pending">Application Pending</span>
      )}

      {status === "completed" && (
        <span className="badge-prefunded">Completed</span>
      )}
    </Card>
  );
}
