
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStoreOwnerDashboard } from '@/services/api';
import { Store, User } from '@/types';
import StarRating from '@/components/StarRating';
import { Star, Users } from 'lucide-react';

const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [ratingUsers, setRatingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await fetchStoreOwnerDashboard(user.id);
        setStore(data.store);
        setRatingUsers(data.ratingUsers);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">You must be logged in to view your dashboard</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No store found for your account</h2>
          <p className="mt-2 text-muted-foreground">
            Please contact the administrator to associate a store with your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="md:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">{store.name}</CardTitle>
            <CardDescription>{store.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium mb-2">Store Information</h3>
                <p className="text-muted-foreground">Email: {store.email}</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-secondary mb-2">{store.averageRating.toFixed(1)}</div>
                <StarRating rating={store.averageRating} readonly />
                <div className="mt-2 text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rating Users</CardTitle>
              <CardDescription>
                Users who have submitted ratings for your store
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 bg-muted p-2 rounded-lg">
              <Users size={18} />
              <span className="font-medium">{ratingUsers.length}</span>
            </div>
          </CardHeader>
          <CardContent>
            {ratingUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No ratings have been submitted for your store yet.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ratingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
