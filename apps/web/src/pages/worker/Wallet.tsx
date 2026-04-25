import { useState, useEffect } from "react";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, IndianRupee, Loader2, Landmark } from "lucide-react";
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
  upiVerified: boolean;
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
      const response = await fetch(`${API_URL}/api/v1/wallets/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // FIXED TOKEN KEY
        }
      });
      const data = await response.json();

      if (response.ok && data) {
        setWallet({
          id: data.id,
          available_cents: Math.round((data.balance || 0) * 100),
          pending_cents: Math.round((data.pendingBalance || 0) * 100),
          currency: 'INR',
          upiVerified: !!data.upiVerified
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
        <Card variant="forest" className="p-6 text-primary-foreground relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 opacity-80">
              <WalletIcon size={18} />
              <span className="text-sm font-medium">Available Balance</span>
            </div>
            {!wallet?.upiVerified && (
               <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-semibold backdrop-blur-sm">
                  <Landmark size={12} /> Setup Required
               </div>
            )}
          </div>
          <p className="text-4xl font-black mb-4 tracking-tight">
            {wallet ? formatAmount(wallet.available_cents) : '₹0'}
          </p>

          {wallet && wallet.pending_cents > 0 && (
            <div className="flex items-center gap-2 text-sm opacity-70 mb-4">
              <Clock size={14} />
              <span>{formatAmount(wallet.pending_cents)} pending from recent gigs</span>
            </div>
          )}

          {wallet?.upiVerified ? (
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full shadow-lg"
              disabled={wallet.available_cents <= 0}
              onClick={() => toast({ title: "UPI Withdrawal", description: "Your transfer is being processed..." })}
            >
              <IndianRupee size={14} className="mr-1" />
              Withdraw Funds
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="mt-4 w-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-white text-black hover:bg-zinc-200 transition-all font-bold"
              onClick={() => toast({ title: "UPI Setup", description: "UPI verification flow will open here!" })}
            >
              <IndianRupee size={16} className="mr-2" />
              Activate UPI Wallet
            </Button>
          )}
        </Card>

        {/* Transaction History */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Transaction History</h2>

          {transactions.length === 0 ? (
            <Card variant="elevated" className="p-8 text-center border-dashed">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                 <WalletIcon size={24} className="text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1 px-4 leading-relaxed">
                 Complete verification and finish gigs to start earning payouts.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <Card key={tx.id} variant="elevated" className="p-4 hover:border-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm leading-tight mb-0.5">
                          {tx.description || tx.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.created_at), 'MMM d, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold ${getTransactionColor(tx.type)}`}>
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
