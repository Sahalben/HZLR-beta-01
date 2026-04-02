import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Download,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ReliabilityScore } from "@/components/shared/ReliabilityScore";
import {
  AttendanceRecord,
  getAttendanceStatusColor,
  getAttendanceStatusLabel,
} from "@/data/mockAttendance";
import { format } from "date-fns";

interface AttendanceTabProps {
  gigId: string;
  records: AttendanceRecord[];
  onConfirm: (recordId: string) => void;
  onMarkAbsent: (recordId: string, notes?: string) => void;
}

export function AttendanceTab({
  gigId,
  records,
  onConfirm,
  onMarkAbsent,
}: AttendanceTabProps) {
  const { toast } = useToast();
  const [notesModal, setNotesModal] = useState<{
    open: boolean;
    recordId: string | null;
    workerName: string;
  }>({ open: false, recordId: null, workerName: "" });
  const [notes, setNotes] = useState("");

  const handleExportCSV = () => {
    const headers = [
      "Worker Name",
      "Check-in Time",
      "Check-out Time",
      "Lateness (min)",
      "Distance (m)",
      "Status",
      "Reliability Score",
    ];
    const rows = records.map((r) => [
      r.workerName,
      r.checkinTime || "N/A",
      r.checkoutTime || "N/A",
      r.latenessMinutes.toString(),
      r.distanceFromGig.toString(),
      getAttendanceStatusLabel(r.status),
      r.reliabilityScore.toString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gig-${gigId}-attendance.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Attendance data has been exported.",
    });
  };

  const handleMarkAbsentWithNotes = () => {
    if (notesModal.recordId) {
      onMarkAbsent(notesModal.recordId, notes);
      setNotesModal({ open: false, recordId: null, workerName: "" });
      setNotes("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          Attendance ({records.length} workers)
        </h3>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download size={14} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card variant="mint" className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">
            {records.filter((r) => r.status === "checked_in").length}
          </p>
          <p className="text-xs text-muted-foreground">Checked In</p>
        </Card>
        <Card variant="mint" className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">
            {records.filter((r) => r.status === "pending_confirmation").length}
          </p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </Card>
        <Card variant="mint" className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">
            {records.filter((r) => r.status === "confirmed").length}
          </p>
          <p className="text-xs text-muted-foreground">Confirmed</p>
        </Card>
        <Card variant="mint" className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">
            {records.filter((r) => r.status === "absent").length}
          </p>
          <p className="text-xs text-muted-foreground">Absent</p>
        </Card>
      </div>

      {/* Table */}
      <Card variant="elevated" className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Lateness</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reliability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No attendance records for this gig
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                        {record.workerName.charAt(0)}
                      </div>
                      <span className="font-medium">{record.workerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-muted-foreground" />
                      {record.checkinTime
                        ? format(new Date(record.checkinTime), "h:mm a")
                        : "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.checkoutTime
                      ? format(new Date(record.checkoutTime), "h:mm a")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-medium text-sm",
                        record.latenessMinutes <= 0
                          ? "text-status-success"
                          : record.latenessMinutes <= 5
                          ? "text-status-warning"
                          : "text-destructive"
                      )}
                    >
                      {record.latenessMinutes === 0
                        ? "On time"
                        : record.latenessMinutes < 0
                        ? `${Math.abs(record.latenessMinutes)}m early`
                        : `${record.latenessMinutes}m late`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin size={12} />
                      {record.distanceFromGig}m
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getAttendanceStatusColor(record.status)
                      )}
                    >
                      {getAttendanceStatusLabel(record.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ReliabilityScore score={record.reliabilityScore} size="sm" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(record.status === "checked_out" ||
                        record.status === "pending_confirmation") && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => onConfirm(record.id)}
                        >
                          <CheckCircle size={12} className="mr-1" />
                          Confirm
                        </Button>
                      )}
                      {record.status !== "confirmed" &&
                        record.status !== "absent" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setNotesModal({
                                open: true,
                                recordId: record.id,
                                workerName: record.workerName,
                              })
                            }
                          >
                            <XCircle size={12} className="mr-1" />
                            Absent
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Notes Modal */}
      <Dialog
        open={notesModal.open}
        onOpenChange={(open) =>
          setNotesModal({ open, recordId: null, workerName: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark {notesModal.workerName} as Absent</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Add notes (optional)
            </label>
            <Textarea
              placeholder="e.g., No-show, did not respond to calls..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setNotesModal({ open: false, recordId: null, workerName: "" })
              }
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleMarkAbsentWithNotes}>
              <XCircle size={14} className="mr-2" />
              Mark Absent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
