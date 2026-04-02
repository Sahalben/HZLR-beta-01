import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const mockPostings = [
  { id: 1, title: "F&B Service Staff", pay: 900, quantity: 5, filled: 3, status: "live", applicants: 12, prefunded: true, date: "Dec 6, 6 PM" },
  { id: 2, title: "Kitchen Helper", pay: 750, quantity: 3, filled: 3, status: "filled", applicants: 8, prefunded: true, date: "Dec 5, 7 AM" },
  { id: 3, title: "Event Setup Crew", pay: 1100, quantity: 10, filled: 0, status: "pending", applicants: 0, prefunded: false, date: "Dec 8, 8 AM" },
];

export default function EmployerPostings() {
  const navigate = useNavigate();
  
  return (
    <EmployerLayout title="Job Postings">
      <div className="p-6 space-y-4 pb-24 md:pb-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">{mockPostings.length} postings</p>
          <Button asChild><Link to="/employer/post"><Plus size={16} className="mr-1" /> New Posting</Link></Button>
        </div>
        
        {mockPostings.map((posting) => (
          <Card key={posting.id} variant="elevated" className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground">{posting.title}</h3>
                  {posting.prefunded ? <span className="badge-prefunded">Prefunded</span> : <span className="badge-pending">Pending Prefund</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">₹{posting.pay}/worker • {posting.quantity} spots • {posting.date}</p>
              </div>
              <span className={`badge-${posting.status === "live" ? "prefunded" : posting.status === "filled" ? "verified" : "pending"}`}>
                {posting.status.charAt(0).toUpperCase() + posting.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{posting.filled}/{posting.quantity} filled • {posting.applicants} applicants</span>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/employer/postings/${posting.id}`)}>Manage <ChevronRight size={16} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </EmployerLayout>
  );
}
