import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EmployerPostings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postings, setPostings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchPostings = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_URL}/api/v1/jobs/employer`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 const json = await res.json();
                 setPostings(json);
             }
         } catch(e) {
             toast({ title: "Fetch failed", description: "Database is unreachable.", variant: "destructive" });
         } finally {
             setLoading(false);
         }
     };
     fetchPostings();
  }, []);
  
  return (
    <EmployerLayout title="Job Postings">
      <div className="p-4 sm:p-6 space-y-4 pb-24 md:pb-6">
        <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border/50">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{postings.length} Active Listings</p>
          <Button asChild className="h-9"><Link to="/employer/post"><Plus size={16} className="mr-1" /> New Posting</Link></Button>
        </div>
        
        {loading ? (
             <div className="flex justify-center items-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : postings.length === 0 ? (
             <Card className="p-8 text-center border-dashed bg-secondary/10">
                 <p className="text-muted-foreground font-medium mb-3">You don't have any job postings yet.</p>
                 <Button onClick={() => navigate('/employer/post')}>Post Your First Job</Button>
             </Card>
        ) : postings.map((posting) => (
          <Card key={posting.id} variant="elevated" className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground">{posting.title}</h3>
                  {posting.isPrefunded ? <span className="badge-prefunded">Prefunded</span> : <span className="badge-pending">Pending</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">₹{posting.payPerWorker}/worker • {posting.totalSpots} spots • {new Date(posting.scheduledFor).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 flex items-center justify-center rounded text-[10px] font-bold uppercase ${posting.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary text-muted-foreground"}`}>
                {posting.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 bg-secondary/20 p-2 rounded-lg">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground break-words w-2/3">{posting.filledSpots}/{posting.totalSpots} filled • {posting.applications?.length || 0} applicants</span>
              <Button variant="default" size="sm" onClick={() => navigate(`/employer/postings/${posting.id}`)} className="text-xs">Manage <ChevronRight size={14} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </EmployerLayout>
  );
}
