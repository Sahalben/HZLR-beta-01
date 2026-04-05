import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, User, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "worker" | "employer" | null;

const getPasswordStrength = (pass: string) => {
  let score = 0;
  if (!pass) return { score: 0, text: '', color: 'bg-muted' };
  if (pass.length > 7) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score < 2) return { score, text: 'Weak', color: 'bg-destructive' };
  if (score < 4) return { score, text: 'Medium', color: 'bg-yellow-500' };
  return { score, text: 'Strong', color: 'bg-success' };
};

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signupWithEmail } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await signupWithEmail(email, password, role);
      toast({
        title: "Account Created",
        description: "Welcome to HZLR!",
      });
      // Redirect to the precise multi-step profile builder
      if (role === 'employer') {
        navigate("/employer/onboarding");
      } else {
        navigate("/signup/profile");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4">
        {role ? (
          <button onClick={() => setRole(null)} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Roles</span>
          </button>
        ) : (
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </Link>
        )}
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-4xl font-black text-foreground tracking-tight">
                HZLR<span className="text-seafoam">.</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mt-4">
              {role ? "Create Account" : "Get Started"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {role ? "Enter your email and a strong password" : "Choose how you want to use HZLR"}
            </p>
          </div>

          {!role ? (
            <div className="grid md:grid-cols-2 gap-4">
              <Card
                variant="elevated"
                className="p-6 cursor-pointer hover:border-primary hover:border-2 transition-all group"
                onClick={() => setRole("worker")}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">I'm a Worker</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find daily gigs, get paid instantly, and build your digital resume.
                </p>
                <Button variant="default" className="w-full group-hover:bg-emerald-600">
                  Start Working
                  <ArrowRight size={16} />
                </Button>
              </Card>

              <Card
                variant="elevated"
                className="p-6 cursor-pointer hover:border-primary hover:border-2 transition-all group"
                onClick={() => setRole("employer")}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase size={32} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">I'm an Employer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hire verified workers, prefund gigs, and fill positions fast.
                </p>
                <Button variant="default" className="w-full group-hover:bg-blue-600">
                  Start Hiring
                  <ArrowRight size={16} />
                </Button>
              </Card>
            </div>
          ) : (
            <Card variant="elevated" className="p-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Strength Meter */}
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 flex gap-1 h-1.5 rounded-full overflow-hidden bg-muted">
                        <div className={`h-full ${strength.score >= 1 ? strength.color : 'bg-transparent'} w-1/4 transition-colors duration-300`} />
                        <div className={`h-full ${strength.score >= 2 ? strength.color : 'bg-transparent'} w-1/4 transition-colors duration-300`} />
                        <div className={`h-full ${strength.score >= 3 ? strength.color : 'bg-transparent'} w-1/4 transition-colors duration-300`} />
                        <div className={`h-full ${strength.score >= 4 ? strength.color : 'bg-transparent'} w-1/4 transition-colors duration-300`} />
                      </div>
                      <span className={`text-xs font-semibold ${strength.color.replace('bg-', 'text-')}`}>
                        {strength.text}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Retype Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      required
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                    {confirmPassword.length > 0 && password === confirmPassword && (
                      <CheckCircle2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full mt-4"
                  disabled={loading || !email || password.length < 8 || password !== confirmPassword}
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Card>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-seafoam font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
