import { useState } from "react";
import { Send, Flag, ArrowLeft, MoreVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { TicketModal } from "@/components/shared/TicketModal";
import { cn } from "@/lib/utils";

// Mock conversations
const mockConversations = [
  {
    id: 1,
    employerName: "Grand Hyatt",
    lastMessage: "Looking forward to seeing you tomorrow!",
    time: "2m ago",
    unread: true,
    avatar: "GH",
  },
  {
    id: 2,
    employerName: "Taj Palace",
    lastMessage: "The shift has been confirmed. Please arrive 15 mins early.",
    time: "1h ago",
    unread: false,
    avatar: "TP",
  },
  {
    id: 3,
    employerName: "Marriott Convention",
    lastMessage: "Great work last time! We'd love to have you again.",
    time: "2d ago",
    unread: false,
    avatar: "MC",
  },
];

// Mock messages for a conversation
const mockMessages = [
  { id: 1, sender: "employer", text: "Hi Priya, we have a gig tomorrow at 6 PM. Are you available?", time: "10:30 AM" },
  { id: 2, sender: "worker", text: "Yes, I'm available! What's the role?", time: "10:32 AM" },
  { id: 3, sender: "employer", text: "F&B service for a corporate event. Pay is ₹900 for 6 hours.", time: "10:33 AM" },
  { id: 4, sender: "worker", text: "Sounds great! I'll apply for it.", time: "10:35 AM" },
  { id: 5, sender: "employer", text: "Perfect! Looking forward to seeing you tomorrow!", time: "10:36 AM" },
];

export default function WorkerMessages() {
  const [selectedConvo, setSelectedConvo] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const selectedConversation = mockConversations.find((c) => c.id === selectedConvo);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Check for phone numbers (basic regex)
    const phoneRegex = /(\+?\d{10,}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/;
    if (phoneRegex.test(newMessage)) {
      // Don't send - phone numbers are filtered
      setNewMessage("");
      return;
    }

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "worker",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setNewMessage("");
  };

  // Conversation List View
  if (!selectedConvo) {
    return (
      <WorkerLayout title="Messages">
        <div className="divide-y divide-border">
          {mockConversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo.id)}
              className="w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {convo.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{convo.employerName}</p>
                  <span className="text-xs text-muted-foreground">{convo.time}</span>
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
        </div>

        {mockConversations.length === 0 && (
          <div className="text-center py-16 px-4">
            <User size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Messages with employers will appear here
            </p>
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
            {selectedConversation?.avatar}
          </div>
          <div>
            <p className="font-semibold">{selectedConversation?.employerName}</p>
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
        {/* Encryption notice */}
        <div className="text-center py-2">
          <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
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
                  : "bg-secondary text-foreground rounded-bl-md"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={cn(
                "text-[10px] mt-1",
                msg.sender === "worker" ? "text-primary-foreground/60" : "text-muted-foreground"
              )}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border p-4">
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
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Phone numbers are automatically filtered for your safety
        </p>
      </div>
    </WorkerLayout>
  );
}
