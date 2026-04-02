import { useState, useMemo } from "react";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployeeFilters } from "@/components/employer/employees/EmployeeFilters";
import { EmployeeTable } from "@/components/employer/employees/EmployeeTable";
import { BulkActionsBar } from "@/components/employer/employees/BulkActionsBar";
import { mockEmployees } from "@/data/mockEmployees";
import { useToast } from "@/hooks/use-toast";

export interface EmployeeFiltersState {
  search: string;
  reliability: string;
  groomingVerified: string;
  identityKyc: string;
  preferredCategory: string;
  lastActive: string;
  locationRadius: string;
  categoryTags: string[];
}

const initialFilters: EmployeeFiltersState = {
  search: "",
  reliability: "all",
  groomingVerified: "all",
  identityKyc: "all",
  preferredCategory: "all",
  lastActive: "all",
  locationRadius: "all",
  categoryTags: [],
};

export default function Employees() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<EmployeeFiltersState>(initialFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((emp) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          emp.name.toLowerCase().includes(searchLower) ||
          emp.phone.includes(filters.search) ||
          emp.hzlrId.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Reliability filter
      if (filters.reliability !== "all") {
        if (filters.reliability === "high" && emp.reliabilityScore < 80) return false;
        if (filters.reliability === "medium" && (emp.reliabilityScore < 50 || emp.reliabilityScore >= 80)) return false;
        if (filters.reliability === "low" && emp.reliabilityScore >= 50) return false;
      }

      // Grooming verified filter
      if (filters.groomingVerified !== "all") {
        if (filters.groomingVerified === "yes" && !emp.groomingVerified) return false;
        if (filters.groomingVerified === "no" && emp.groomingVerified) return false;
      }

      // Identity KYC filter
      if (filters.identityKyc !== "all") {
        if (filters.identityKyc === "verified" && !emp.identityVerified) return false;
        if (filters.identityKyc === "pending" && emp.identityVerified) return false;
      }

      // Category filter
      if (filters.preferredCategory !== "all" && emp.preferredCategory !== filters.preferredCategory) {
        return false;
      }

      // Last active filter
      if (filters.lastActive !== "all") {
        const now = new Date();
        const lastActive = new Date(emp.lastActiveDate);
        const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        if (filters.lastActive === "today" && daysDiff > 0) return false;
        if (filters.lastActive === "7days" && daysDiff > 7) return false;
        if (filters.lastActive === "30days" && daysDiff > 30) return false;
      }

      // Category tags filter
      if (filters.categoryTags.length > 0) {
        const hasMatchingTag = filters.categoryTags.some(tag => emp.categories.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [filters]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredEmployees.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: `${action} action`,
      description: `Applied to ${selectedIds.length} worker(s)`,
    });
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Phone", "HZLR ID", "Reliability", "Total Gigs", "Last Worked", "Category"];
    const rows = filteredEmployees.map((e) => [
      e.name,
      e.phone,
      e.hzlrId,
      e.reliabilityScore.toString(),
      e.totalGigs.toString(),
      e.lastWorkedDate,
      e.preferredCategory,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hzlr-employees.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export complete",
      description: `Exported ${filteredEmployees.length} workers to CSV`,
    });
  };

  return (
    <EmployerLayout title="Employee Management">
      <div className="p-6 space-y-6 pb-24 md:pb-6">
        {/* Filters */}
        <EmployeeFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExportCSV}
          totalCount={filteredEmployees.length}
        />

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedIds.length}
            onAction={handleBulkAction}
            onClear={() => setSelectedIds([])}
          />
        )}

        {/* Employee Table */}
        <EmployeeTable
          employees={filteredEmployees}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
        />
      </div>
    </EmployerLayout>
  );
}
