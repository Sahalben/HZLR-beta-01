import { useParams, Link } from "react-router-dom";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { mockEmployees, mockWorkHistory } from "@/data/mockEmployees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Mail, 
  Star, 
  Heart, 
  HeartOff,
  Shield, 
  Sparkles,
  Calendar,
  Clock,
  Ban,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EmployeeDetail() {
  const { workerId } = useParams();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [notes, setNotes] = useState("");

  const employee = mockEmployees.find((e) => e.id === workerId);
  const workHistory = mockWorkHistory.filter((w) => w.workerId === workerId);

  if (!employee) {
    return (
      <EmployerLayout title="Worker Not Found">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Worker not found</p>
          <Button asChild className="mt-4">
            <Link to="/employer/employees">Back to Employees</Link>
          </Button>
        </div>
      </EmployerLayout>
    );
  }

  const handleInvite = () => {
    toast({ title: "Invite sent", description: `Invited ${employee.name} to a gig` });
  };

  const handleMessage = () => {
    toast({ title: "Message", description: `Opening chat with ${employee.name}` });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favourites" : "Added to favourites",
      description: employee.name,
    });
  };

  const handleSaveNotes = () => {
    toast({ title: "Notes saved", description: "Private notes updated" });
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 80) return "bg-success/10 text-success";
    if (score >= 50) return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "No-show":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  return (
    <EmployerLayout title="Worker Profile">
      <div className="p-6 space-y-6 pb-24 md:pb-6">
        {/* Back Link */}
        <Link to="/employer/employees" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Link>

        {/* Header Card */}
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar & Basic Info */}
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="w-20 h-20 border-2 border-border">
                  <AvatarImage src={employee.photoUrl} alt={employee.name} />
                  <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                    {employee.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
                  <p className="text-sm text-muted-foreground">{employee.hzlrId}</p>

                  <div className="flex flex-wrap gap-2">
                    {/* Reliability Badge */}
                    <Badge className={getReliabilityColor(employee.reliabilityScore)}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {employee.reliabilityScore}% Reliability
                    </Badge>

                    {/* Grooming Badge */}
                    {employee.groomingVerified && (
                      <Badge className="bg-info/10 text-info">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Grooming Certified
                      </Badge>
                    )}

                    {/* Identity Badge */}
                    {employee.identityVerified && (
                      <Badge className="bg-success/10 text-success">
                        <Shield className="w-3 h-3 mr-1" />
                        Aadhaar Verified
                      </Badge>
                    )}
                  </div>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {employee.categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleInvite} className="gap-2">
                  <Mail className="w-4 h-4" />
                  Invite to Job
                </Button>
                <Button variant="outline" onClick={handleMessage} className="gap-2">
                  <Mail className="w-4 h-4" />
                  Message
                </Button>
                <Button
                  variant={isFavorite ? "destructive" : "outline"}
                  onClick={handleToggleFavorite}
                  className="gap-2"
                >
                  {isFavorite ? <HeartOff className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                  {isFavorite ? "Remove Favourite" : "Add Favourite"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { label: "Total Gigs", value: employee.totalGigs, icon: Calendar },
            { label: "Avg Rating", value: `${employee.avgRating}/5`, icon: Star },
            { label: "On-Time %", value: `${employee.onTimePercentage}%`, icon: Clock },
            { label: "Cancellations", value: employee.cancellationCount, icon: Ban },
            { label: "Last Active", value: new Date(employee.lastActiveDate).toLocaleDateString(), icon: Calendar },
            { label: "Total Earned", value: `₹${employee.totalEarned.toLocaleString()}`, icon: TrendingUp },
            { label: "Primary Category", value: employee.preferredCategory, icon: Sparkles },
          ].map((stat) => (
            <Card key={stat.label} variant="glass" className="text-center">
              <CardContent className="p-4">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Work History Timeline */}
          <div className="md:col-span-2">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Work History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {workHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No work history with your company yet.</p>
                ) : (
                  workHistory.map((work) => (
                    <div key={work.id} className="flex gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="flex-shrink-0 pt-1">
                        {getStatusIcon(work.status)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">{work.gigTitle}</h4>
                          <Badge variant={work.status === "Completed" ? "default" : "secondary"}>
                            {work.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{work.role} • {work.category}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(work.date).toLocaleDateString()}</span>
                          <span>₹{work.pay}</span>
                          {work.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-warning fill-warning" />
                              {work.rating}
                            </span>
                          )}
                          {work.punctuality && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {work.punctuality}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reliability Insights & Notes */}
          <div className="space-y-6">
            {/* Reliability Insights */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Reliability Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-medium text-foreground">{employee.onTimePercentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success transition-all"
                      style={{ width: `${employee.onTimePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Punctuality</span>
                    <span className="font-medium text-foreground">{employee.onTimePercentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-info transition-all"
                      style={{ width: `${employee.onTimePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium text-foreground">
                      {Math.round((employee.totalGigs - employee.cancellationCount) / employee.totalGigs * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.round((employee.totalGigs - employee.cancellationCount) / employee.totalGigs * 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Based on {employee.totalGigs} completed gigs
                </p>
              </CardContent>
            </Card>

            {/* Private Notes */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Private Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add private notes about this worker..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button size="sm" onClick={handleSaveNotes} disabled={!notes.trim()}>
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
}
