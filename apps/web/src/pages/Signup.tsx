import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Signup() {
  const navigate = useNavigate();

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
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-4xl font-black text-foreground tracking-tight">
                HZLR<span className="text-seafoam">.</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mt-4">Get Started</h1>
            <p className="text-muted-foreground mt-2">Choose how you want to use HZLR</p>
          </div>

          {/* Role Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Worker Card */}
            <Card
              variant="elevated"
              className="p-6 cursor-pointer hover:border-primary hover:border-2 transition-all group"
              onClick={() => navigate("/worker/signup")}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">I'm a Worker</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find daily gigs, get paid instantly, and build your digital resume.
              </p>
              <ul className="space-y-2 mb-6">
                {["Free forever", "Instant payouts", "Build credibility"].map((item) => (
                  <li key={item} className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="default" className="w-full group-hover:bg-emerald-600">
                Start Working
                <ArrowRight size={16} />
              </Button>
            </Card>

            {/* Employer Card */}
            <Card
              variant="elevated"
              className="p-6 cursor-pointer hover:border-primary hover:border-2 transition-all group"
              onClick={() => navigate("/employer/signup")}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">I'm an Employer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hire verified workers, prefund gigs, and fill positions fast.
              </p>
              <ul className="space-y-2 mb-6">
                {["Verified workers", "Anti-flake queue", "Instant hiring"].map((item) => (
                  <li key={item} className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="default" className="w-full group-hover:bg-blue-600">
                Start Hiring
                <ArrowRight size={16} />
              </Button>
            </Card>
          </div>

          {/* Login Link */}
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
