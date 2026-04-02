import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithOtp } = useAuth();
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"worker" | "employer">("worker");

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setStep("otp");
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${method === "phone" ? `+91 ${phone}` : email}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      if (method === "phone") {
        await loginWithOtp(phone, otp);
      }
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate(userType === "worker" ? "/worker/home" : "/employer/home");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-4xl font-black text-foreground tracking-tight">
                HZLR<span className="text-seafoam">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground mt-2">Welcome back</p>
          </div>

          <Card variant="elevated" className="p-6">
            {step === "input" ? (
              <>
                {/* User Type Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setUserType("worker")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${userType === "worker"
                      ? "bg-success text-success-foreground"
                      : "bg-secondary text-secondary-foreground"
                      }`}
                  >
                    I'm a Worker
                  </button>
                  <button
                    onClick={() => setUserType("employer")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${userType === "employer"
                      ? "bg-success text-success-foreground"
                      : "bg-secondary text-secondary-foreground"
                      }`}
                  >
                    I'm an Employer
                  </button>
                </div>

                {/* Method Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setMethod("phone")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${method === "phone"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                      }`}
                  >
                    <Phone size={16} className="inline mr-2" />
                    Phone
                  </button>
                  <button
                    onClick={() => setMethod("email")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${method === "email"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                      }`}
                  >
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </button>
                </div>

                {/* Input */}
                {method === "phone" ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="w-20 px-3 py-2 rounded-xl bg-secondary text-center text-foreground font-medium">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={handleRequestOtp}
                  disabled={loading || (method === "phone" ? !phone : !email)}
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Get OTP"
                  )}
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-seafoam font-medium hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">Enter OTP</h3>
                  <p className="text-sm text-muted-foreground">
                    We sent a code to {method === "phone" ? `+91 ${phone}` : email}
                  </p>
                </div>

                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                  />
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Verify & Login"
                  )}
                </Button>

                <button
                  onClick={() => setStep("input")}
                  className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change {method === "phone" ? "phone number" : "email"}
                </button>

                <p className="text-center text-xs text-muted-foreground mt-6">
                  Didn't receive the code?{" "}
                  <button className="text-seafoam font-medium hover:underline">
                    Resend OTP
                  </button>
                </p>
              </>
            )}
          </Card>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="underline">Terms</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
