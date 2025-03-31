
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Store, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const getRedirectPath = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'STORE_OWNER':
        return '/store-owner/dashboard';
      case 'USER':
        return '/user/stores';
      default:
        return '/login';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Store Rating Portal
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            A platform where users can discover and rate stores, helping others make informed decisions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/login">
                  <Button size="lg" className="gap-2">
                    Log In <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline">
                    Register Now
                  </Button>
                </Link>
              </>
            ) : (
              <Link to={getRedirectPath()}>
                <Button size="lg" className="gap-2">
                  Go to Dashboard <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate Stores</h3>
              <p className="text-muted-foreground">
                Submit ratings for stores you've visited and help others make better choices.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Store Owners</h3>
              <p className="text-muted-foreground">
                Monitor your store's performance and see what customers are saying about your business.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">System Administration</h3>
              <p className="text-muted-foreground">
                For administrators to manage users, stores, and monitor platform activity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up with your email, set a password, and provide your details.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Stores</h3>
              <p className="text-muted-foreground">
                Explore the list of registered stores and see their ratings.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Your Ratings</h3>
              <p className="text-muted-foreground">
                Rate stores on a scale of 1-5 stars and help others make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our platform today and start rating your favorite stores or monitor your business performance.
          </p>
          {!user ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Create an Account <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Log In
                </Button>
              </Link>
            </div>
          ) : (
            <Link to={getRedirectPath()}>
              <Button size="lg" variant="secondary" className="gap-2">
                Go to Your Dashboard <ArrowRight size={16} />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-muted/50 border-t">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Store Rating Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
