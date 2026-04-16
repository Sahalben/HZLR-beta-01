import { useParams, Link, useNavigate } from "react-router-dom";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, Users, Loader2, ChevronRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";

export default function JobManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [roster, setRoster] = useState<any[]>([]);
  const [completing, setCompleting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Poll for Active Shift Roster
  useEffect(() => {
     let interval: any;
     const fetchRoster = async () => {
         try {
             if (job?.status !== 'ACTIVE' && job?.status !== 'IN_PROGRESS') return;
             const API_URL = import.meta.env.VITE_API_URL || '';
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_URL}/api/v1/attendance/employer-records/${id}`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 const data = await res.json();
                 setRoster(data);
             }
         } catch(e) {}
     };

     if (job && (job.status === 'ACTIVE' || job.status === 'IN_PROGRESS')) {
         fetchRoster();
         interval = setInterval(fetchRoster, 30000);
     }
     return () => clearInterval(interval);
  }, [id, job?.status]);

  const handleManualAction = async (attendanceId: string, action: 'checkin' | 'checkout', manualAppId?: string) => {
      try {
          const API_URL = import.meta.env.VITE_API_URL || '';
          const token = localStorage.getItem('token');
          
          if (!attendanceId && manualAppId) {
             // If there is no attendance record yet, the endpoint /manual-confirm/:id expects an attendance ID.
             // But wait! Manual checkin creates it if missing? No, the backend expects an existing attendanceId.
             // This is a gap in standard backend logic. I will ping local backend or just rely on the API.
             // Actually, the API requires attendanceId, so for checkin, the backend might fail if it doesn't exist.
             toast({ title: "Operation Restricted", description: "Worker must scan QR to initiate their first record.", variant: "destructive" });
             return;
          }

          const res = await fetch(`${API_URL}/api/v1/attendance/manual-confirm/${attendanceId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ action })
          });
          if (!res.ok) throw new Error((await res.json()).error);
          toast({ title: "Success", description: "Attendance was overridden manually." });
          
          // trigger immediate refetch
          const freshRes = await fetch(`${API_URL}/api/v1/attendance/employer-records/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          setRoster(await freshRes.json());
      } catch (err: any) {
          toast({ title: "Action Failed", description: err.message, variant: "destructive" });
      }
  };

  const markJobComplete = async () => {
      setCompleting(true);
      try {
          const API_URL = import.meta.env.VITE_API_URL || '';
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/api/v1/jobs/${id}/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error((await res.json()).error);
          toast({ title: "Shift Completed", description: "Escrow funds have been successfully deployed.", className: "bg-emerald-500 text-white" });
          setJob({ ...job, status: "COMPLETED" });
      } catch (err: any) {
          toast({ title: "Failed to Complete", description: err.message, variant: "destructive" });
      } finally {
          setCompleting(false);
      }
  };

  const handleGenerateQR = async () => {
       setQrGenerating(true);
       try {
           const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
           const token = localStorage.getItem('token');
           const res = await fetch(`${API_URL}/api/v1/attendance/qr/${id}`, {
               headers: { Authorization: `Bearer ${token}` }
           });
           if (!res.ok) throw new Error("Failed to generate QR");
           const data = await res.json();
           setQrBase64(data.qrDataUrl);
           setQrOpen(true);
       } catch (err) {
           toast({ title: "Error", description: "Could not generate QR Code", variant: "destructive" });
       } finally {
           setQrGenerating(false);
       }
  };

  const handlePublishDraft = async () => {
       setPublishing(true);
       try {
           const API_URL = import.meta.env.VITE_API_URL || '';
           const token = localStorage.getItem('token');
           const res = await fetch(`${API_URL}/api/v1/jobs/${id}/publish`, {
               method: 'POST',
               headers: { Authorization: `Bearer ${token}` }
           });
           if (!res.ok) throw new Error("Failed to publish draft");
           toast({ title: "Job Published!", description: "Your job is now active on the Worker Feed.", className: "bg-emerald-500 text-white" });
           setJob({ ...job, status: "ACTIVE" });
       } catch (err) {
           toast({ title: "Error", description: "Could not publish draft.", variant: "destructive" });
       } finally {
           setPublishing(false);
       }
  };

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

        {/* Draft Recovery Banner */}
        {job.status === "DRAFT" && (
           <Card className="p-6 border border-warning bg-warning/10 text-center space-y-3">
               <h3 className="font-black text-warning text-lg tracking-tight">Draft Notice</h3>
               <p className="text-sm font-medium text-foreground max-w-md mx-auto">This job bypassed pre-funding and stalled in Draft state. Click underneath to force override and publish the job instantly onto the Worker Feed.</p>
               <Button onClick={handlePublishDraft} disabled={publishing} className="bg-warning hover:bg-warning/80 text-black font-black w-full sm:w-auto">
                   {publishing ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null} Force Publish to Feed
               </Button>
           </Card>
        )}

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
                <h3 className="font-bold text-lg text-foreground tracking-tight flex items-center gap-2">
                   {job.status === "ACTIVE" || job.status === "IN_PROGRESS" ? <Clock className="text-emerald-500" size={20} /> : <Users className="text-primary" size={20} />}
                   {job.status === "ACTIVE" || job.status === "IN_PROGRESS" ? "Live Attendance Roster" : "Applicant Roster"}
                </h3>
                <span className="text-sm font-black text-muted-foreground">{job.filledSpots} / {job.totalSpots} Secured</span>
            </div>

            {(job.status === "ACTIVE" || job.status === "IN_PROGRESS") && (
              <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                 <div className="mb-4">
                    <Button onClick={handleGenerateQR} disabled={qrGenerating} className="w-full sm:w-auto font-bold border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors shadow-lg shadow-emerald-500/20">
                        {qrGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <QrCode className="w-4 h-4 mr-2" />}
                        Generate Gate QR
                    </Button>
                 </div>
                 <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-center">
                    <DialogHeader>
                       <DialogTitle className="text-xl font-black text-center text-white">Scan to Check In</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl mx-auto shadow-2xl shadow-primary/20 print:shadow-none print:w-full print:h-screen print:flex print:items-center print:justify-center">
                       {qrBase64 ? (
                           <>
                             <img src={qrBase64} alt="Job Check-In QR Code" className="w-64 h-64 border-4 border-black rounded shadow-sm" />
                             <p className="mt-6 text-sm font-black text-zinc-900 uppercase tracking-widest text-center mt-2">Workers scan this at arrival</p>
                             <p className="mt-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Valid for 12 hours from generation</p>
                             <Button variant="outline" className="mt-6 print:hidden" onClick={() => window.print()}>Print Poster</Button>
                           </>
                       ) : (
                           <Loader2 className="animate-spin h-8 w-8 text-black" />
                       )}
                    </div>
                 </DialogContent>
              </Dialog>
            )}
            
            <div className="space-y-3">
               {(job.status === "ACTIVE" || job.status === "IN_PROGRESS") ? (
                  // Live Polling Roster Layout
                  roster.length > 0 ? roster.map((app: any) => {
                      const att = app.attendance;
                      const hasCheckedIn = att?.status === 'CHECKED_IN' || att?.status === 'CHECKED_OUT';
                      const hasCheckedOut = att?.status === 'CHECKED_OUT';

                      return (
                         <Card key={app.id} className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500 bg-card">
                            <div>
                                <p className="font-bold text-sm text-foreground">{app.workerProfile?.firstName}</p>
                                {hasCheckedIn ? (
                                   <p className="text-[10px] text-emerald-500 font-mono mt-1">In: {new Date(att.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {hasCheckedOut && ` | Out: ${new Date(att.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}</p>
                                ) : (
                                   <p className="text-[10px] text-muted-foreground font-mono mt-1">Awaiting Scan</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                               {!hasCheckedIn ? (
                                   <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Worker hasn't scanned yet.", description: "Workers must initialize their first QR ping." })}>
                                       Awaiting Drop
                                   </Button>
                               ) : !hasCheckedOut ? (
                                   <Button size="sm" variant="default" className="text-xs font-bold" onClick={() => handleManualAction(att.id, 'checkout', app.id)}>
                                       Confirm Departure
                                   </Button>
                               ) : (
                                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-black rounded flex items-center gap-1"><CheckCircle size={14}/> Complete</span>
                               )}
                            </div>
                         </Card>
                      )
                  }) : (
                     <Card className="p-8 text-center border-dashed bg-secondary/10">
                        <p className="font-medium text-muted-foreground text-sm">No confirmed workers on roster.</p>
                     </Card>
                  )
               ) : (
                  // Standard Applicant Roster
                  job.applications && job.applications.length > 0 ? job.applications.map((app: any) => (
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
                  )
               )}
            </div>
            
            {/* Mark Shift Complete Logic */}
             {(job.status === "ACTIVE" || job.status === "IN_PROGRESS") && roster.length > 0 && (
                <div className="mt-10 border-t border-white/10 pt-6">
                    <p className="text-sm font-bold text-muted-foreground mb-4">Shift Administration</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={markJobComplete} 
                          disabled={completing || roster.some(r => r.attendance?.status !== 'CHECKED_OUT')} 
                          className="bg-emerald-500 hover:bg-emerald-600 text-black font-black w-full"
                        >
                           {completing ? <Loader2 className="animate-spin" /> : <CheckCircle className="mr-2 w-5 h-5"/>} Mark Shift Complete
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                             if(confirm("Warning: Concluding this shift with unchecked out workers forces early payout cutoff. Verify before proceeding!")) {
                                 markJobComplete();
                             }
                          }}
                          disabled={completing || roster.every(r => r.attendance?.status === 'CHECKED_OUT')}
                          className="w-full sm:w-auto shrink-0 font-bold"
                        >
                           Force Override Completion
                        </Button>
                    </div>
                </div>
             )}
        </div>
      </div>
    </EmployerLayout>
  );
}
