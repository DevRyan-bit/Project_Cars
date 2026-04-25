import React, { useEffect, useMemo, useState } from 'react';
import { ordersApi, carsApi, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, PlusCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CarOption {
  id: string;
  brand: string;
  model: string;
  type: string;
  price: number;
  colors?: { name: string; hex: string }[];
}

interface OrderRecord {
  id: string;
  customer_name: string;
  customer_email: string;
  car_brand: string;
  car_model: string;
  quantity: number;
  total_amount: number;
  status: string;
  order_date: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ customer_name: '', customer_email: '', customer_phone: '', car_id: '', quantity: '1', selected_color: '', status: 'pending', notes: '' });
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getAll();
      setOrders(response.orders);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to load orders.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await carsApi.getAll();
      setCars(response.cars);
    } catch (err) {
      console.warn('Unable to load cars for order creation', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCars();
  }, []);

  const selectedCar = useMemo(() => cars.find(car => car.id === formState.car_id), [cars, formState.car_id]);
  const totalAmount = useMemo(() => {
    const price = selectedCar?.price || 0;
    return price * Number(formState.quantity || 1);
  }, [selectedCar, formState.quantity]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!selectedCar) {
      setError('Please select a valid car.');
      return;
    }

    try {
      await ordersApi.create({
        customer_name: formState.customer_name,
        customer_email: formState.customer_email,
        customer_phone: formState.customer_phone,
        car_id: selectedCar.id,
        car_brand: selectedCar.brand,
        car_model: selectedCar.model,
        selected_color: formState.selected_color,
        quantity: Number(formState.quantity),
        total_amount: totalAmount,
        status: formState.status,
        notes: formState.notes,
      });
      toast({ title: 'Order created', description: 'The order was added successfully.' });
      setFormState({ customer_name: '', customer_email: '', customer_phone: '', car_id: '', quantity: '1', selected_color: '', status: 'pending', notes: '' });
      fetchOrders();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to create order.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-sm text-muted-foreground">Create and track customer orders for the vehicle catalog.</p>
        </div>
        <Button variant="outline" onClick={fetchOrders} className="inline-flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Refresh List
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>New Order</CardTitle>
          <CardDescription>Create a new customer order for a vehicle.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input id="customer_name" value={formState.customer_name} onChange={(e) => setFormState(prev => ({ ...prev, customer_name: e.target.value }))} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer_email">Customer Email</Label>
                <Input id="customer_email" type="email" value={formState.customer_email} onChange={(e) => setFormState(prev => ({ ...prev, customer_email: e.target.value }))} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="car_id">Vehicle</Label>
                <select id="car_id" title="Select a car" value={formState.car_id} onChange={(e) => setFormState(prev => ({ ...prev, car_id: e.target.value, selected_color: '' }))} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                  <option value="">Select a car</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>{`${car.brand} ${car.model}`}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min={1} value={formState.quantity} onChange={(e) => setFormState(prev => ({ ...prev, quantity: e.target.value }))} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="selected_color">Selected Color</Label>
                <select id="selected_color" title="Select a color" value={formState.selected_color} onChange={(e) => setFormState(prev => ({ ...prev, selected_color: e.target.value }))} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Select a color</option>
                  {selectedCar?.colors?.map((color) => (
                    <option key={color.name} value={color.name}>{color.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Order Status</Label>
                <select id="status" title="Select order status" value={formState.status} onChange={(e) => setFormState(prev => ({ ...prev, status: e.target.value }))} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea id="notes" title="Order notes" value={formState.notes} onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))} rows={3} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">Estimated total: <strong>${totalAmount.toLocaleString()}</strong></p>
              <Button type="submit" className="inline-flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Orders created by the admin team.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{order.customer_name} — {order.car_brand} {order.car_model}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_email} • {order.quantity} item(s)</p>
                    </div>
                    <Badge>{order.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>Total: ${order.total_amount.toLocaleString()}</span>
                    <span>Ordered: {new Date(order.order_date).toLocaleDateString()}</span>
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

export default AdminOrders;
