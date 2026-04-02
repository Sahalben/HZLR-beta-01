import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Users, Briefcase, FileText, Bell, ChevronRight, Clock, TrendingUp, BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Static mock for layout purposes 
const mockStats = {
  avgFillRate: "94%",
  avgTimeToFill: "2.4h",
};

export default function EmployerDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [postings, setPostings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_URL}/api/v1/jobs/employer`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
           const data = await res.json();
           setPostings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const totalHires = postings.reduce((sum, job) => sum + (job.filledSpots || 0), 0);
  const activePostings = postings.filter(j => j.status !== 'COMPLETED').length;
  // Combine all applicants from all jobs
  const recentApplicants = postings.flatMap(j => j.applications || []).slice(0, 3);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-2xl font-black tracking-tight">
              HZLR<span className="text-seafoam">.</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full" />
            </button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/employer/post">
                <Plus size={16} />
                Post Job
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{profile?.company_name || 'My Company'}</h1>
          {(profile as any)?._verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/20 text-xs text-success">
              <BadgeCheck size={12} /> Verified
            </span>
          )}
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Postings", value: activePostings, icon: Briefcase, colorClass: "text-info" },
            { label: "Total Hires", value: totalHires, icon: Users, colorClass: "text-success" },
            { label: "Fill Rate", value: mockStats.avgFillRate, icon: TrendingUp, colorClass: "text-warning" },
            { label: "Avg Fill Time", value: mockStats.avgTimeToFill, icon: Clock, colorClass: "text-pending" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="elevated" className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={20} className={stat.colorClass} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/employer/post">
            <Card variant="mint" className="p-4 text-center hover:scale-[1.02] transition-transform">
              <Plus size={24} className="mx-auto mb-2 text-forest" />
              <span className="text-sm font-semibold text-forest">Post New Job</span>
            </Card>
          </Link>
          <Link to="/employer/applicants">
            <Card variant="outline" className="p-4 text-center hover:bg-secondary/50 transition-colors">
              <Users size={24} className="mx-auto mb-2 text-seafoam" />
              <span className="text-sm font-medium text-foreground">View Applicants</span>
            </Card>
          </Link>
          <Link to="/employer/invoices">
            <Card variant="outline" className="p-4 text-center hover:bg-secondary/50 transition-colors">
              <FileText size={24} className="mx-auto mb-2 text-seafoam" />
              <span className="text-sm font-medium text-foreground">Invoices</span>
            </Card>
          </Link>
        </div>

        {/* Active Postings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Active Postings</h2>
            <Link to="/employer/postings" className="text-sm text-seafoam font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? <p className="text-sm text-muted-foreground p-4">Loading your jobs...</p> : postings.length === 0 ? <p className="text-sm text-muted-foreground p-4">No jobs posted yet. Click 'Post Job' to get started!</p> : postings.map((posting) => (
              <Card key={posting.id} variant="elevated" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{posting.title}</h3>
                      {posting.isPrefunded ? (
                        <span className="badge-prefunded">Prefunded</span>
                      ) : (
                        <span className="badge-pending">Pending Prefund</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      ₹{posting.payPerWorker}/worker • {posting.totalSpots} spots
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        posting.status === "ACTIVE"
                          ? "bg-success/10 text-success"
                          : posting.status === "FILLED"
                          ? "bg-info/10 text-info"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {posting.status === "ACTIVE" && <span className="w-1.5 h-1.5 rounded-full bg-success" />}
                      {posting.status === "DRAFT" ? "Draft" : posting.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{posting.filledSpots || 0}/{posting.totalSpots} filled</span>
                    <span>{posting.applications?.length || 0} applicants</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View <ChevronRight size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Applicants</h2>
            <Link to="/employer/applicants" className="text-sm text-seafoam font-medium">
              View all
            </Link>
          </div>
          <Card variant="elevated" className="divide-y divide-border">
            {recentApplicants.length === 0 ? <p className="text-sm text-muted-foreground p-4">No recent applications.</p> : recentApplicants.map((app: any) => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">
                    {app.workerProfile?.firstName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{(app.workerProfile?.firstName || '') + ' ' + (app.workerProfile?.lastName?.charAt(0) || '') + '.'}</p>
                      {app.workerProfile?.aadhaarVerified && <BadgeCheck size={14} className="text-info" />}
                      {app.workerProfile?.groomingCertified && (
                        <span className="text-xs text-success">Grooming ✓</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Status: {app.status} • Queue: {app.queuePosition || 0} 
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  {app.status === 'APPLIED' && (
                  <Button variant="success" size="sm">
                    Accept
                  </Button>)}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
