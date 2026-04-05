import { useParams, Link, useNavigate } from "react-router-dom";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReliabilityScore } from "@/components/shared/ReliabilityScore";
import {
  ArrowLeft,
  BadgeCheck,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Briefcase,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applicantData, setApplicantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
     const fetchDeepProfile = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_URL}/api/v1/jobs/application/${id}`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 const json = await res.json();
                 setApplicantData(json);
             }
         } catch(e) {
             toast({ title: "Fetch failed", description: "Database is unreachable.", variant: "destructive" });
         } finally {
             setLoading(false);
         }
     };
     fetchDeepProfile();
  }, [id, toast]);

  const handleAccept = async () => {
      setAccepting(true);
      try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/api/v1/jobs/application/${id}/accept`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              toast({ title: "Applicant Secured!", description: "They have been allocated to the job and pre-escrow is locked.", className: 'bg-emerald-500 text-white' });
              navigate('/employer/home', { replace: true });
          } else {
              toast({ title: "Conflict", description: "This application cannot be accepted.", variant: 'destructive' });
          }
      } catch(e) {
          toast({ title: "Error", variant: 'destructive' });
      } finally {
          setAccepting(false);
      }
  };

  if (loading) {
      return (
         <EmployerLayout title="Applicant Details">
             <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
         </EmployerLayout>
      )
  }

  if (!applicantData) {
      return (
         <EmployerLayout title="Applicant Details">
             <div className="p-6 text-center text-muted-foreground font-bold font-mono">APPLICATION_NOT_FOUND</div>
         </EmployerLayout>
      )
  }

  const profile = applicantData.workerProfile;
  const user = profile.user;

  return (
    <EmployerLayout title="Applicant Details">
      <div className="p-6 space-y-6 pb-24 md:pb-6">
        {/* Back button */}
        <Link to="/employer/postings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
          <span>Back to Applicants</span>
        </Link>

        {/* Profile Header */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center text-xl sm:text-2xl font-bold text-foreground">
              {(profile.firstName || 'W').charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">{profile.firstName || 'Unknown Worker'}</h2>
                {profile.aadhaarVerified && (
                  <span className="badge-verified">
                    <BadgeCheck size={12} /> Verified
                  </span>
                )}
                {profile.groomingCertified && (
                  <span className="badge-prefunded hidden sm:inline-flex">
                    <TrendingUp size={12} /> Grooming
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1 font-medium bg-secondary/40 px-2 py-1 rounded">
                  <Clock size={12} className="text-primary" /> {new Date(applicantData.appliedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 font-medium bg-secondary/40 px-2 py-1 rounded uppercase tracking-widest text-[9px]">
                   For: {applicantData.job.title}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="text-center p-3 bg-secondary/40 rounded-xl border border-border/50">
              <ReliabilityScore
                score={profile.reliabilityScore}
                history={{ completions: profile.totalGigsDone, cancellations: 0, punctualityRate: 98, averageRating: 4.8 }}
                size="md"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-bold">Reliability</p>
            </div>
            <div className="text-center p-3 bg-secondary/40 rounded-xl border border-border/50 flex flex-col justify-center">
              <span className="text-xl sm:text-2xl font-black text-foreground">{profile.totalGigsDone}</span>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-bold">Gigs Done</p>
            </div>
            <div className="text-center p-3 bg-secondary/40 rounded-xl border border-border/50 flex flex-col justify-center">
              <span className="text-xl sm:text-2xl font-black text-foreground">98%</span>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-bold">On Time</p>
            </div>
            <div className="text-center p-3 bg-secondary/40 rounded-xl border border-border/50 flex flex-col justify-center items-center">
              <span className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-black text-foreground">
                4.8
              </span>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-bold">Avg Rating</p>
            </div>
          </div>
        </Card>

        {/* Contact Info (Masked) */}
        <Card variant="mint" className="p-4 sm:p-5">
          <h3 className="font-semibold text-foreground mb-2 sm:mb-3">Contact Information</h3>
          {applicantData.status === 'ACCEPTED' ? (
              <div className="space-y-3 bg-white p-3 rounded text-zinc-900 shadow-inner">
                 <div className="flex items-center gap-2 text-sm font-bold"><Phone size={14} className="text-seafoam" /> {user.phone}</div>
                 <div className="flex items-center gap-2 text-sm font-bold"><Mail size={14} className="text-seafoam" /> {user.email || 'No email provided'}</div>
              </div>
          ) : (
             <>
                 <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 font-medium">
                     Full contact details are encrypted and will be revealed permanently after you accept this applicant.
                 </p>
                 <div className="space-y-2 opacity-50 blur-[2px] select-none pointer-events-none p-3 bg-secondary pb-4 rounded">
                     <div className="flex items-center gap-2 text-sm font-black"><Phone size={14} /> +91 99999 •••••</div>
                     <div className="flex items-center gap-2 text-sm font-black"><Mail size={14} /> pr••••••@gmail.com</div>
                 </div>
             </>
          )}
        </Card>

        {/* Work History */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Briefcase size={18} className="text-primary" /> Digital Resume
          </h3>
          <div className="space-y-3">
            {profile.applications && profile.applications.length > 0 ? profile.applications.map((app: any) => (
              <Card key={app.id} variant="outline" className="p-4 border-l-4 border-l-primary">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-foreground leading-tight">{app.job.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">{app.job.employerProfile?.companyName || app.job.employerProfile?.firstName}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold bg-secondary/50 inline-block px-2 rounded">
                        {new Date(app.acceptedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black px-2 text-emerald-500">COMPLETED</span>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="p-6 text-center border-dashed border border-border rounded-xl bg-secondary/10 text-muted-foreground font-medium text-sm">
                  First-time worker bridging their resume. Give them a chance!
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {applicantData.status === 'APPLIED' && (
            <div className="flex gap-2 sm:gap-3 sticky bottom-[70px] md:bottom-6 bg-background/80 backdrop-blur-xl py-3 rounded-xl border-t border-border px-1 mt-4">
              <Button disabled={accepting} variant="outline" className="flex-1 border-primary/20 hover:bg-destructive/10 hover:text-destructive" size="lg">
                <XCircle size={18} className="mr-2" /> Decline
              </Button>
              <Button onClick={handleAccept} disabled={accepting} variant="success" className="flex-1 shadow-lg shadow-success/20 font-bold" size="lg">
                {accepting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle size={18} className="mr-2" /> Accept</>}
              </Button>
            </div>
        )}
      </div>
    </EmployerLayout>
  );
}
