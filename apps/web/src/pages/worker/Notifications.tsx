import { useState, useEffect } from "react";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Info, AlertTriangle, Briefcase, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WorkerNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
      try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const res = await fetch(`${API_URL}/api/v1/notifications`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) setNotifications(await res.json());
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const markAllAsRead = async () => {
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
      try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          await fetch(`${API_URL}/api/v1/notifications/mark-read`, {
             method: 'POST',
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
      } catch (e) {}
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'success': return <CheckCircle className="text-success" size={20} />;
        case 'warning': return <AlertTriangle className="text-warning" size={20} />;
        case 'match': return <Briefcase className="text-seafoam" size={20} />;
        default: return <Info className="text-info" size={20} />;
    }
  };

  return (
    <WorkerLayout title="Notifications">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-foreground">Inbox</h2>
          {notifications.some(n => !n.isRead) && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-muted-foreground font-semibold">
              Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-4 pb-20">
            {loading ? (
                 <div className="text-center py-20 text-muted-foreground animate-pulse text-sm font-semibold">
                     Syncing server feeds...
                 </div>
            ) : notifications.length === 0 ? (
                 <Card className="border-0 shadow-lg p-10 text-center bg-transparent mt-10">
                     <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-muted-foreground opacity-50" size={30} />
                     </div>
                     <p className="font-bold text-foreground mb-1">You're all caught up!</p>
                     <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                         Important alerts regarding gig confirmations, payments, and account status will drop here securely.
                     </p>
                 </Card>
            ) : (
                 notifications.map((notification) => (
                    <Card
                    key={notification.id}
                    variant={notification.isRead ? "outline" : "elevated"}
                    className={cn(
                        "p-4 transition-colors",
                        !notification.isRead ? "bg-secondary/20 border-l-4 border-l-seafoam" : "opacity-80"
                    )}
                    >
                    <div className="flex gap-4">
                        <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                        !notification.isRead ? "bg-background" : "bg-muted"
                        )}>
                            {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm text-foreground">{notification.title}</h4>
                            <span className="text-[10px] text-muted-foreground font-semibold whitespace-nowrap mt-0.5">
                               {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notification.body}</p>
                        </div>
                    </div>
                    </Card>
                ))
            )}
        </div>
      </div>
    </WorkerLayout>
  );
}
