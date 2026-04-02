import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface GeoCheckinButtonProps {
  gigId: string;
  gigTitle: string;
  gigLocation: {
    lat: number;
    lng: number;
    address: string;
    allowedRadius: number;
  };
  scheduledStart: string;
  scheduledEnd: string;
  minShiftHours?: number;
  checkinTime?: string | null;
  status: 'not_started' | 'checked_in' | 'checked_out' | 'pending_confirmation' | 'confirmed';
  onCheckin?: (lat: number, lng: number) => void;
  onCheckout?: (lat: number, lng: number) => void;
}

export function GeoCheckinButton({
  gigId,
  gigTitle,
  gigLocation,
  scheduledStart,
  scheduledEnd,
  minShiftHours = 4,
  checkinTime,
  status,
  onCheckin,
  onCheckout,
}: GeoCheckinButtonProps) {
  const { toast } = useToast();
  const { getCurrentPosition, calculateDistance, loading, error } = useGeolocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  const handleCheckin = async () => {
    setIsProcessing(true);
    const position = await getCurrentPosition();
    
    if (!position) {
      toast({
        title: "Location Required",
        description: error || "Please enable location access to check in.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Calculate distance from gig location
    const R = 6371e3;
    const φ1 = (position.lat * Math.PI) / 180;
    const φ2 = (gigLocation.lat * Math.PI) / 180;
    const Δφ = ((gigLocation.lat - position.lat) * Math.PI) / 180;
    const Δλ = ((gigLocation.lng - position.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = Math.round(R * c);

    setDistance(dist);

    if (dist > gigLocation.allowedRadius) {
      toast({
        title: "Too Far from Location",
        description: `You must be within ${gigLocation.allowedRadius}m of the gig location to check in. Current distance: ${dist}m`,
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Success - call checkin
    onCheckin?.(position.lat, position.lng);
    toast({
      title: "Checked In Successfully",
      description: `You are ${dist}m from ${gigLocation.address}`,
    });
    setIsProcessing(false);
  };

  const handleCheckout = async () => {
    // Check if minimum shift hours have elapsed
    if (checkinTime) {
      const checkinDate = new Date(checkinTime);
      const now = new Date();
      const hoursWorked = (now.getTime() - checkinDate.getTime()) / (1000 * 60 * 60);

      if (hoursWorked < minShiftHours) {
        toast({
          title: "Cannot Check Out Yet",
          description: `Minimum shift is ${minShiftHours} hours. You've worked ${hoursWorked.toFixed(1)} hours.`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);
    const position = await getCurrentPosition();
    
    if (!position) {
      toast({
        title: "Location Required",
        description: error || "Please enable location access to check out.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    onCheckout?.(position.lat, position.lng);
    toast({
      title: "Checked Out Successfully",
      description: "Your attendance is pending employer confirmation.",
    });
    setIsProcessing(false);
  };

  const isLoading = loading || isProcessing;

  // Calculate elapsed time if checked in
  const getElapsedTime = () => {
    if (!checkinTime) return null;
    const checkinDate = new Date(checkinTime);
    const now = new Date();
    const diff = now.getTime() - checkinDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (status === 'confirmed') {
    return (
      <Card variant="mint" className="p-4 border-2 border-status-success">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-status-success" />
          <div>
            <p className="font-semibold text-foreground">Attendance Confirmed</p>
            <p className="text-sm text-muted-foreground">Payment has been processed</p>
          </div>
        </div>
      </Card>
    );
  }

  if (status === 'pending_confirmation' || status === 'checked_out') {
    return (
      <Card variant="mint" className="p-4 border-2 border-status-warning">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-status-warning" />
          <div>
            <p className="font-semibold text-foreground">Pending Confirmation</p>
            <p className="text-sm text-muted-foreground">Waiting for employer to confirm</p>
          </div>
        </div>
      </Card>
    );
  }

  if (status === 'checked_in') {
    return (
      <Card variant="mint" className="p-4 border-2 border-status-info">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-status-info/20">
              <Clock className="w-5 h-5 text-status-info" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Checked In</p>
              <p className="text-sm text-muted-foreground">
                Duration: {getElapsedTime()}
              </p>
            </div>
          </div>
          {distance !== null && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin size={12} /> {distance}m
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Check Out
            </>
          )}
        </Button>
      </Card>
    );
  }

  // Not started
  return (
    <Card variant="mint" className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-primary/10">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{gigLocation.address}</p>
          <p className="text-xs text-muted-foreground">
            Check-in radius: {gigLocation.allowedRadius}m
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleCheckin}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Getting Location...
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 mr-2" />
            Check In
          </>
        )}
      </Button>
    </Card>
  );
}
