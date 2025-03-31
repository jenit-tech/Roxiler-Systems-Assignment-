
import { User, Store, Rating, DashboardStats, StoreWithRating, UserWithStore } from '@/types';
import { 
  mockUsers, 
  mockStores, 
  mockRatings, 
  mockDashboardStats,
  getStoreByOwnerId,
  getRatingByUserAndStore,
  getUsersWhoRatedStore
} from './mockData';

// User APIs
export const fetchUsers = async (filters?: { name?: string; email?: string; address?: string; role?: string }): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredUsers = [...mockUsers];
  
  if (filters) {
    if (filters.name) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    if (filters.email) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }
    if (filters.address) {
      filteredUsers = filteredUsers.filter(user => 
        user.address.toLowerCase().includes(filters.address!.toLowerCase())
      );
    }
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => 
        user.role === filters.role
      );
    }
  }
  
  return filteredUsers;
};

export const fetchUserDetails = async (userId: string): Promise<UserWithStore> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  
  if (user.role === 'STORE_OWNER') {
    const store = getStoreByOwnerId(userId);
    return { ...user, store };
  }
  
  return user;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newUser: User = {
    ...user,
    id: (Math.floor(Math.random() * 1000) + 10).toString()
  };
  
  // In a real app, this would add the user to the database
  return newUser;
};

// Store APIs
export const fetchStores = async (filters?: { name?: string; email?: string; address?: string }): Promise<Store[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredStores = [...mockStores];
  
  if (filters) {
    if (filters.name) {
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    if (filters.email) {
      filteredStores = filteredStores.filter(store => 
        store.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }
    if (filters.address) {
      filteredStores = filteredStores.filter(store => 
        store.address.toLowerCase().includes(filters.address!.toLowerCase())
      );
    }
  }
  
  return filteredStores;
};

export const fetchStoresWithUserRatings = async (
  userId: string,
  filters?: { name?: string; address?: string }
): Promise<StoreWithRating[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredStores = [...mockStores];
  
  if (filters) {
    if (filters.name) {
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    if (filters.address) {
      filteredStores = filteredStores.filter(store => 
        store.address.toLowerCase().includes(filters.address!.toLowerCase())
      );
    }
  }
  
  return filteredStores.map(store => {
    const userRating = getRatingByUserAndStore(userId, store.id);
    return { ...store, userRating };
  });
};

export const createStore = async (store: Omit<Store, 'id' | 'averageRating'>): Promise<Store> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newStore: Store = {
    ...store,
    id: (Math.floor(Math.random() * 1000) + 10).toString(),
    averageRating: 0
  };
  
  // In a real app, this would add the store to the database
  return newStore;
};

export const fetchStoreOwnerDashboard = async (ownerId: string): Promise<{
  store: Store;
  ratingUsers: User[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const store = getStoreByOwnerId(ownerId);
  if (!store) throw new Error('Store not found for this owner');
  
  const ratingUsers = getUsersWhoRatedStore(store.id);
  
  return { store, ratingUsers };
};

// Rating APIs
export const submitRating = async (storeId: string, userId: string, rating: number): Promise<Rating> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingRating = getRatingByUserAndStore(userId, storeId);
  const now = new Date().toISOString();
  
  if (existingRating) {
    // Update existing rating
    const updatedRating = {
      ...existingRating,
      rating,
      updatedAt: now
    };
    
    // In a real app, this would update the rating in the database
    return updatedRating;
  } else {
    // Create new rating
    const newRating: Rating = {
      id: (Math.floor(Math.random() * 1000) + 10).toString(),
      storeId,
      userId,
      rating,
      createdAt: now,
      updatedAt: now
    };
    
    // In a real app, this would add the rating to the database
    return newRating;
  }
};

// Dashboard Stats
export const fetchAdminDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDashboardStats;
};

// Password update
export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would verify the current password and update it
  // For the mock implementation, we'll just simulate success
  return true;
};
