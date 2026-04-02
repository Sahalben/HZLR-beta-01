import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";

// Mock applicant data
const mockApplicant = {
  id: "1",
  name: "Priya Sharma",
  photo: null,
  phone: "+91 98765 •••••",
  email: "pr•••@gmail.com",
  location: "Bandra West, Mumbai",
  distance: "2.1 km",
  reliabilityScore: 94,
  verified: true,
  groomingCertified: true,
  history: {
    completions: 47,
    cancellations: 2,
    punctualityRate: 96,
    averageRating: 4.8,
  },
  appliedAt: "2 hours ago",
  status: "pending",
  resume: [
    { title: "Kitchen Staff", employer: "Taj Palace", date: "Dec 3, 2024", rating: 5 },
    { title: "F&B Service", employer: "Grand Hyatt", date: "Nov 28, 2024", rating: 5 },
    { title: "Event Setup", employer: "Marriott", date: "Nov 20, 2024", rating: 4 },
    { title: "Banquet Service", employer: "ITC Grand", date: "Nov 15, 2024", rating: 5 },
  ],
};

export default function ApplicantDetail() {
  const { id } = useParams();

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
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-foreground">
              {mockApplicant.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-foreground">{mockApplicant.name}</h2>
                {mockApplicant.verified && (
                  <span className="badge-verified">
                    <BadgeCheck size={12} /> Verified
                  </span>
                )}
                {mockApplicant.groomingCertified && (
                  <span className="badge-prefunded">
                    <TrendingUp size={12} /> Grooming
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {mockApplicant.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> Applied {mockApplicant.appliedAt}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-secondary rounded-xl">
              <ReliabilityScore
                score={mockApplicant.reliabilityScore}
                history={mockApplicant.history}
                size="md"
              />
              <p className="text-xs text-muted-foreground mt-1">Reliability</p>
            </div>
            <div className="text-center p-3 bg-secondary rounded-xl">
              <span className="text-xl font-bold text-foreground">{mockApplicant.history.completions}</span>
              <p className="text-xs text-muted-foreground">Gigs Done</p>
            </div>
            <div className="text-center p-3 bg-secondary rounded-xl">
              <span className="text-xl font-bold text-foreground">{mockApplicant.history.punctualityRate}%</span>
              <p className="text-xs text-muted-foreground">On Time</p>
            </div>
            <div className="text-center p-3 bg-secondary rounded-xl">
              <span className="flex items-center justify-center gap-1 text-xl font-bold text-foreground">
                <Star size={16} className="text-warning" /> {mockApplicant.history.averageRating}
              </span>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </Card>

        {/* Contact Info (Masked) */}
        <Card variant="mint" className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Contact Information</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Full contact details will be revealed after you accept the applicant.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone size={14} /> {mockApplicant.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} /> {mockApplicant.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} /> {mockApplicant.location}
            </div>
          </div>
        </Card>

        {/* Work History */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Briefcase size={18} /> Digital Resume
          </h3>
          <div className="space-y-3">
            {mockApplicant.resume.map((gig, index) => (
              <Card key={index} variant="outline" className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{gig.title}</h4>
                    <p className="text-sm text-muted-foreground">{gig.employer}</p>
                    <p className="text-xs text-muted-foreground mt-1">{gig.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < gig.rating ? "text-warning fill-warning" : "text-muted"}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sticky bottom-20 md:bottom-6 bg-background py-4">
          <Button variant="outline" className="flex-1" size="lg">
            <XCircle size={18} className="mr-2" /> Decline
          </Button>
          <Button variant="success" className="flex-1" size="lg">
            <CheckCircle size={18} className="mr-2" /> Accept
          </Button>
        </div>
      </div>
    </EmployerLayout>
  );
}
