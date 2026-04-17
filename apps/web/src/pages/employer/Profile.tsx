import { useState, useEffect } from "react";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmployerProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    employerType: "individual",
    firstName: "",
    lastName: "",
    companyName: "",
    gstin: "",
    city: "",
    state: ""
  });

  useEffect(() => {
     const fetchProfile = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || '';
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_URL}/api/v1/employers/profile`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 const data = await res.json();
                 setProfile({
                     ...data,
                     employerType: data.employerType || "individual"
                 });
             }
         } catch(e) {} finally { setLoading(false); }
     };
     fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
      setSaving(true);
      try {
           const API_URL = import.meta.env.VITE_API_URL || '';
           const token = localStorage.getItem('token');
           const res = await fetch(`${API_URL}/api/v1/employers/profile`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
               body: JSON.stringify(profile)
           });
           if (!res.ok) throw new Error("Failed to save");
           toast({ title: "Profile Updated", description: "Your details have been saved." });
      } catch(e) {
           toast({ title: "Error", description: "Failed to save profile", variant: "destructive" });
      } finally {
           setSaving(false);
      }
  };

  if (loading) {
      return (
         <EmployerLayout title="Profile Settings">
            <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
         </EmployerLayout>
      );
  }

  return (
    <EmployerLayout title="Profile Settings">
      <div className="p-6 max-w-3xl mx-auto space-y-8 pb-24 md:pb-6">
        
        {/* Type Selector */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Account Type</h2>
            <div className="grid grid-cols-2 gap-4">
                <button
                   onClick={() => setProfile({ ...profile, employerType: "individual" })}
                   className={cn(
                       "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all",
                       profile.employerType === "individual" 
                         ? "border-primary bg-primary/10 text-primary" 
                         : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted"
                   )}
                >
                    <User size={32} />
                    <span className="font-bold">Individual</span>
                </button>

                <button
                   onClick={() => setProfile({ ...profile, employerType: "company" })}
                   className={cn(
                       "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all",
                       profile.employerType === "company" 
                         ? "border-primary bg-primary/10 text-primary" 
                         : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted"
                   )}
                >
                    <Building2 size={32} />
                    <span className="font-bold">Company / Business</span>
                </button>
            </div>
        </div>

        {/* Identity Details */}
        <Card variant="elevated" className="p-6 space-y-6">
            <h2 className="text-xl font-bold tracking-tight border-b border-border pb-4">
                {profile.employerType === 'company' ? 'Business Details' : 'Personal Details'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.employerType === 'company' ? (
                   <>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Company or Store Name</Label>
                        <Input name="companyName" value={profile.companyName || ''} onChange={handleChange} placeholder="e.g. HZLR Events Pvt Ltd" />
                      </div>
                      <div className="space-y-2">
                        <Label>GSTIN</Label>
                        <Input name="gstin" value={profile.gstin || ''} onChange={handleChange} placeholder="15 Digit GSTIN" />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input name="city" value={profile.city || ''} onChange={handleChange} placeholder="e.g. Mumbai" />
                      </div>
                   </>
                ) : (
                   <>
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input name="firstName" value={profile.firstName || ''} onChange={handleChange} placeholder="Enter your first name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input name="lastName" value={profile.lastName || ''} onChange={handleChange} placeholder="Enter your last name" />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input name="city" value={profile.city || ''} onChange={handleChange} placeholder="City of residence" />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input name="state" value={profile.state || ''} onChange={handleChange} placeholder="State" />
                      </div>
                   </>
                )}
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-md font-bold mt-4 shadow-lg shadow-primary/25">
               {saving ? <Loader2 className="animate-spin mr-2" /> : null} Save Configuration
            </Button>
        </Card>

      </div>
    </EmployerLayout>
  );
}
