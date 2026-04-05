import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Users, Briefcase, FileText, Clock, TrendingUp, BadgeCheck, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { useToast } from "@/hooks/use-toast";
import { EmployerLocationMap } from "@/components/employer/EmployerLocationMap";

export default function EmployerHome() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
      activePostings: 0,
      totalHires: 0,
      fillRate: 0,
      avgFillTime: 0,
      jobs: [] as any[],
      activeWorkers: [] as any[],
      applicants: [] as any[]
  });

  useEffect(() => {
     const fetchDashboard = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_URL}/api/v1/employers/dashboard`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 const json = await res.json();
                 setData(json);
             }
         } catch(e) {
             console.error("Dashboard Sync Failed", e);
         } finally {
             setLoading(false);
         }
     };
     fetchDashboard();
  }, []);

  const handleAcceptApplicant = (name: string) => {
    toast({
      title: "Applicant Accepted",
      description: `${name} has been accepted for the gig.`,
    });
  };

  return (
    <EmployerLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 pb-24 md:pb-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-2">
          {[
            { label: "Active Postings", value: data.activePostings, icon: Briefcase, colorClass: "text-info" },
            { label: "Total Hires", value: data.totalHires, icon: Users, colorClass: "text-success" },
            { label: "Fill Rate", value: `${data.fillRate}%`, icon: TrendingUp, colorClass: "text-warning" },
            { label: "Avg Fill Time", value: `${data.avgFillTime}h`, icon: Clock, colorClass: "text-pending" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="elevated" className="p-3 sm:p-4">
                <Icon size={18} className={`${stat.colorClass} sm:w-5 sm:h-5`} />
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 sm:mt-2">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Link to="/employer/post">
            <Card variant="mint" className="p-3 sm:p-4 text-center hover:scale-[1.02] transition-transform">
              <Plus size={20} className="mx-auto mb-1 sm:mb-2 text-forest sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-sm font-semibold text-forest leading-tight">Post Job</span>
            </Card>
          </Link>
          <Link to="/employer/postings">
            <Card variant="outline" className="p-3 sm:p-4 text-center hover:bg-secondary/50 transition-colors">
              <Users size={20} className="mx-auto mb-1 sm:mb-2 text-seafoam sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-sm font-medium text-foreground leading-tight">Postings</span>
            </Card>
          </Link>
          <Link to="/employer/invoices">
            <Card variant="outline" className="p-3 sm:p-4 text-center hover:bg-secondary/50 transition-colors">
              <FileText size={20} className="mx-auto mb-1 sm:mb-2 text-seafoam sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-sm font-medium text-foreground leading-tight">Invoices</span>
            </Card>
          </Link>
        </div>

        {/* Active Postings */}
        <div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-xl font-black text-foreground tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>Live Network</h2>
          </div>
          <EmployerLocationMap activeWorkers={data.activeWorkers} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 mt-6">
            <h2 className="text-lg font-bold text-foreground">Recent Postings</h2>
            <Link to="/employer/postings" className="text-sm text-primary font-bold">View all</Link>
          </div>
          <div className="space-y-3">
            {data.jobs.length === 0 ? (
                <Card className="p-8 text-center border-dashed bg-secondary/10">
                    <p className="text-muted-foreground font-medium mb-3">No active jobs found.</p>
                    <Button onClick={() => navigate('/employer/post')}>Post Your First Job</Button>
                </Card>
            ) : data.jobs.map((posting) => (
              <Card key={posting.id} variant="elevated" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{posting.title}</h3>
                      {posting.type === 'instant' && <span className="badge-prefunded">Urgent</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">₹{posting.payPerWorker}/worker • {posting.spotsNeeded || 0} spots</p>
                  </div>
                  <span className={`px-2 py-1 flex items-center justify-center rounded text-[10px] font-bold uppercase ${posting.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary text-muted-foreground"}`}>
                    {posting.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-bold">{posting.filledSpots} / {posting.spotsNeeded} filled</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/employer/postings/${posting.id}`)}>View <ChevronRight size={16} /></Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Applicants Hook */}
        <div>
          <div className="flex items-center justify-between mb-4 mt-6">
            <h2 className="text-lg font-bold text-foreground">Recent Applicants</h2>
            <Link to="/employer/postings" className="text-sm text-primary font-bold">View all</Link>
          </div>
          <Card variant="elevated" className="divide-y divide-border">
            {data.applicants.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm font-medium">No pending applications at setup stage.</div>
            ) : data.applicants.map((applicant) => (
              <div key={applicant.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">
                    {applicant.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{applicant.name}</p>
                      {applicant.verified && <BadgeCheck size={14} className="text-info" />}
                    </div>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">Applied for {applicant.jobTitle}</p>
                    </div>
                  </div>
                  <Button variant="success" size="sm" onClick={() => handleAcceptApplicant(applicant.name)}>Accept</Button>
                </div>
            ))}
          </Card>
        </div>
      </div>
    </EmployerLayout>
  );
}
