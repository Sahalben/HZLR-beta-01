import { useState, useEffect } from "react";
import { Send, Flag, ArrowLeft, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { TicketModal } from "@/components/shared/TicketModal";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function WorkerMessages() {
  const [selectedConvo, setSelectedConvo] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConvo) {
       fetchMessages(selectedConvo.id);
    }
  }, [selectedConvo]);

  const fetchConversations = async () => {
    try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/v1/messages/my-conversations`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            setConversations(await res.json());
        }
    } catch (e) {
        toast({ title: 'Error', description: 'Failed to sync inbox', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/v1/messages/conversation/${otherUserId}`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            setMessages(await res.json());
        }
    } catch (e) {
        console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConvo) return;
    
    // Check for phone numbers to prevent off-platform poaching (basic regex)
    const phoneRegex = /(\+?\d{10,}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/;
    if (phoneRegex.test(newMessage)) {
      toast({ title: 'Security Alert', description: 'Phone numbers are filtered for your safety.', variant: 'destructive'})
      setNewMessage("");
      return;
    }

    // Instantly optimistically update the UI
    const pendingMsg = {
        id: Math.random().toString(),
        sender: "worker",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, pendingMsg]);
    setNewMessage("");
    // Note: To fully work, we would wire a POST /messages here, but MVP is just unmocking the visual stream.
  };

  // Conversation List View
  if (!selectedConvo) {
    return (
      <WorkerLayout title="Messages">
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 className="animate-spin text-muted-foreground" size={32} />
           </div>
        ) : (
        <div className="divide-y divide-border">
          {conversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo)}
              className="w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {convo.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{convo.employerName}</p>
                  <span className="text-xs text-muted-foreground">
                       {new Date(convo.time).toLocaleDateString([], { month: 'short', day: 'numeric'})}
                  </span>
                </div>
                <p className={cn(
                  "text-sm truncate",
                  convo.unread ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {convo.lastMessage}
                </p>
              </div>
              {convo.unread && (
                <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
              )}
            </button>
          ))}

          {conversations.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                 <User size={32} className="text-muted-foreground/50" />
              </div>
              <p className="text-foreground font-semibold">Inbox Empty</p>
              <p className="text-sm text-muted-foreground mt-1 px-8 leading-relaxed">
                When you apply and get confirmed for gigs, you can chat with employers here!
              </p>
            </div>
          )}
        </div>
        )}
      </WorkerLayout>
    );
  }

  // Chat View
  return (
    <WorkerLayout showHeader={false}>
      {/* Chat Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedConvo(null)}>
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-semibold">
            {selectedConvo?.avatar}
          </div>
          <div>
            <p className="font-semibold">{selectedConvo?.employerName}</p>
            <p className="text-xs text-primary-foreground/60">Employer</p>
          </div>
        </div>
        <TicketModal source="chat">
          <button className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
            <Flag size={18} />
          </button>
        </TicketModal>
      </header>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 pb-24 overflow-y-auto">
        <div className="text-center py-2">
          <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border">
            🔒 Messages are monitored for safety
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender === "worker" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] px-4 py-2.5 rounded-2xl",
                msg.sender === "worker"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-foreground rounded-bl-md border border-border"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={cn(
                "text-[10px] mt-1",
                msg.sender === "worker" ? "text-primary-foreground/60" : "text-muted-foreground"
              )}>
                {msg.sender === "worker" ? msg.time : new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage}>
            <Send size={18} />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2 font-medium">
          Phone numbers are automatically filtered. Do not pay outside HZLR.
        </p>
      </div>
    </WorkerLayout>
  );
}
