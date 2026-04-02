import { useState } from "react";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  CheckCircle,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockWorkerAttendanceHistory,
  getAttendanceStatusColor,
  getAttendanceStatusLabel,
} from "@/data/mockAttendance";
import { format } from "date-fns";

export default function WorkerAttendance() {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending">("all");

  const filteredRecords = mockWorkerAttendanceHistory.filter((record) => {
    if (filter === "all") return true;
    if (filter === "confirmed") return record.status === "confirmed";
    if (filter === "pending")
      return ["checked_in", "checked_out", "pending_confirmation"].includes(
        record.status
      );
    return true;
  });

  // Stats
  const totalGigs = mockWorkerAttendanceHistory.length;
  const confirmedGigs = mockWorkerAttendanceHistory.filter(
    (r) => r.status === "confirmed"
  ).length;
  const onTimeRate = Math.round(
    (mockWorkerAttendanceHistory.filter((r) => r.latenessMinutes <= 0).length /
      totalGigs) *
      100
  );

  return (
    <WorkerLayout title="Attendance History">
      <div className="px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="mint" className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{totalGigs}</p>
            <p className="text-xs text-muted-foreground">Total Gigs</p>
          </Card>
          <Card variant="mint" className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto text-status-success mb-2" />
            <p className="text-2xl font-bold text-foreground">{confirmedGigs}</p>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </Card>
          <Card variant="mint" className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto text-status-info mb-2" />
            <p className="text-2xl font-bold text-foreground">{onTimeRate}%</p>
            <p className="text-xs text-muted-foreground">On-Time</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "confirmed", "pending"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Attendance List */}
        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <Card variant="outline" className="p-8 text-center">
              <AlertCircle
                size={48}
                className="mx-auto text-muted-foreground/30 mb-4"
              />
              <p className="text-muted-foreground">No attendance records found</p>
            </Card>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id} variant="elevated" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {record.gigTitle}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar size={12} />
                      {format(new Date(record.scheduledStart), "MMM d, yyyy")}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getAttendanceStatusColor(record.status)
                    )}
                  >
                    {getAttendanceStatusLabel(record.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={14} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Check-in</p>
                      <p className="font-medium text-foreground">
                        {record.checkinTime
                          ? format(new Date(record.checkinTime), "h:mm a")
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={14} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Check-out</p>
                      <p className="font-medium text-foreground">
                        {record.checkoutTime
                          ? format(new Date(record.checkoutTime), "h:mm a")
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin size={12} />
                    {record.distanceFromGig}m from location
                  </span>
                  {record.latenessMinutes !== 0 && (
                    <span
                      className={cn(
                        "font-medium",
                        record.latenessMinutes <= 0
                          ? "text-status-success"
                          : "text-status-warning"
                      )}
                    >
                      {record.latenessMinutes <= 0
                        ? `${Math.abs(record.latenessMinutes)} min early`
                        : `${record.latenessMinutes} min late`}
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </WorkerLayout>
  );
}
