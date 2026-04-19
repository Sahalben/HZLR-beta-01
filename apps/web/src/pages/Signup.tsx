import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Loader2, CheckCircle2, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const getPasswordStrength = (pass: string) => {
  let score = 0;
  if (!pass) return { score: 0, text: "", color: "bg-muted", textColor: "text-muted-foreground" };
  if (pass.length > 7) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;
  if (score < 2) return { score, text: "Weak", color: "bg-destructive", textColor: "text-destructive" };
  if (score < 4) return { score, text: "Medium", color: "bg-yellow-500", textColor: "text-yellow-500" };
  return { score, text: "Strong", color: "bg-emerald-500", textColor: "text-emerald-500" };
};

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signupWithEmail } = useAuth();

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = email && password.length >= 8 && passwordsMatch;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please check both fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Role is collected downstream at /signup/role — pass a neutral placeholder
      await signupWithEmail(email, password, "worker");
      toast({
        title: "Account created!",
        description: "Check your email for a verification code.",
      });
      navigate("/signup/verify-email", { state: { email } });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-foreground">HZLR</span>
          </Link>
          <div className="w-20" />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles size={13} className="text-primary" />
              <span className="text-xs font-semibold text-primary">Join thousands earning daily</span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Create your account</h1>
            <p className="text-muted-foreground text-sm">
              Takes less than 2 minutes. No credit card needed.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 space-y-5">
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background/60 border-white/10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-background/60 border-white/10 focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength meter */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={cn("flex-1 rounded-full transition-all duration-300",
                            strength.score >= i ? strength.color : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <span className={cn("text-xs font-semibold w-12 text-right", strength.textColor)}>{strength.text}</span>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Confirm password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "pl-10 pr-10 h-12 bg-background/60 border-white/10 focus-visible:ring-primary",
                      passwordsMatch && "border-emerald-500/40"
                    )}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {passwordsMatch && <CheckCircle2 size={16} className="text-emerald-500" />}
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 font-bold shadow-lg shadow-primary/20 mt-2"
                disabled={loading || !canSubmit}
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin mr-2" /> Creating account...</>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <span className="text-primary hover:underline cursor-pointer">Terms</span> and{" "}
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
