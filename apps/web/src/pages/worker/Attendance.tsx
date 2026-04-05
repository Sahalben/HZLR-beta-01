import { useState, useEffect } from "react";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, CheckCircle, Calendar, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function WorkerAttendance() {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending">("all");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
         const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
         const res = await fetch(`${API_URL}/api/v1/attendance/my-records`, {
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
         });
         if (res.ok) {
             setRecords(await res.json());
         }
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const filteredRecords = records.filter((record) => {
    if (filter === "all") return true;
    if (filter === "confirmed") return record.status === "confirmed";
    if (filter === "pending") return ["checked_in", "checked_out", "pending_confirmation"].includes(record.status);
    return true;
  });

  // Calculate live dynamic Stats
  const totalGigs = records.length;
  const confirmedGigs = records.filter((r) => r.status === "confirmed").length;
  const onTimeRate = totalGigs > 0 ? Math.round((records.filter((r) => r.latenessMinutes <= 0).length / totalGigs) * 100) : 100;

  const getAttendanceStatusColor = (status: string) => {
    switch(status) {
       case 'confirmed': return 'bg-success/20 text-success';
       case 'checked_in': return 'bg-info/20 text-info';
       case 'absent': return 'bg-destructive/20 text-destructive';
       default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
     return (
       <WorkerLayout title="Attendance History">
          <div className="flex justify-center items-center py-20">
             <Loader2 size={32} className="animate-spin text-muted-foreground" />
          </div>
       </WorkerLayout>
     );
  }

  return (
    <WorkerLayout title="Attendance History">
      <div className="px-4 py-6 space-y-6">
        {/* Live Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="mint" className="p-4 text-center border-0 shadow-md">
            <Calendar className="w-6 h-6 mx-auto text-primary mb-2 opacity-80" />
            <p className="text-2xl font-black text-foreground">{totalGigs}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Total</p>
          </Card>
          <Card variant="mint" className="p-4 text-center border-0 shadow-md">
            <CheckCircle className="w-6 h-6 mx-auto text-status-success mb-2 opacity-80" />
            <p className="text-2xl font-black text-foreground">{confirmedGigs}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Confirmed</p>
          </Card>
          <Card variant="mint" className="p-4 text-center border-0 shadow-md">
            <TrendingUp className="w-6 h-6 mx-auto text-status-info mb-2 opacity-80" />
            <p className="text-2xl font-black text-foreground">{onTimeRate}%</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">On-Time</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "confirmed", "pending"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter(f)}
              className={cn("capitalize font-semibold", filter === f ? "shadow-md" : "")}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Attendance List */}
        <div className="space-y-3 pb-20">
          {filteredRecords.length === 0 ? (
            <Card variant="outline" className="p-8 text-center border-dashed bg-transparent shadow-none mt-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                 <AlertCircle size={28} className="text-muted-foreground/60" />
              </div>
              <p className="text-foreground font-semibold">No attendance records</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed px-4">
                 When you check into a verified gig, your timesheets and geofence locations will appear here securely.
              </p>
            </Card>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id} variant="elevated" className="p-4 overflow-hidden relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-foreground tracking-tight">
                      {record.gigTitle}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar size={12} />
                      {record.scheduledStart ? format(new Date(record.scheduledStart), "MMM d, yyyy") : 'TBD'}
                      <span className="text-muted-foreground/40 mx-1">•</span>
                      {record.employerName}
                    </p>
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider", getAttendanceStatusColor(record.status))}>
                    {record.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-3 rounded-xl border border-border">
                  <div className="flex items-start gap-2.5 text-muted-foreground">
                    <Clock size={16} className="text-seafoam mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Check-in</p>
                      <p className="font-bold text-foreground text-sm">
                        {record.checkinTime ? format(new Date(record.checkinTime), "h:mm a") : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-muted-foreground">
                    <Clock size={16} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Check-out</p>
                      <p className="font-bold text-foreground text-sm">
                        {record.checkoutTime ? format(new Date(record.checkoutTime), "h:mm a") : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <MapPin size={12} className="text-muted-foreground" />
                    {record.distanceFromGig != null ? `${record.distanceFromGig}m offset` : 'GPS Verified'}
                  </span>
                  {record.latenessMinutes !== 0 && (
                    <span
                      className={cn(
                        "font-bold ml-auto",
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
