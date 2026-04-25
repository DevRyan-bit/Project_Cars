import React, { useEffect, useState } from 'react';
import { authApi, ApiError } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserRecord {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authApi.getUsers();
      setUsers(response.users);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to load users.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      await authApi.createAdmin({ username, email, password, role: 'admin' });
      toast({ title: 'Admin created', description: 'A new admin account was created successfully.' });
      setUsername('');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to create admin.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await authApi.deleteUser(id);
      toast({ title: 'Admin removed', description: 'The admin account was removed.' });
      fetchUsers();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to delete user.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-sm text-muted-foreground">Manage super admin and your team of admins.</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-5 w-5" />
          <span>{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Create Admin</CardTitle>
          <CardDescription>Super admin can create and manage up to 5 admin users.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAdmin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin2" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin2@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
            <Button type="submit" className="w-full inline-flex items-center justify-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Admin
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Team</CardTitle>
          <CardDescription>Current admin users under the super admin.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading admins...</p>
          ) : (
            <div className="space-y-3">
              {users.length === 0 ? (
                <p>No admin users found.</p>
              ) : (
                users.map((userRecord) => (
                  <div key={userRecord.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{userRecord.username}</p>
                      <p className="text-sm text-muted-foreground">{userRecord.email}</p>
                      <Badge variant={userRecord.role === 'super_admin' ? 'secondary' : 'outline'}>{userRecord.role.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">Joined {new Date(userRecord.created_at).toLocaleDateString()}</span>
                      {userRecord.role !== 'super_admin' && (
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(userRecord.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
