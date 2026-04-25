import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ordersApi, transactionsApi } from '@/lib/api';
import { ApiError } from '@/lib/api';
import {
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  Car,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  orders: {
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    total_revenue: number;
    avg_order_value: number;
  };
  transactions: {
    total_transactions: number;
    completed_transactions: number;
    total_amount: number;
    total_refunds: number;
    pending_transactions: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersStats, transactionsStats] = await Promise.all([
          ordersApi.getStats(),
          transactionsApi.getStats(),
        ]);

        setStats({
          orders: ordersStats.stats,
          transactions: transactionsStats.stats,
        });
      } catch (error) {
        if (error instanceof ApiError) {
          toast({
            title: 'Error loading dashboard',
            description: error.message,
            variant: 'destructive',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium">Failed to load dashboard</h3>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
  }> = ({ title, value, description, icon: Icon, trend }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.orders.total_orders}
          description="All time orders"
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.orders.total_revenue.toLocaleString()}`}
          description="Revenue from completed orders"
          icon={DollarSign}
        />
        <StatCard
          title="Avg Order Value"
          value={`$${stats.orders.avg_order_value.toFixed(2)}`}
          description="Average order value"
          icon={TrendingUp}
        />
        <StatCard
          title="Pending Orders"
          value={stats.orders.pending_orders}
          description="Orders awaiting processing"
          icon={Clock}
        />
      </div>

      {/* Transaction Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={stats.transactions.total_transactions}
          description="All payment transactions"
          icon={CreditCard}
        />
        <StatCard
          title="Completed Payments"
          value={`$${stats.transactions.total_amount.toLocaleString()}`}
          description="Total payment amount"
          icon={CheckCircle}
        />
        <StatCard
          title="Total Refunds"
          value={`$${stats.transactions.total_refunds.toLocaleString()}`}
          description="Refunded amounts"
          icon={XCircle}
        />
        <StatCard
          title="Pending Transactions"
          value={stats.transactions.pending_transactions}
          description="Transactions awaiting processing"
          icon={Clock}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Car className="h-6 w-6 mb-2" />
              Add New Car
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ShoppingCart className="h-6 w-6 mb-2" />
              Create Order
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              Process Payment
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Manage Users
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <Badge variant="secondary">{stats.orders.pending_orders}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Processing</span>
                <Badge variant="outline">{Math.max(0, stats.orders.total_orders - stats.orders.pending_orders - stats.orders.completed_orders)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <Badge variant="default">{stats.orders.completed_orders}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <Badge variant="default">{stats.transactions.completed_transactions}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <Badge variant="secondary">{stats.transactions.pending_transactions}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed</span>
                <Badge variant="destructive">
                  {stats.transactions.total_transactions - stats.transactions.completed_transactions - stats.transactions.pending_transactions}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;