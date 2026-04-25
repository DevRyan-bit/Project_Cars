import React, { useEffect, useMemo, useState } from 'react';
import { ordersApi, transactionsApi, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, PlusCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderOption {
  id: string;
  customer_name: string;
  car_brand: string;
  car_model: string;
}

interface TransactionRecord {
  id: string;
  amount: number;
  type: string;
  status: string;
  payment_method: string;
  transaction_date: string;
}

const AdminTransactions: React.FC = () => {
  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ order_id: '', amount: '', type: 'payment', status: 'pending', payment_method: '', notes: '' });
  const { toast } = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsApi.getAll();
      setTransactions(response.transactions);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to load transactions.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getAll();
      setOrders(response.orders || []);
    } catch (err) {
      console.warn('Unable to load orders for transaction creation', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchOrders();
  }, []);

  const selectedOrder = useMemo(() => orders.find(order => order.id === formState.order_id), [orders, formState.order_id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const amountValue = Number(formState.amount);
      if (!amountValue || amountValue <= 0) {
        setError('Enter a valid amount.');
        return;
      }

      await transactionsApi.create({
        order_id: formState.order_id,
        amount: amountValue,
        type: formState.type,
        status: formState.status,
        payment_method: formState.payment_method,
        notes: formState.notes,
      });

      toast({ title: 'Transaction recorded', description: 'The transaction was created successfully.' });
      setFormState({ order_id: '', amount: '', type: 'payment', status: 'pending', payment_method: '', notes: '' });
      fetchTransactions();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to create transaction.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction Management</h1>
          <p className="text-sm text-muted-foreground">Record payments, refunds, and adjustments for orders.</p>
        </div>
        <Button variant="outline" onClick={fetchTransactions} className="inline-flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>New Transaction</CardTitle>
          <CardDescription>Create transaction records for customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="order_id">Order</Label>
                <select id="order_id" title="Select order" value={formState.order_id} onChange={(e) => setFormState(prev => ({ ...prev, order_id: e.target.value }))} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Select order</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>{`${order.customer_name} — ${order.car_brand} ${order.car_model}`}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" min={0} step="0.01" value={formState.amount} onChange={(e) => setFormState(prev => ({ ...prev, amount: e.target.value }))} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Transaction Type</Label>
                <select id="type" title="Select transaction type" value={formState.type} onChange={(e) => setFormState(prev => ({ ...prev, type: e.target.value }))} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {['payment', 'refund', 'adjustment'].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Transaction Status</Label>
                <select id="status" title="Select transaction status" value={formState.status} onChange={(e) => setFormState(prev => ({ ...prev, status: e.target.value }))} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {['pending', 'completed', 'failed', 'cancelled'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Input id="payment_method" value={formState.payment_method} onChange={(e) => setFormState(prev => ({ ...prev, payment_method: e.target.value }))} placeholder="Card, Cash, Bank Transfer" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea id="notes" title="Transaction notes" rows={2} value={formState.notes} onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
            </div>
            <Button type="submit" className="inline-flex items-center justify-center gap-2 w-full">
              <PlusCircle className="h-4 w-4" />
              Record Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions for order management.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p>No transactions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{transaction.type.toUpperCase()} — ${transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{transaction.payment_method || 'No payment method'} • {new Date(transaction.transaction_date).toLocaleDateString()}</p>
                    </div>
                    <Badge>{transaction.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactions;
