import React, { useEffect, useState } from 'react';
import { carsApi, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, Trash2, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CarRecord {
  id: string;
  brand: string;
  model: string;
  type: string;
  year: number;
  price: number;
  image: string;
  description: string;
}

const AdminCars: React.FC = () => {
  const [cars, setCars] = useState<CarRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({ brand: '', model: '', type: '', year: '', price: '', image: '', description: '' });
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await carsApi.getAll();
      setCars(response.cars);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to load cars.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      await carsApi.create({
        brand: formState.brand,
        model: formState.model,
        type: formState.type,
        year: Number(formState.year),
        price: Number(formState.price),
        image: formState.image,
        description: formState.description,
        specs: { engine: '', horsepower: 0, acceleration: '', topSpeed: '', fuelType: '' },
        colors: [],
        features: [],
      });
      toast({ title: 'Car added', description: 'The vehicle was successfully added to inventory.' });
      setFormState({ brand: '', model: '', type: '', year: '', price: '', image: '', description: '' });
      fetchCars();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to add car.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await carsApi.delete(id);
      toast({ title: 'Car removed', description: 'The vehicle has been removed from inventory.' });
      fetchCars();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to remove car.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Car Inventory</h1>
          <p className="text-sm text-muted-foreground">Add, view and manage the catalog of vehicles.</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Car className="h-5 w-5" />
          <span>Catalog management</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Vehicle</CardTitle>
          <CardDescription>Enter basic car details and add them to the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={formState.brand} onChange={(e) => setFormState(prev => ({ ...prev, brand: e.target.value }))} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" value={formState.model} onChange={(e) => setFormState(prev => ({ ...prev, model: e.target.value }))} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" value={formState.type} onChange={(e) => setFormState(prev => ({ ...prev, type: e.target.value }))} placeholder="SUV, Sedan, Hatchback" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" value={formState.year} onChange={(e) => setFormState(prev => ({ ...prev, year: e.target.value }))} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={formState.price} onChange={(e) => setFormState(prev => ({ ...prev, price: e.target.value }))} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={formState.image} onChange={(e) => setFormState(prev => ({ ...prev, image: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea id="description" value={formState.description} onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))} rows={3} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <Button type="submit" className="inline-flex items-center justify-center gap-2 w-full">
              <PlusCircle className="h-4 w-4" />
              Add Vehicle
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Catalog</CardTitle>
          <CardDescription>Existing cars that can be managed by admin users.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading inventory...</p>
          ) : cars.length === 0 ? (
            <p>No cars in the inventory yet.</p>
          ) : (
            <div className="space-y-3">
              {cars.map((car) => (
                <div key={car.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{car.brand} {car.model}</h3>
                      <Badge>{car.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{car.year} • ${car.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-xl">{car.description}</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(car.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCars;
