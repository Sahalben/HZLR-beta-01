import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EmployerInvoices() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchInvoices = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
             const token = localStorage.getItem('token');
             const res = await fetch(`${API_URL}/api/v1/employers/invoices`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 const json = await res.json();
                 setInvoices(json);
             }
         } catch(e) {
             toast({ title: "Fetch failed", description: "Ledger is unreachable.", variant: "destructive" });
         } finally {
             setLoading(false);
         }
     };
     fetchInvoices();
  }, [toast]);

  return (
    <EmployerLayout title="Invoices">
      <div className="p-4 sm:p-6 space-y-4 pb-24 md:pb-6">
        {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : invoices.length === 0 ? (
             <Card className="p-8 text-center border-dashed bg-secondary/10 text-muted-foreground font-medium text-sm">
                 You have no active escrow holding invoices recorded on the platform yet.
             </Card>
        ) : invoices.map((invoice) => (
          <Card key={invoice.id} variant="elevated" className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText size={20} className="text-info" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm tracking-tight">{invoice.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(invoice.date).toLocaleDateString()} • {invoice.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-foreground">₹{invoice.amount.toLocaleString()}</p>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${invoice.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-warning/10 text-warning'}`}>{invoice.status}</span>
              </div>
              <Button variant="ghost" size="icon"><Download size={18} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </EmployerLayout>
  );
}
