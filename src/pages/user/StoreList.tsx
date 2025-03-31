
import React, { useEffect, useState } from 'react';
import { fetchStoresWithUserRatings } from '@/services/api';
import { StoreWithRating } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import StoreCard from '@/components/StoreCard';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

const UserStoreList: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    if (!user) {
      toast.error('You must be logged in to view stores');
      return;
    }

    setLoading(true);
    try {
      const filters: any = {};
      if (nameFilter) filters.name = nameFilter;
      if (addressFilter) filters.address = addressFilter;

      const data = await fetchStoresWithUserRatings(user.id, filters);
      setStores(data);
    } catch (error) {
      console.error('Failed to load stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setNameFilter(searchQuery);
    setAddressFilter(searchQuery);
    loadStores();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Stores</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or address..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No stores found</h3>
          <p className="text-muted-foreground">
            Try changing your search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              onRatingUpdate={loadStores}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStoreList;
