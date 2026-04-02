import { useState } from "react";
import { Send, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { cn } from "@/lib/utils";

const mockConversations = [
  { id: 1, workerName: "Priya Sharma", lastMessage: "I'll be there on time!", time: "5m ago", unread: true, avatar: "PS" },
  { id: 2, workerName: "Rahul Mehta", lastMessage: "Thank you for the opportunity.", time: "2h ago", unread: false, avatar: "RM" },
];

const mockMessages = [
  { id: 1, sender: "worker", text: "Hi, I'm interested in the F&B position.", time: "10:30 AM" },
  { id: 2, sender: "employer", text: "Great! Your profile looks good. Can you make it by 6 PM?", time: "10:32 AM" },
  { id: 3, sender: "worker", text: "Yes, I'll be there on time!", time: "10:33 AM" },
];

export default function EmployerMessages() {
  const [selectedConvo, setSelectedConvo] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const selectedConversation = mockConversations.find((c) => c.id === selectedConvo);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: messages.length + 1, sender: "employer", text: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setNewMessage("");
  };

  if (!selectedConvo) {
    return (
      <EmployerLayout title="Messages">
        <div className="divide-y divide-border">
          {mockConversations.map((convo) => (
            <button key={convo.id} onClick={() => setSelectedConvo(convo.id)} className="w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">{convo.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{convo.workerName}</p>
                  <span className="text-xs text-muted-foreground">{convo.time}</span>
                </div>
                <p className={cn("text-sm truncate", convo.unread ? "text-foreground font-medium" : "text-muted-foreground")}>{convo.lastMessage}</p>
              </div>
              {convo.unread && <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />}
            </button>
          ))}
          {mockConversations.length === 0 && (
            <div className="text-center py-16 px-4">
              <User size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          )}
        </div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <header className="bg-secondary/50 px-4 py-3 flex items-center gap-3 border-b border-border">
          <button onClick={() => setSelectedConvo(null)}><ArrowLeft size={20} /></button>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">{selectedConversation?.avatar}</div>
          <p className="font-semibold text-foreground">{selectedConversation?.workerName}</p>
        </header>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.sender === "employer" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] px-4 py-2.5 rounded-2xl", msg.sender === "employer" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md")}>
                <p className="text-sm">{msg.text}</p>
                <p className={cn("text-[10px] mt-1", msg.sender === "employer" ? "text-primary-foreground/60" : "text-muted-foreground")}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4 flex gap-2">
          <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} className="flex-1" />
          <Button size="icon" onClick={handleSendMessage}><Send size={18} /></Button>
        </div>
      </div>
    </EmployerLayout>
  );
}
