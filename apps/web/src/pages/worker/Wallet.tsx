import { useState, useEffect } from "react";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, IndianRupee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkerLayout } from "@/components/worker/WorkerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface WalletData {
  id: string;
  available_cents: number;
  pending_cents: number;
  currency: string;
}

interface Transaction {
  id: string;
  amount_cents: number;
  fee_cents: number;
  type: string;
  description: string | null;
  created_at: string;
}

export default function WorkerWallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/v1/wallets/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hzlr_access_token')}`
        }
      });
      const data = await response.json();

      if (response.ok && data) {
        setWallet({
          id: data.id,
          available_cents: Math.round((data.balance || 0) * 100),
          pending_cents: Math.round((data.pendingBalance || 0) * 100),
          currency: 'INR'
        });

        setTransactions((data.transactions || []).map((t: any) => ({
          id: t.id,
          amount_cents: Math.round((t.amount || 0) * 100),
          fee_cents: 0,
          type: t.type.toLowerCase(),
          description: t.description,
          created_at: t.createdAt
        })));
      }
    } catch (err) {
      console.error("Wallet fetch error", err);
    }

    setLoading(false);
  };

  const formatAmount = (cents: number) => `₹${(cents / 100).toLocaleString('en-IN')}`;

  const getTransactionIcon = (type: string) => {
    if (['credit', 'escrow_release', 'refund'].includes(type)) {
      return <ArrowDownLeft size={16} className="text-green-600" />;
    }
    return <ArrowUpRight size={16} className="text-red-500" />;
  };

  const getTransactionColor = (type: string) => {
    if (['credit', 'escrow_release', 'refund'].includes(type)) return 'text-green-600';
    return 'text-red-500';
  };

  const getTransactionSign = (type: string) => {
    if (['credit', 'escrow_release', 'refund'].includes(type)) return '+';
    return '-';
  };

  if (loading) {
    return (
      <WorkerLayout title="Wallet">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" size={32} />
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout title="Wallet">
      <div className="px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card variant="forest" className="p-6 text-primary-foreground">
          <div className="flex items-center gap-2 mb-1 opacity-80">
            <WalletIcon size={18} />
            <span className="text-sm">Available Balance</span>
          </div>
          <p className="text-3xl font-bold mb-4">
            {wallet ? formatAmount(wallet.available_cents) : '₹0'}
          </p>

          {wallet && wallet.pending_cents > 0 && (
            <div className="flex items-center gap-2 text-sm opacity-70">
              <Clock size={14} />
              <span>{formatAmount(wallet.pending_cents)} pending</span>
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="mt-4 w-full"
            onClick={() => toast({ title: "UPI Withdrawal", description: "Coming soon — connect your UPI ID to withdraw funds." })}
          >
            <IndianRupee size={14} className="mr-1" />
            Withdraw to UPI
          </Button>
        </Card>

        {/* Transaction History */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Transaction History</h2>

          {transactions.length === 0 ? (
            <Card variant="elevated" className="p-8 text-center">
              <WalletIcon size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1">Complete gigs to start earning!</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <Card key={tx.id} variant="elevated" className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {tx.description || tx.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.created_at), 'MMM d, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${getTransactionColor(tx.type)}`}>
                      {getTransactionSign(tx.type)}{formatAmount(Math.abs(tx.amount_cents))}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </WorkerLayout>
  );
}
