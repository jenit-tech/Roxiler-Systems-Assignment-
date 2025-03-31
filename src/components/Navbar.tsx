
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, Store, UserCircle, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBasedLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case 'ADMIN':
        return (
          <>
            <li>
              <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent">
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent">
                <UserCircle size={18} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/stores" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent">
                <Store size={18} />
                <span>Stores</span>
              </Link>
            </li>
          </>
        );
      case 'USER':
        return (
          <>
            <li>
              <Link to="/user/stores" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent">
                <Store size={18} />
                <span>Stores</span>
              </Link>
            </li>
            <li>
              <Link to="/user/profile" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent">
                <UserCircle size={18} />
                <span>Profile</span>
              </Link>
            </li>
          </>
        );
      case 'STORE_OWNER':
        return (
          <>
            <li>
              <Link to="/store-owner/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent">
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/store-owner/profile" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent">
                <UserCircle size={18} />
                <span>Profile</span>
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">Rating Portal</Link>
            {user && (
              <ul className="hidden md:flex items-center space-x-2">
                {getRoleBasedLinks()}
              </ul>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden md:inline-block">
                  Welcome, {user.name.split(' ')[0]}
                </span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    <User size={16} className="mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm" className="bg-primary-foreground text-primary">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        {user && (
          <div className="md:hidden mt-4">
            <ul className="flex flex-col space-y-2">
              {getRoleBasedLinks()}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
