import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { Bell, Users, CheckCircle, XCircle, Clock } from "lucide-react";

const mockNotifications = [
  { id: 1, type: "accepted", message: "Priya Sharma accepted your offer for F&B Staff", time: "5 mins ago", icon: CheckCircle, color: "text-success" },
  { id: 2, type: "declined", message: "Rahul M. declined the Kitchen Helper position", time: "1 hour ago", icon: XCircle, color: "text-destructive" },
  { id: 3, type: "queue", message: "3 new workers joined the queue for Event Setup", time: "2 hours ago", icon: Users, color: "text-info" },
  { id: 4, type: "reminder", message: "F&B Staff gig starts in 2 hours", time: "3 hours ago", icon: Clock, color: "text-warning" },
];

export default function EmployerNotifications() {
  return (
    <EmployerLayout title="Notifications">
      <div className="p-6 space-y-3 pb-24 md:pb-6">
        {mockNotifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <Card key={notif.id} variant="elevated" className="p-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0`}>
                <Icon size={20} className={notif.color} />
              </div>
              <div className="flex-1">
                <p className="text-foreground">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
              </div>
            </Card>
          );
        })}
        {mockNotifications.length === 0 && (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
}
