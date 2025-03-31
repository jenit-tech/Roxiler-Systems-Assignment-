
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import UserStoreList from "@/pages/user/StoreList";
import UserProfile from "@/pages/user/UserProfile";
import StoreOwnerDashboard from "@/pages/store-owner/StoreOwnerDashboard";
import StoreOwnerProfile from "@/pages/store-owner/StoreOwnerProfile";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserList from "@/pages/admin/UserList";
import StoreList from "@/pages/admin/StoreList";
import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";

const queryClient = new QueryClient();

// Protected route component that checks user role
const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectPath = "/login" 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[]; 
  redirectPath?: string;
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Normal user routes */}
      <Route path="/user/stores" element={
        <ProtectedRoute allowedRoles={['USER']}>
          <UserStoreList />
        </ProtectedRoute>
      } />
      <Route path="/user/profile" element={
        <ProtectedRoute allowedRoles={['USER']}>
          <UserProfile />
        </ProtectedRoute>
      } />

      {/* Store owner routes */}
      <Route path="/store-owner/dashboard" element={
        <ProtectedRoute allowedRoles={['STORE_OWNER']}>
          <StoreOwnerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/store-owner/profile" element={
        <ProtectedRoute allowedRoles={['STORE_OWNER']}>
          <StoreOwnerProfile />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <UserList />
        </ProtectedRoute>
      } />
      <Route path="/admin/stores" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <StoreList />
        </ProtectedRoute>
      } />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
