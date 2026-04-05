import { useParams, Link, useNavigate } from "react-router-dom";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, Users, Loader2, ChevronRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function JobManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchJobDetail = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_URL}/api/v1/jobs/${id}`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 const json = await res.json();
                 setJob(json);
             }
         } catch(e) {
             toast({ title: "Fetch failed", description: "Database is unreachable.", variant: "destructive" });
         } finally {
             setLoading(false);
         }
     };
     fetchJobDetail();
  }, [id, toast]);

  if (loading) {
      return (
         <EmployerLayout title="Manage Job">
             <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
         </EmployerLayout>
      )
  }

  if (!job) {
      return (
         <EmployerLayout title="Manage Job">
             <div className="p-6 text-center text-muted-foreground font-bold font-mono">DATA_LINK_NOT_FOUND</div>
         </EmployerLayout>
      )
  }

  return (
    <EmployerLayout title="Manage Job">
      <div className="p-4 sm:p-6 space-y-6 pb-24 md:pb-6">
        {/* Back Link */}
        <Link to="/employer/postings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to Postings
        </Link>

        {/* Core Job Metrics */}
        <Card variant="elevated" className="p-6">
           <div className="flex justify-between items-start mb-4">
              <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">{job.title}</h1>
                  <span className={`px-2 py-1 mt-2 inline-flex items-center justify-center rounded text-[10px] font-bold uppercase ${job.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary text-muted-foreground"}`}>{job.status}</span>
              </div>
              <div className="text-right">
                  <p className="text-lg font-black text-emerald-500">₹{job.payPerWorker}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Per Worker</p>
              </div>
           </div>

           <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-foreground/80 font-medium">
               <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> {new Date(job.scheduledFor).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
               <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary" /> {job.address || job.city || "Address Obfuscated"}</span>
           </div>
        </Card>

        {/* Accepted / Applied Roster */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground tracking-tight flex items-center gap-2"><Users className="text-primary" size={20} /> Shift Roster</h3>
                <span className="text-sm font-black text-muted-foreground">{job.filledSpots} / {job.totalSpots} Secured</span>
            </div>
            
            <div className="space-y-3">
               {job.applications && job.applications.length > 0 ? job.applications.map((app: any) => (
                  <Card key={app.id} className="p-4 sm:p-5 flex items-center justify-between border-l-4 border-l-primary hover:border-l-warning transition-colors bg-card">
                     <div>
                         <p className="font-bold text-sm sm:text-base text-foreground leading-tight">{app.workerProfile?.firstName || 'Unknown'} {app.workerProfile?.aadhaarVerified && '✓'}</p>
                         <p className="text-[10px] uppercase font-bold tracking-widest mt-1 text-muted-foreground px-2 py-0.5 bg-secondary/50 rounded inline-block">{app.status}</p>
                     </div>
                     <Button size="sm" variant="outline" className="text-xs shrink-0" onClick={() => navigate(`/employer/applicants/${app.id}`)}>
                         Inspect <ChevronRight size={14} className="ml-1" />
                     </Button>
                  </Card>
               )) : (
                  <Card className="p-8 text-center border-dashed bg-secondary/10">
                     <p className="font-medium text-muted-foreground text-sm">No applications synced yet.</p>
                  </Card>
               )}
            </div>
        </div>
      </div>
    </EmployerLayout>
  );
}
