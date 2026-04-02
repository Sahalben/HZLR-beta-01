import { useState, useEffect } from "react";
import { Search as SearchIcon, Filter, MapPin, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { GigCard } from "@/components/shared/GigCard";
import { ApplicationModal } from "@/components/shared/ApplicationModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface Job {
  id: string;
  title: string;
  employer_id: string;
  description: string | null;
  category: string;
  address: string | null;
  pay_per_hour: number;
  guaranteed_hours: number;
  total_pay: number;
  qty_needed: number;
  qty_filled: number;
  status: string;
  prefunded: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

const categories = [
  { value: "all", label: "All" },
  { value: "hospitality", label: "Hospitality" },
  { value: "retail", label: "Retail" },
  { value: "warehouse", label: "Warehouse" },
  { value: "delivery", label: "Delivery" },
  { value: "construction", label: "Construction" },
  { value: "security", label: "Security" },
];

export default function WorkerSearch() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"apply" | "queue">("apply");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/v1/jobs`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed");
      setJobs(data || []);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
    }
    setLoading(false);
  };

  const filteredJobs = jobs.filter((job) => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(job.address || '').toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (category !== "all" && job.category !== category) {
      return false;
    }
    return true;
  });

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setModalType("apply");
    setModalOpen(true);
  };

  const handleJoinQueue = (job: Job) => {
    setSelectedJob(job);
    setModalType("queue");
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (!selectedJob || !user) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/v1/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          jobId: selectedJob.id,
          workerProfileId: user.id || "anonymous_user",
          status: "APPLIED"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast({
        title: modalType === "apply" ? "Application Submitted" : "Joined Backup Queue",
        description: `You have ${modalType === "apply" ? "applied for" : "joined the queue for"} ${selectedJob.title}.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not submit application",
        variant: "destructive",
      });
    }
    setModalOpen(false);
  };

  const activeFiltersCount = [category !== "all"].filter(Boolean).length;

  const formatJobDate = (startsAt: string | null) => {
    if (!startsAt) return "Flexible";
    try {
      return format(new Date(startsAt), "MMM d, h:mm a");
    } catch {
      return "Flexible";
    }
  };

  return (
    <WorkerLayout title="Find Gigs">
      <div className="px-4 py-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter size={18} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card variant="elevated" className="p-4 space-y-4 animate-fade-up">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-full transition-colors",
                      category === cat.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCategory("all")} className="w-full">
                <X size={14} className="mr-1" /> Clear filters
              </Button>
            )}
          </Card>
        )}

        {/* Results */}
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${filteredJobs.length} gig${filteredJobs.length !== 1 ? "s" : ""} found`}
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <GigCard
                key={job.id}
                id={typeof job.id === 'string' ? 0 : Number(job.id)}
                title={job.title}
                employer={job.address || "Location TBD"}
                pay={Math.round(job.total_pay / 100)}
                date={formatJobDate(job.starts_at)}
                distance=""
                prefunded={job.prefunded}
                spots={job.qty_needed - job.qty_filled}
                grooming={false}
                status="available"
                onApply={() => handleApply(job)}
                onJoinQueue={() => handleJoinQueue(job)}
              />
            ))}
          </div>
        )}

        {selectedJob && (
          <ApplicationModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            type={modalType}
            gig={{
              title: selectedJob.title,
              employer: selectedJob.address || "Location TBD",
              pay: Math.round(selectedJob.total_pay / 100),
              date: formatJobDate(selectedJob.starts_at),
              distance: "",
              spots: selectedJob.qty_needed - selectedJob.qty_filled,
            }}
            onConfirm={handleModalConfirm}
          />
        )}

        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No gigs available right now</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setSearchQuery(""); setCategory("all"); }}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}
