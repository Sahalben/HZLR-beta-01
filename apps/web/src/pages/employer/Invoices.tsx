import { EmployerLayout } from "@/components/employer/EmployerLayout";
import { Card } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockInvoices = [
  { id: "INV-001", date: "Dec 1, 2024", amount: 15000, status: "paid", gigs: 5 },
  { id: "INV-002", date: "Nov 15, 2024", amount: 22500, status: "paid", gigs: 8 },
  { id: "INV-003", date: "Nov 1, 2024", amount: 18000, status: "paid", gigs: 6 },
];

export default function EmployerInvoices() {
  return (
    <EmployerLayout title="Invoices">
      <div className="p-6 space-y-4 pb-24 md:pb-6">
        {mockInvoices.map((invoice) => (
          <Card key={invoice.id} variant="elevated" className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText size={20} className="text-info" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{invoice.id}</p>
                <p className="text-sm text-muted-foreground">{invoice.date} • {invoice.gigs} gigs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-foreground">₹{invoice.amount.toLocaleString()}</p>
                <span className="badge-prefunded">Paid</span>
              </div>
              <Button variant="ghost" size="icon"><Download size={18} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </EmployerLayout>
  );
}
