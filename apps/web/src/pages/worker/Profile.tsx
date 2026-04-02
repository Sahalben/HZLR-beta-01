import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  BadgeCheck,
  TrendingUp,
  Clock,
  Star,
  Edit2,
  ChevronRight,
  Shield,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { ReliabilityScore } from "@/components/shared/ReliabilityScore";
import { TicketModal } from "@/components/shared/TicketModal";
import { cn } from "@/lib/utils";

// Mock user data
const mockUser = {
  name: "Priya Sharma",
  phone: "+91 98765 *****",
  email: "priya.s****@gmail.com",
  location: "Mumbai, Maharashtra",
  reliabilityScore: 94,
  verified: true,
  groomingCertified: true,
  memberSince: "March 2024",
  history: {
    completions: 47,
    cancellations: 2,
    punctualityRate: 96,
    averageRating: 4.8,
  },
};

// Mock resume timeline
const resumeTimeline = [
  { id: 1, date: "Dec 3, 2024", employer: "Grand Hyatt", role: "F&B Staff", hours: 6, pay: 900, rating: 5 },
  { id: 2, date: "Dec 1, 2024", employer: "Taj Palace", role: "Kitchen Staff", hours: 8, pay: 1200, rating: 5 },
  { id: 3, date: "Nov 28, 2024", employer: "Marriott", role: "Event Setup", hours: 5, pay: 750, rating: 4 },
  { id: 4, date: "Nov 25, 2024", employer: "ITC Grand", role: "Banquet Service", hours: 7, pay: 1050, rating: 5 },
  { id: 5, date: "Nov 22, 2024", employer: "Grand Hyatt", role: "F&B Staff", hours: 6, pay: 900, rating: 5 },
];

export default function WorkerProfile() {
  const [activeTab, setActiveTab] = useState<"overview" | "resume" | "certifications">("overview");

  return (
    <WorkerLayout title="Profile">
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {mockUser.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">{mockUser.name}</h2>
                {mockUser.verified && <BadgeCheck size={18} className="text-info" />}
              </div>
              <p className="text-sm text-muted-foreground">{mockUser.location}</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {mockUser.memberSince}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Edit2 size={18} />
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <ReliabilityScore 
                score={mockUser.reliabilityScore} 
                history={mockUser.history}
                size="lg"
              />
              <p className="text-xs text-muted-foreground mt-1">Reliability</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{mockUser.history.completions}</p>
              <p className="text-xs text-muted-foreground">Gigs Done</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star size={16} className="text-warning" />
                <span className="text-2xl font-bold text-foreground">{mockUser.history.averageRating}</span>
              </div>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          {mockUser.verified && (
            <span className="badge-verified">
              <BadgeCheck size={12} /> Aadhaar Verified
            </span>
          )}
          {mockUser.groomingCertified && (
            <span className="badge-prefunded">
              <TrendingUp size={12} /> Grooming Certified
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { key: "overview", label: "Overview" },
            { key: "resume", label: "Digital Resume" },
            { key: "certifications", label: "Certifications" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors border-b-2",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card variant="outline" className="divide-y divide-border">
              <Link to="/worker/my-gigs" className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-seafoam" />
                  <span className="font-medium text-foreground">My Gigs</span>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
              <Link to="/worker/queue-status" className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-seafoam" />
                  <span className="font-medium text-foreground">Queue Status</span>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
              <TicketModal source="profile">
                <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-warning" />
                    <span className="font-medium text-foreground">Raise a Ticket</span>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </button>
              </TicketModal>
            </Card>

            {/* Contact Info */}
            <Card variant="elevated" className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Contact Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="text-foreground">{mockUser.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground">{mockUser.email}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "resume" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Work History</h3>
              <span className="text-sm text-muted-foreground">{resumeTimeline.length} gigs completed</span>
            </div>

            <div className="space-y-3">
              {resumeTimeline.map((gig, index) => (
                <Card key={gig.id} variant="elevated" className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={18} className="text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{gig.role}</h4>
                        <span className="text-sm font-bold text-foreground">₹{gig.pay}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{gig.employer}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{gig.date}</span>
                        <span>{gig.hours}h</span>
                        <span className="flex items-center gap-1">
                          <Star size={10} className="text-warning" /> {gig.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certifications" && (
          <div className="space-y-4">
            {/* Grooming Certification */}
            <Card variant={mockUser.groomingCertified ? "mint" : "outline"} className="p-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  mockUser.groomingCertified ? "bg-success/20" : "bg-muted"
                )}>
                  <Award size={24} className={mockUser.groomingCertified ? "text-success" : "text-muted-foreground"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">Grooming Certification</h4>
                    {mockUser.groomingCertified && (
                      <CheckCircle size={16} className="text-success" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockUser.groomingCertified 
                      ? "Certified for hospitality & customer-facing roles" 
                      : "Complete the grooming course to unlock premium gigs"}
                  </p>
                </div>
              </div>
              {!mockUser.groomingCertified && (
                <Button variant="default" size="sm" className="mt-4 w-full">
                  Start Certification
                </Button>
              )}
            </Card>

            {/* Aadhaar KYC */}
            <Card variant={mockUser.verified ? "mint" : "outline"} className="p-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  mockUser.verified ? "bg-info/20" : "bg-muted"
                )}>
                  <Shield size={24} className={mockUser.verified ? "text-info" : "text-muted-foreground"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">Aadhaar Verification</h4>
                    {mockUser.verified && (
                      <CheckCircle size={16} className="text-info" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockUser.verified 
                      ? "Identity verified via e-KYC" 
                      : "Verify your identity to access more gigs"}
                  </p>
                  {!mockUser.verified && (
                    <p className="text-xs text-muted-foreground mt-2">
                      We'll verify your identity using e-KYC. Your raw Aadhaar is never stored.
                    </p>
                  )}
                </div>
              </div>
              {!mockUser.verified && (
                <Button variant="default" size="sm" className="mt-4 w-full">
                  Verify Now
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}
