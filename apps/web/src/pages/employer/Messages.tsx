import { useState, useEffect } from "react";
import { Send, ArrowLeft, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function EmployerMessages() {
  const { toast } = useToast();
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
     const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
     fetch(`${API_URL}/api/v1/messages/my-conversations`, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
     })
     .then(r => r.json())
     .then(data => { setConversations(data); setLoading(false); })
     .catch(() => { setLoading(false); });
  }, []);

  useEffect(() => {
      if(!selectedConvo) return;
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      fetch(`${API_URL}/api/v1/messages/conversation/${selectedConvo.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(r => r.json())
      .then(data => setMessages(data))
      .catch();
  }, [selectedConvo]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConvo) return;
    
    // Optimistic insert
    const tempMsg = { id: Date.now(), sender: "employer", text: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage("");

    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        await fetch(`${API_URL}/api/v1/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ receiverId: selectedConvo.id, content: tempMsg.text })
        });
    } catch(err) {
        toast({ title: "Message failed to send.", variant: "destructive" });
    }
  };

  if (loading && !selectedConvo) {
      return <EmployerLayout title="Messages"><div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div></EmployerLayout>
  }

  if (!selectedConvo) {
    return (
      <EmployerLayout title="Messages">
        <div className="divide-y divide-border">
          {conversations.map((convo) => (
            <button key={convo.id} onClick={() => setSelectedConvo(convo)} className="w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">{convo.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{convo.employerName}</p>
                  <span className="text-xs text-muted-foreground">{new Date(convo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className={cn("text-sm truncate", convo.unread ? "text-foreground font-medium" : "text-muted-foreground")}>{convo.lastMessage}</p>
              </div>
              {convo.unread && <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />}
            </button>
          ))}
          {conversations.length === 0 && (
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
          <button onClick={() => { setSelectedConvo(null); setMessages([]); }}><ArrowLeft size={20} /></button>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">{selectedConvo?.avatar}</div>
          <p className="font-semibold text-foreground">{selectedConvo?.employerName}</p>
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
