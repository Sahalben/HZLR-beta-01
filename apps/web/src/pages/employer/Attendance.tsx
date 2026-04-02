import { useState } from "react";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Users,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ReliabilityScore } from "@/components/shared/ReliabilityScore";
import {
  mockAttendanceRecords,
  getAttendanceStatusColor,
  getAttendanceStatusLabel,
  AttendanceRecord,
} from "@/data/mockAttendance";
import { format } from "date-fns";

export default function EmployerAttendance() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gigFilter, setGigFilter] = useState<string>("all");
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);

  const uniqueGigs = Array.from(
    new Set(mockAttendanceRecords.map((r) => r.gigTitle))
  );

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.workerName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    const matchesGig = gigFilter === "all" || record.gigTitle === gigFilter;
    return matchesSearch && matchesStatus && matchesGig;
  });

  // Stats
  const totalToday = records.length;
  const checkedIn = records.filter((r) => r.status === "checked_in").length;
  const pendingConfirmation = records.filter(
    (r) => r.status === "pending_confirmation"
  ).length;
  const absent = records.filter((r) => r.status === "absent").length;

  const handleConfirm = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, status: "confirmed" as const, employerConfirmed: true }
          : r
      )
    );
    toast({
      title: "Attendance Confirmed",
      description: "Worker attendance has been confirmed and payout initiated.",
    });
  };

  const handleMarkAbsent = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId ? { ...r, status: "absent" as const } : r
      )
    );
    toast({
      title: "Marked as Absent",
      description: "Worker has been marked as absent for this gig.",
      variant: "destructive",
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "Worker Name",
      "Gig",
      "Check-in Time",
      "Check-out Time",
      "Lateness (min)",
      "Distance (m)",
      "Status",
      "Reliability Score",
    ];
    const rows = filteredRecords.map((r) => [
      r.workerName,
      r.gigTitle,
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
    a.download = `attendance-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Attendance data has been exported to CSV.",
    });
  };

  return (
    <EmployerLayout title="Attendance">
      <div className="p-6 space-y-6 pb-24 md:pb-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="mint" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalToday}</p>
                <p className="text-xs text-muted-foreground">Total Workers</p>
              </div>
            </div>
          </Card>
          <Card variant="mint" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-info/10">
                <Clock className="w-5 h-5 text-status-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{checkedIn}</p>
                <p className="text-xs text-muted-foreground">Checked In</p>
              </div>
            </div>
          </Card>
          <Card variant="mint" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <FileText className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingConfirmation}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
          <Card variant="mint" className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{absent}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="elevated" className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search workers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={gigFilter} onValueChange={setGigFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by gig" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gigs</SelectItem>
                {uniqueGigs.map((gig) => (
                  <SelectItem key={gig} value={gig}>
                    {gig}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
                <SelectItem value="pending_confirmation">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download size={18} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card variant="elevated" className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Gig</TableHead>
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
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No attendance records found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                          {record.workerName.charAt(0)}
                        </div>
                        <span className="font-medium">{record.workerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.gigTitle}
                    </TableCell>
                    <TableCell>
                      {record.checkinTime
                        ? format(new Date(record.checkinTime), "h:mm a")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {record.checkoutTime
                        ? format(new Date(record.checkoutTime), "h:mm a")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-medium",
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
                      <span className="flex items-center gap-1 text-muted-foreground">
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
                      <div className="flex items-center justify-end gap-2">
                        {(record.status === "checked_out" ||
                          record.status === "pending_confirmation") && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleConfirm(record.id)}
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Confirm
                          </Button>
                        )}
                        {record.status !== "confirmed" &&
                          record.status !== "absent" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAbsent(record.id)}
                            >
                              <XCircle size={14} className="mr-1" />
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
      </div>
    </EmployerLayout>
  );
}
