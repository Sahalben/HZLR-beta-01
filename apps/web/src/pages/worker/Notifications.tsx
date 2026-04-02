import { Bell, Check, Clock, AlertCircle, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { Link } from "react-router-dom";

const mockNotifications = [
  {
    id: 1,
    type: "offer",
    title: "New Gig Offer!",
    message: "You've been offered a position at Grand Hyatt. Accept within 5 minutes.",
    time: "Just now",
    unread: true,
    actionUrl: "/worker/queue-status",
  },
  {
    id: 2,
    type: "confirmation",
    title: "Gig Confirmed",
    message: "Your Kitchen Staff gig at Taj Palace has been confirmed for today at 7 AM.",
    time: "2 hours ago",
    unread: true,
    actionUrl: "/worker/checkin",
  },
  {
    id: 3,
    type: "queue",
    title: "Queue Position Updated",
    message: "You've moved up to position #2 in the queue for Event Setup at Marriott.",
    time: "5 hours ago",
    unread: false,
    actionUrl: "/worker/queue-status",
  },
  {
    id: 4,
    type: "payment",
    title: "Payment Received",
    message: "₹950 has been credited to your wallet for Banquet Service gig.",
    time: "1 day ago",
    unread: false,
  },
  {
    id: 5,
    type: "reminder",
    title: "Upcoming Gig Reminder",
    message: "Your Kitchen Staff gig starts in 2 hours. Don't forget to check in!",
    time: "2 days ago",
    unread: false,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "offer":
      return <Briefcase size={20} className="text-success" />;
    case "confirmation":
      return <Check size={20} className="text-success" />;
    case "queue":
      return <Clock size={20} className="text-info" />;
    case "payment":
      return <Bell size={20} className="text-success" />;
    case "reminder":
      return <AlertCircle size={20} className="text-warning" />;
    default:
      return <Bell size={20} className="text-muted-foreground" />;
  }
};

export default function WorkerNotifications() {
  return (
    <WorkerLayout title="Notifications">
      <div className="p-4 space-y-3 pb-24">
        {mockNotifications.map((notification) => (
          <Card
            key={notification.id}
            variant="elevated"
            className={`p-4 transition-all ${notification.unread ? "border-l-4 border-l-success" : ""}`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-foreground text-sm">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                {notification.actionUrl && (
                  <Button variant="link" size="sm" className="p-0 h-auto mt-2" asChild>
                    <Link to={notification.actionUrl}>View Details →</Link>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </WorkerLayout>
  );
}
