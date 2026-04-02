import { Briefcase, MapPin, Clock, Building, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { Link } from "react-router-dom";

const mockJobs = [
  {
    id: 1,
    title: "Cashier",
    company: "DMart Retail",
    location: "Andheri West, Mumbai",
    salary: "₹18,000 - ₹22,000/month",
    type: "Full-time",
    experience: "0-2 years",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Barista",
    company: "Starbucks India",
    location: "Multiple Locations",
    salary: "₹15,000 - ₹20,000/month",
    type: "Full-time",
    experience: "Freshers welcome",
    posted: "1 day ago",
  },
  {
    id: 3,
    title: "Shawarma Maker",
    company: "Falafel Nation",
    location: "Bandra, Mumbai",
    salary: "₹25,000 - ₹30,000/month",
    type: "Full-time",
    experience: "1-3 years",
    posted: "5 days ago",
  },
  {
    id: 4,
    title: "Chef (Indian Cuisine)",
    company: "The Leela Palace",
    location: "Worli, Mumbai",
    salary: "₹35,000 - ₹50,000/month",
    type: "Full-time",
    experience: "3-5 years",
    posted: "1 week ago",
  },
  {
    id: 5,
    title: "Shopkeeper",
    company: "Reliance Retail",
    location: "Powai, Mumbai",
    salary: "₹16,000 - ₹20,000/month",
    type: "Full-time",
    experience: "0-1 years",
    posted: "3 days ago",
  },
];

export default function LongTermJobs() {
  return (
    <WorkerLayout title="Long Term Jobs">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
            <Briefcase size={24} className="text-amber-100" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Long Term Jobs</h2>
            <p className="text-sm text-muted-foreground">Permanent positions available</p>
          </div>
        </div>

        {/* Info Card */}
        <Card variant="mint" className="p-4">
          <p className="text-sm text-muted-foreground">
            Looking for stability? These are full-time positions with monthly salaries and benefits. Your HZLR reputation helps you stand out!
          </p>
        </Card>

        {/* Job Listings */}
        <div className="space-y-3">
          {mockJobs.map((job) => (
            <Card key={job.id} variant="elevated" className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{job.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building size={12} /> {job.company}
                  </p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {job.location}
                </span>
                <span className="px-2 py-0.5 bg-secondary rounded-full">
                  {job.type}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{job.salary}</p>
                  <p className="text-xs text-muted-foreground">{job.experience}</p>
                </div>
                <span className="text-xs text-muted-foreground">{job.posted}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Apply via HZLR */}
        <Card variant="outline" className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Apply using your HZLR digital resume for better chances!
          </p>
          <Button variant="default" size="sm">
            View Your Resume
          </Button>
        </Card>

        {/* Back to Home */}
        <div className="text-center pt-4">
          <Link to="/worker/home" className="text-sm text-seafoam font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </WorkerLayout>
  );
}
