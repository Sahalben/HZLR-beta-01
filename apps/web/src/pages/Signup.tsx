import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, User, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "worker" | "employer" | null;

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signupWithEmail } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    try {
      await signupWithEmail(email, password, role);
      toast({
        title: "Account Created",
        description: "Welcome to HZLR!",
      });
      navigate(role === "worker" ? "/worker/home" : "/employer/home");
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
              {role ? "Enter your email and password" : "Choose how you want to use HZLR"}
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
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full mt-4"
                  disabled={loading || !email || password.length < 8}
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
