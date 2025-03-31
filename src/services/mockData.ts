
import { User, Store, Rating, DashboardStats, UserRole } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'System Administrator',
    email: 'admin@example.com',
    address: '123 Admin Street, Admin City, Admin Country',
    role: 'ADMIN'
  },
  {
    id: '2',
    name: 'Store Owner One',
    email: 'store@example.com',
    address: '456 Store Avenue, Store City, Store Country',
    role: 'STORE_OWNER'
  },
  {
    id: '3',
    name: 'Normal User One',
    email: 'user@example.com',
    address: '789 User Boulevard, User City, User Country',
    role: 'USER'
  },
  {
    id: '4',
    name: 'Store Owner Two',
    email: 'store2@example.com',
    address: '101 Another Store Street, Store City, Store Country',
    role: 'STORE_OWNER'
  },
  {
    id: '5',
    name: 'Normal User Two',
    email: 'user2@example.com',
    address: '202 Another User Avenue, User City, User Country',
    role: 'USER'
  }
];

// Mock Stores
export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Grocery Emporium',
    email: 'store@example.com',
    address: '456 Store Avenue, Store City, Store Country',
    ownerId: '2',
    averageRating: 4.2
  },
  {
    id: '2',
    name: 'Tech Haven',
    email: 'store2@example.com',
    address: '101 Another Store Street, Store City, Store Country',
    ownerId: '4',
    averageRating: 3.7
  },
  {
    id: '3',
    name: 'Fashion Forward',
    email: 'fashion@example.com',
    address: '303 Fashion Street, Fashion City, Fashion Country',
    ownerId: '2',
    averageRating: 4.5
  },
  {
    id: '4',
    name: 'Book Nook',
    email: 'books@example.com',
    address: '404 Reading Road, Book City, Book Country',
    ownerId: '4',
    averageRating: 4.8
  },
  {
    id: '5',
    name: 'Health Mart',
    email: 'health@example.com',
    address: '505 Wellness Way, Health City, Health Country',
    ownerId: '2',
    averageRating: 3.9
  }
];

// Mock Ratings
export const mockRatings: Rating[] = [
  {
    id: '1',
    storeId: '1',
    userId: '3',
    rating: 4,
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z'
  },
  {
    id: '2',
    storeId: '2',
    userId: '3',
    rating: 3,
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z'
  },
  {
    id: '3',
    storeId: '1',
    userId: '5',
    rating: 5,
    createdAt: '2023-03-10T09:45:00Z',
    updatedAt: '2023-03-10T09:45:00Z'
  },
  {
    id: '4',
    storeId: '3',
    userId: '3',
    rating: 4,
    createdAt: '2023-04-05T16:20:00Z',
    updatedAt: '2023-04-05T16:20:00Z'
  },
  {
    id: '5',
    storeId: '4',
    userId: '5',
    rating: 5,
    createdAt: '2023-05-12T11:10:00Z',
    updatedAt: '2023-05-12T11:10:00Z'
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  totalStores: mockStores.length,
  totalRatings: mockRatings.length
};

// Helper function to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get a store by ID
export const getStoreById = (id: string): Store | undefined => {
  return mockStores.find(store => store.id === id);
};

// Helper function to get a store by owner ID
export const getStoreByOwnerId = (ownerId: string): Store | undefined => {
  return mockStores.find(store => store.ownerId === ownerId);
};

// Helper function to get ratings by store ID
export const getRatingsByStoreId = (storeId: string): Rating[] => {
  return mockRatings.filter(rating => rating.storeId === storeId);
};

// Helper function to get a rating by user ID and store ID
export const getRatingByUserAndStore = (userId: string, storeId: string): Rating | undefined => {
  return mockRatings.find(rating => rating.userId === userId && rating.storeId === storeId);
};

// Helper function to get users who rated a specific store
export const getUsersWhoRatedStore = (storeId: string): User[] => {
  const userIds = getRatingsByStoreId(storeId).map(rating => rating.userId);
  return mockUsers.filter(user => userIds.includes(user.id));
};
