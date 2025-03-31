
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchStores } from '@/services/api';
import { Store } from '@/types';
import { PlusCircle, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '@/components/StarRating';

type SortField = 'name' | 'email' | 'address' | 'averageRating';
type SortDirection = 'asc' | 'desc';

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    loadStores();
  }, [nameFilter, emailFilter, addressFilter]);

  const loadStores = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (nameFilter) filters.name = nameFilter;
      if (emailFilter) filters.email = emailFilter;
      if (addressFilter) filters.address = addressFilter;

      const data = await fetchStores(filters);
      setStores(data);
    } catch (error) {
      console.error('Failed to load stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStores = [...stores].sort((a, b) => {
    const factor = sortDirection === 'asc' ? 1 : -1;
    if (a[sortField] < b[sortField]) return -1 * factor;
    if (a[sortField] > b[sortField]) return 1 * factor;
    return 0;
  });

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stores</h1>
        <Link to="/admin/stores/new">
          <Button>
            <PlusCircle size={18} className="mr-2" />
            Add Store
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by name"
                  className="pl-8"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by email"
                  className="pl-8"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by address"
                  className="pl-8"
                  value={addressFilter}
                  onChange={(e) => setAddressFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      <SortIndicator field="name" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      Email
                      <SortIndicator field="email" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('address')}>
                    <div className="flex items-center">
                      Address
                      <SortIndicator field="address" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('averageRating')}>
                    <div className="flex items-center">
                      Rating
                      <SortIndicator field="averageRating" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Loading stores...
                    </TableCell>
                  </TableRow>
                ) : sortedStores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No stores found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{store.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StarRating rating={store.averageRating} size={16} readonly />
                          <span className="text-sm">({store.averageRating.toFixed(1)})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/stores/${store.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreList;
