import { useState, useMemo } from "react";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { EmployeeFilters } from "@/components/employer/employees/EmployeeFilters";
import { EmployeeTable } from "@/components/employer/employees/EmployeeTable";
import { BulkActionsBar } from "@/components/employer/employees/BulkActionsBar";
import { Employee } from "@/data/mockEmployees"; // Using type only
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

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
  const [liveEmployees, setLiveEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [employerType, setEmployerType] = useState("company");

  useEffect(() => {
     const fetchData = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || '';
             const token = localStorage.getItem('token');
             
             const [profRes, empRes] = await Promise.all([
                 fetch(`${API_URL}/api/v1/employers/profile`, { headers: { Authorization: `Bearer ${token}` } }),
                 fetch(`${API_URL}/api/v1/employers/employees`, { headers: { Authorization: `Bearer ${token}` } })
             ]);

             if (profRes.ok) {
                 const profData = await profRes.json();
                 if (profData.employerType) setEmployerType(profData.employerType);
             }

             if (empRes.ok) {
                 const data = await res.json();
                 // Map to required filter syntax
                 const mapped = data.map((w: any) => ({
                    id: w.id,
                    name: w.name,
                    phone: "+91 xxxxx xxxxx", // Obfuscated for initial view until deep open
                    hzlrId: `HZLR-WK-${w.id.slice(-4).toUpperCase()}`,
                    photoUrl: "",
                    reliabilityScore: w.rating * 20, 
                    totalGigs: w.gigsCompletedForMe,
                    lastWorkedDate: new Date(w.joinDate).toISOString().split('T')[0],
                    lastActiveDate: new Date(w.joinDate).toISOString().split('T')[0],
                    groomingVerified: w.verified,
                    identityVerified: w.verified,
                    preferredCategory: w.role,
                    categories: [w.role],
                    avgRating: w.rating,
                    onTimePercentage: 95,
                    cancellationCount: 0,
                    totalEarned: 0
                 }));
                 setLiveEmployees(mapped);
             }
         } catch(e) {
             toast({ title: "Failed to sync pipeline", variant: "destructive" });
         } finally {
             setLoading(false);
         }
     };
     fetchData();
  }, [toast]);

  const filteredEmployees = useMemo(() => {
    return liveEmployees.filter((emp) => {
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
  }, [filters, liveEmployees]);

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
        {loading ? (
           <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
        ) : (
           employerType === "company" ? (
             <>
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
             </>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.length === 0 ? (
                   <div className="col-span-full p-10 text-center text-muted-foreground border rounded-xl border-dashed">No recent hires found.</div>
                ) : (
                   filteredEmployees.map(emp => (
                      <div key={emp.id} className="p-5 border rounded-xl bg-card hover:border-primary/50 transition-colors shadow-sm">
                         <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                              {emp.name.charAt(0)}
                           </div>
                           <div>
                              <h3 className="font-bold text-foreground">{emp.name}</h3>
                              <p className="text-xs text-muted-foreground">{emp.preferredCategory}</p>
                           </div>
                         </div>
                         <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex justify-between border-b border-border/50 pb-2"><span>Reliability</span> <span className="font-medium text-foreground text-success">{emp.reliabilityScore}%</span></div>
                            <div className="flex justify-between border-b border-border/50 pb-2"><span>Total Gigs done for you</span> <span className="font-medium text-foreground">{emp.totalGigs}</span></div>
                            <div className="flex justify-between"><span>Last Worked</span> <span className="font-medium text-foreground">{new Date(emp.lastWorkedDate).toLocaleDateString()}</span></div>
                         </div>
                         <Button variant="outline" className="w-full mt-4 bg-primary/5 border-primary/20 hover:bg-primary hover:text-primary-foreground">
                            View Profile
                         </Button>
                      </div>
                   ))
                )}
             </div>
           )
        )}
      </div>
    </EmployerLayout>
  );
}
