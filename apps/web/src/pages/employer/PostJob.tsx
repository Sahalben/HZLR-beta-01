import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/contexts/AuthContext";

const WAGE_FLOORS: Record<string, number> = {
  "hospitality": 200,
  "retail": 180,
  "warehouse": 150,
  "cleaning": 160,
  "security": 170,
  "construction": 150,
  "delivery": 150,
  "driving": 160,
  "other": 150,
};

const CATEGORY_MAP: Record<string, string> = {
  "hospitality": "hospitality",
  "retail": "retail",
  "warehouse": "warehouse",
  "cleaning": "cleaning",
  "security": "security",
  "construction": "construction",
  "delivery": "delivery",
  "driving": "driving",
  "other": "other",
};

const categories = [
  { value: "hospitality", label: "F&B / Hospitality" },
  { value: "retail", label: "Retail / Event Staff" },
  { value: "warehouse", label: "Warehouse / Logistics" },
  { value: "cleaning", label: "Housekeeping / Cleaning" },
  { value: "security", label: "Security" },
  { value: "construction", label: "Construction" },
  { value: "delivery", label: "Delivery" },
  { value: "driving", label: "Driving" },
  { value: "other", label: "Other" },
];

export default function PostJob() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "f&b",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    quantity: 1,
    payPerWorker: 900,
    groomingRequired: false,
  });

  const hours = form.startTime && form.endTime
    ? Math.max(0, (parseInt(form.endTime.split(":")[0]) - parseInt(form.startTime.split(":")[0])))
    : 0;

  const effectiveHourlyRate = hours > 0 ? Math.round(form.payPerWorker / hours) : 0;
  const wageFloor = WAGE_FLOORS[form.category] || 150;
  const belowWageFloor = effectiveHourlyRate > 0 && effectiveHourlyRate < wageFloor;
  const totalPrefund = form.payPerWorker * form.quantity;

  const handleSubmit = async () => {
    if (belowWageFloor || !user) return;
    setLoading(true);
    try {
      const startsAt = form.date && form.startTime
        ? new Date(`${form.date}T${form.startTime}`).toISOString()
        : null;
      const endsAt = form.date && form.endTime
        ? new Date(`${form.date}T${form.endTime}`).toISOString()
        : null;

      const dbCategory = CATEGORY_MAP[form.category] || 'other';

      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/v1/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description || "",
          category: dbCategory,
          address: form.location || "",
          city: "Mumbai",
          state: "Maharashtra",
          latitude: 19.0760,
          longitude: 72.8777,
          payPerWorker: form.payPerWorker,
          totalSpots: form.quantity,
          isPrefunded: true,
          scheduledFor: startsAt || new Date().toISOString(),
          estimatedHours: hours,
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to post job");
      }

      toast({
        title: "Job Posted Successfully",
        description: `Your job "${form.title}" has been posted and prefunded.`,
      });
      navigate("/employer/home");
    } catch (err: any) {
      toast({
        title: "Error posting job",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/employer" className="p-2 -ml-2 hover:bg-primary-foreground/10 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">Post a Job</h1>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Job Details */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Job Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Job Title</label>
              <Input
                placeholder="e.g., F&B Service Staff"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                placeholder="Describe the job responsibilities, requirements, and any special instructions..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin size={14} className="inline mr-1" />
                Location
              </label>
              <Input
                placeholder="e.g., Grand Hyatt, Santacruz East, Mumbai"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Schedule */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Schedule</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar size={14} className="inline mr-1" />
                Date
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Clock size={14} className="inline mr-1" />
                Start Time
              </label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Clock size={14} className="inline mr-1" />
                End Time
              </label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>

          {hours > 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              Duration: {hours} hours
            </p>
          )}
        </Card>

        {/* Workers & Pay */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Workers & Payment</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Users size={14} className="inline mr-1" />
                Number of Workers
              </label>
              <Input
                type="number"
                min={1}
                max={50}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <DollarSign size={14} className="inline mr-1" />
                Pay per Worker (₹)
              </label>
              <Input
                type="number"
                min={100}
                step={50}
                value={form.payPerWorker}
                onChange={(e) => setForm({ ...form, payPerWorker: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Wage Floor Validation */}
          {effectiveHourlyRate > 0 && (
            <div className={`p-4 rounded-xl ${belowWageFloor ? "bg-destructive/10" : "bg-success/10"}`}>
              <div className="flex items-start gap-3">
                {belowWageFloor ? (
                  <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${belowWageFloor ? "text-destructive" : "text-success"}`}>
                    {belowWageFloor ? "Below Wage Floor" : "Meets Wage Floor"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Effective hourly rate: ₹{effectiveHourlyRate}/hr
                    {belowWageFloor && (
                      <span className="block mt-1">
                        Minimum for {form.category.toUpperCase()} category is ₹{wageFloor}/hr
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Grooming Toggle */}
          <div className="flex items-center justify-between mt-4 p-4 rounded-xl bg-secondary/50">
            <div>
              <p className="font-medium text-foreground">Grooming Required</p>
              <p className="text-sm text-muted-foreground">Only show grooming-certified workers</p>
            </div>
            <button
              onClick={() => setForm({ ...form, groomingRequired: !form.groomingRequired })}
              className={`w-12 h-7 rounded-full transition-colors relative ${form.groomingRequired ? "bg-success" : "bg-muted"
                }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${form.groomingRequired ? "left-6" : "left-1"
                  }`}
              />
            </button>
          </div>
        </Card>

        {/* Summary & Prefund */}
        <Card variant="mint" className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Prefund Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pay per worker</span>
              <span className="font-medium text-foreground">₹{form.payPerWorker}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number of workers</span>
              <span className="font-medium text-foreground">× {form.quantity}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-foreground">Total Prefund</span>
              <span className="font-bold text-foreground">₹{totalPrefund.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            This amount will be held in escrow. Workers are paid instantly upon confirmed checkout.
          </p>

          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || belowWageFloor || !form.title || !form.location || !form.date}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              `Prefund & Post Job (₹${totalPrefund.toLocaleString()})`
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
