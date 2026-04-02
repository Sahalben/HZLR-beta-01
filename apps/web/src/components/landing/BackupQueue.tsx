import { Users, Clock, Bell, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function BackupQueue() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-sm font-semibold text-seafoam mb-4 tracking-wide uppercase">
              Anti-Flake Technology
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Backup Queue Engine
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Never lose a gig opportunity. When someone cancels, the next verified 
              worker in queue gets an instant offer. Accept within 5 minutes and 
              you're in.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Users, text: "Smart ranking by reliability score + distance" },
                { icon: Clock, text: "5-minute acceptance window" },
                { icon: Bell, text: "Instant push notifications" },
                { icon: CheckCircle, text: "Auto-escalation to next in queue" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-seafoam/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-seafoam" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <Card variant="elevated" className="p-6">
              {/* Queue Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h4 className="font-bold text-foreground">Backup Queue</h4>
                  <p className="text-sm text-muted-foreground">F&B Staff — Grand Hyatt</p>
                </div>
                <span className="badge-prefunded">Prefunded</span>
              </div>

              {/* Queue List */}
              <div className="space-y-3">
                {[
                  { name: "Priya S.", score: 94, distance: "2.1km", status: "offered", time: "4:32" },
                  { name: "Rahul M.", score: 91, distance: "3.4km", status: "waiting", position: 2 },
                  { name: "Amit K.", score: 88, distance: "4.2km", status: "waiting", position: 3 },
                  { name: "Neha P.", score: 85, distance: "5.1km", status: "waiting", position: 4 },
                ].map((person) => (
                  <div
                    key={person.name}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      person.status === "offered"
                        ? "bg-[hsl(var(--status-success)/0.08)] border-2 border-[hsl(var(--status-success)/0.25)]"
                        : "bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          person.status === "offered"
                            ? "bg-[hsl(var(--status-success))] text-[hsl(var(--status-success-foreground))]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {person.status === "offered" ? "★" : `#${person.position}`}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{person.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Score: {person.score} • {person.distance}
                        </p>
                      </div>
                    </div>
                    {person.status === "offered" ? (
                      <div className="text-right">
                        <span className="text-xs font-medium text-[hsl(var(--status-success))]">Accept in</span>
                        <p className="font-mono font-bold text-[hsl(var(--status-success))]">{person.time}</p>
                      </div>
                    ) : (
                      <span className="badge-waiting">Waiting</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-seafoam/10 to-[hsl(var(--status-success)/0.1)] rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
