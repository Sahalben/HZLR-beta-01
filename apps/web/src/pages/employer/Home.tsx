import { Link, useNavigate } from "react-router-dom";
import { Plus, Users, Briefcase, FileText, Clock, TrendingUp, BadgeCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { useToast } from "@/hooks/use-toast";

const mockStats = {
  activePostings: 3,
  totalHires: 156,
  avgFillRate: "94%",
  avgTimeToFill: "2.4h",
};

const mockPostings = [
  { id: 1, title: "F&B Service Staff", pay: 900, quantity: 5, filled: 3, status: "live", applicants: 12, prefunded: true },
  { id: 2, title: "Kitchen Helper", pay: 750, quantity: 3, filled: 3, status: "filled", applicants: 8, prefunded: true },
];

const mockApplicants = [
  { id: 1, name: "Priya S.", score: 94, gigs: 47, distance: "2.1km", grooming: true, verified: true },
  { id: 2, name: "Rahul M.", score: 91, gigs: 32, distance: "3.4km", grooming: true, verified: true },
];

export default function EmployerHome() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAcceptApplicant = (name: string) => {
    toast({
      title: "Applicant Accepted",
      description: `${name} has been accepted for the gig.`,
    });
  };

  return (
    <EmployerLayout>
      <div className="p-6 space-y-6 pb-24 md:pb-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Postings", value: mockStats.activePostings, icon: Briefcase, colorClass: "text-info" },
            { label: "Total Hires", value: mockStats.totalHires, icon: Users, colorClass: "text-success" },
            { label: "Fill Rate", value: mockStats.avgFillRate, icon: TrendingUp, colorClass: "text-warning" },
            { label: "Avg Fill Time", value: mockStats.avgTimeToFill, icon: Clock, colorClass: "text-pending" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="elevated" className="p-4">
                <Icon size={20} className={stat.colorClass} />
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
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
          <Link to="/employer/postings">
            <Card variant="outline" className="p-4 text-center hover:bg-secondary/50 transition-colors">
              <Users size={24} className="mx-auto mb-2 text-seafoam" />
              <span className="text-sm font-medium text-foreground">View Postings</span>
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
            <Link to="/employer/postings" className="text-sm text-seafoam font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {mockPostings.map((posting) => (
              <Card key={posting.id} variant="elevated" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{posting.title}</h3>
                      {posting.prefunded && <span className="badge-prefunded">Prefunded</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">₹{posting.pay}/worker • {posting.quantity} spots</p>
                  </div>
                  <span className={`badge-${posting.status === "live" ? "prefunded" : "waiting"}`}>
                    {posting.status.charAt(0).toUpperCase() + posting.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{posting.filled}/{posting.quantity} filled</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/employer/postings/${posting.id}`)}>View <ChevronRight size={16} /></Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Applicants</h2>
            <Link to="/employer/postings" className="text-sm text-seafoam font-medium">View all</Link>
          </div>
          <Card variant="elevated" className="divide-y divide-border">
            {mockApplicants.map((applicant) => (
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
                    <p className="text-xs text-muted-foreground">Score: {applicant.score} • {applicant.gigs} gigs</p>
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
