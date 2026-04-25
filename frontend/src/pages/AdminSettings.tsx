import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AdminSettings: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Review your admin account and sign out when finished.</p>
        </div>
        <Button variant="ghost" onClick={logout}>
          Sign out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>Basic details for your signed-in administrator account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Username</p>
            <p className="text-base text-muted-foreground">{user?.username || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-base text-muted-foreground">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Role</p>
            <p className="text-base text-muted-foreground">{user?.role?.replace('_', ' ') || 'N/A'}</p>
          </div>
          <div className="rounded-lg border border-dashed border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">Admin password updates and role management are handled only by super-admin users through backend routes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
