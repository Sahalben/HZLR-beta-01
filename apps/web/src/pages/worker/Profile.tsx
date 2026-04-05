import { useState } from "react";
import { Link } from "react-router-dom";
import { User, BadgeCheck, TrendingUp, Clock, Star, Edit2, ChevronRight, Shield, Award, Calendar, AlertTriangle, CheckCircle, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { TicketModal } from "@/components/shared/TicketModal";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function WorkerProfile() {
  const { profile, user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "resume" | "certifications">("overview");

  // Edit State
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editData, setEditData] = useState({
     firstName: profile?.firstName || profile?.full_name?.split(' ')[0] || "",
     lastName: profile?.lastName || profile?.full_name?.split(' ')[1] || "",
     username: profile?.username || "",
     phone: profile?.phone || user?.phone || "",
     address: profile?.address || "",
     education: profile?.education || ""
  });

  // Dynamic Identity Parsing
  const buildFullName = () => {
      if (profile?.firstName) return `${profile.firstName}${profile.lastName ? ' ' + profile.lastName : ''}`;
      if (profile?.full_name) return profile.full_name;
      if (profile?.username) return profile.username;
      if (user?.email) return user.email.split('@')[0];
      return "Worker";
  };

  const fullName = buildFullName();
  const locationString = profile?.address || "Location pending...";
  const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isVerified = !!profile?.aadhaarVerified;
  const isGroomingCertified = !!profile?.groomingCertified;
  
  // Real stats dropping to 0 cleanly for new beta installs
  const reliabilityScore = profile?.reliabilityScore || 0;
  const gigsDone = profile?.totalGigsDone || 0;
  const avgPay = profile?.avgPay || 0;

  // We map completed applications here natively. Zero state by default.
  const resumeTimeline: any[] = []; 

  const handleSaveProfile = async () => {
     setEditSaving(true);
     try {
         await updateProfile({
             username: editData.username,
             firstName: editData.firstName,
             lastName: editData.lastName,
             phone: editData.phone,
             address: editData.address,
             education: editData.education
         } as any);
         toast({ title: 'Profile Updated', description: 'Your identity has been saved securely to the database!' });
         setEditOpen(false);
     } catch (e: any) {
         toast({ title: 'Update Failed', description: e.message || 'Something went wrong', variant: 'destructive'});
     } finally {
         setEditSaving(false);
     }
  };

  return (
    <WorkerLayout title="Profile">
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card variant="elevated" className="p-6 relative overflow-hidden text-white border-0 bg-gradient-to-br from-zinc-800 to-zinc-950">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] opacity-20" />
          <div className="relative flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-seafoam flex items-center justify-center text-zinc-900 text-3xl font-black shadow-lg uppercase">
              {fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold tracking-tight capitalize">{fullName}</h2>
                {isVerified && <BadgeCheck size={18} className="text-info drop-shadow-md" />}
              </div>
              <p className="text-sm text-zinc-300">{locationString}</p>
              <p className="text-xs text-zinc-400 mt-1">Member since {memberSince}</p>
            </div>
            
            {/* Native Edit Modal Trigger */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                  <Edit2 size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95%] rounded-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black">Edit Identity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                   <div className="grid grid-cols-2 gap-3">
                       <div className="space-y-1.5">
                          <Label>First Name</Label>
                          <Input value={editData.firstName} onChange={(e) => setEditData({...editData, firstName: e.target.value})} placeholder="John" />
                       </div>
                       <div className="space-y-1.5">
                          <Label>Last Name</Label>
                          <Input value={editData.lastName} onChange={(e) => setEditData({...editData, lastName: e.target.value})} placeholder="Doe" />
                       </div>
                   </div>
                   <div className="space-y-1.5">
                      <Label>Public Username</Label>
                      <Input value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})} placeholder="john_doe_99" />
                   </div>
                   <div className="space-y-1.5">
                      <Label>Phone Number</Label>
                      <Input value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} placeholder="+91 99999 99999" />
                   </div>
                   <div className="space-y-1.5">
                      <Label>Primary Location (City)</Label>
                      <Input value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} placeholder="Bangalore, Phase 1" />
                   </div>
                   <div className="space-y-1.5">
                      <Label>Highest Education</Label>
                      <Select value={editData.education} onValueChange={(v) => setEditData({...editData, education: v})}>
                         <SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger>
                         <SelectContent>
                             <SelectItem value="high_school">High School</SelectItem>
                             <SelectItem value="diploma">Diploma</SelectItem>
                             <SelectItem value="bachelors">Bachelors Degree</SelectItem>
                             <SelectItem value="masters">Masters Degree</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                   <Button onClick={handleSaveProfile} disabled={editSaving} className="w-full mt-4 font-bold shadow-lg" size="lg">
                       {editSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                       Save Changes
                   </Button>
                </div>
              </DialogContent>
            </Dialog>

          </div>

          {/* Stats Row */}
          <div className="relative grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center text-3xl font-bold tracking-tighter text-seafoam">
                 {reliabilityScore}%
              </div>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Reliability</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{gigsDone}</p>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Gigs Done</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">₹{avgPay}</p>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">Avg Pay</p>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <span className={cn("px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm border", isVerified ? "bg-info/10 text-info border-info/20" : "bg-muted text-muted-foreground border-border")}>
             <Shield size={12} /> {isVerified ? "ID Verified" : "Unverified"}
          </span>
          <span className={cn("px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm border", isGroomingCertified ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border")}>
             <TrendingUp size={12} /> {isGroomingCertified ? "Grooming Pro" : "Basic Worker"}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { key: "overview", label: "Overview" },
            { key: "resume", label: "Work History" },
            { key: "certifications", label: "Credentials" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors border-b-2 hover:bg-secondary/20",
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
        <div className="min-h-[200px]">
        {activeTab === "overview" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Contact Info */}
            <Card variant="elevated" className="p-5 border-0 shadow-md">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                 <User size={18} className="text-seafoam"/> Digital Identity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</span>
                  <span className="text-foreground font-medium">{profile?.phone || user?.phone || "Pending verification"}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</span>
                  <span className="text-foreground font-medium">{user?.email || "No email linked"}</span>
                </div>
                <div className="h-px bg-border my-2" />
               <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Education</span>
                  <span className="text-foreground font-medium">{profile?.education ? profile.education.replace(/_/g, ' ').toUpperCase() : "Details pending"}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card variant="outline" className="divide-y divide-border overflow-hidden">
              <Link to="/worker/my-gigs" className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-seafoam" />
                  <span className="font-bold text-foreground">My Gigs Hub</span>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
              <TicketModal source="profile">
                <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-warning" />
                    <span className="font-bold text-foreground">Support & Tickets</span>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </button>
              </TicketModal>
            </Card>
          </div>
        )}

        {activeTab === "resume" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {resumeTimeline.length === 0 ? (
                <div className="text-center py-12 px-4">
                   <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                       <Briefcase className="text-muted-foreground" size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-foreground mb-2">Blank Slate</h3>
                   <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                       You haven't completed any gigs on the platform yet. Start applying to build your digital resume!
                   </p>
                   <Button variant="default" className="mt-6 shadow-lg font-bold" asChild>
                       <Link to="/worker/search">Find First Gig</Link>
                   </Button>
                </div>
            ) : (
                <div className="space-y-3">
                {resumeTimeline.map((gig, index) => (
                    <Card key={gig.id} variant="elevated" className="p-4 border-l-4 border-l-seafoam">
                    // Map future data here natively
                    </Card>
                ))}
                </div>
            )}
          </div>
        )}

        {activeTab === "certifications" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Aadhaar KYC */}
            <Card variant={isVerified ? "mint" : "outline"} className="p-4 border-0 shadow-md">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                  isVerified ? "bg-white/50 text-seafoam" : "bg-muted text-muted-foreground"
                )}>
                  <Shield size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-foreground tracking-tight">Identity Verification</h4>
                    {isVerified && <CheckCircle size={16} className="text-seafoam" />}
                  </div>
                  <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                    {isVerified 
                      ? "Aadhaar e-KYC passed. Your digital identity is highly trusted across the network." 
                      : "Complete your basic KYC verification to instantly unlock premium payouts."}
                  </p>
                </div>
              </div>
              {!isVerified && (
                <Button variant="default" size="sm" className="mt-4 w-full shadow-lg" asChild>
                  <Link to="/signup/kyc">Verify Identity</Link>
                </Button>
              )}
            </Card>

            {/* Grooming Certification */}
            <Card variant={isGroomingCertified ? "mint" : "outline"} className="p-4 shadow-sm border-dashed">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isGroomingCertified ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                )}>
                  <Award size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-foreground tracking-tight">Grooming Certified</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {isGroomingCertified 
                      ? "You are certified for high-end hospitality interactions." 
                      : "A 10-minute video credential unlocks 2x higher paying gigs."}
                  </p>
                </div>
              </div>
              {!isGroomingCertified && (
                <Button variant="secondary" size="sm" className="mt-4 w-full">
                  Take Course (Free)
                </Button>
              )}
            </Card>
          </div>
        )}
        </div>
      </div>
    </WorkerLayout>
  );
}
