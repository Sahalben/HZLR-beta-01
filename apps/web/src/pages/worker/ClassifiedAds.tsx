import { Sparkles, MapPin, Clock, ChevronRight, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { Link } from "react-router-dom";

const mockAds = [
  {
    id: 1,
    title: "Background Actors Needed",
    company: "Dharma Productions",
    location: "Film City, Mumbai",
    duration: "3 days",
    pay: "₹2,500/day",
    type: "Film",
    featured: true,
  },
  {
    id: 2,
    title: "Event Hostesses",
    company: "Wizcraft Events",
    location: "BKC, Mumbai",
    duration: "1 day",
    pay: "₹3,000",
    type: "Event",
    featured: true,
  },
  {
    id: 3,
    title: "Product Demonstration Staff",
    company: "Samsung India",
    location: "Multiple Malls",
    duration: "Weekend",
    pay: "₹1,200/day",
    type: "Promo",
    featured: false,
  },
  {
    id: 4,
    title: "Trade Show Representatives",
    company: "Auto Expo 2025",
    location: "Pragati Maidan, Delhi",
    duration: "5 days",
    pay: "₹2,000/day + Travel",
    type: "Event",
    featured: false,
  },
];

export default function ClassifiedAds() {
  return (
    <WorkerLayout title="Classified Ads">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Classified Ads</h2>
            <p className="text-sm text-muted-foreground">Temporary jobs from companies</p>
          </div>
        </div>

        {/* Featured Ads */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Featured</h3>
          <div className="space-y-3">
            {mockAds.filter(ad => ad.featured).map((ad) => (
              <Card key={ad.id} variant="elevated" className="p-4 border-l-4 border-l-amber-500">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{ad.title}</h4>
                      <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                        {ad.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{ad.company}</p>
                  </div>
                  <span className="text-lg font-bold text-foreground">{ad.pay}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {ad.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {ad.duration}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Details <ExternalLink size={14} className="ml-1" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* All Ads */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">All Ads</h3>
          <div className="space-y-3">
            {mockAds.filter(ad => !ad.featured).map((ad) => (
              <Card key={ad.id} variant="outline" className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{ad.title}</h4>
                      <span className="px-2 py-0.5 text-xs bg-secondary text-foreground rounded-full">
                        {ad.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{ad.company}</p>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {ad.location}
                  </span>
                  <span className="font-medium text-foreground">{ad.pay}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

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
