
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import { StoreWithRating } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { submitRating } from '@/services/api';

interface StoreCardProps {
  store: StoreWithRating;
  onRatingUpdate: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onRatingUpdate }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);

  const handleRatingChange = async (rating: number) => {
    if (!user) {
      toast.error('You must be logged in to rate a store');
      return;
    }

    try {
      setSubmitting(true);
      await submitRating(store.id, user.id, rating);
      toast.success('Rating submitted successfully');
      onRatingUpdate();
    } catch (error) {
      toast.error('Failed to submit rating');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p>{store.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Overall Rating</p>
            <div className="flex items-center gap-2">
              <StarRating rating={store.averageRating} readonly />
              <span>({store.averageRating.toFixed(1)})</span>
            </div>
          </div>
          {user && user.role === 'USER' && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Rating</p>
              <div className="mt-1">
                <StarRating
                  rating={store.userRating?.rating || 0}
                  onRatingChange={handleRatingChange}
                  readonly={submitting}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {user && user.role === 'USER' && store.userRating ? (
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(store.userRating.updatedAt).toLocaleDateString()}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              disabled={submitting}
              onClick={() => {
                toast.info('You can update your rating by clicking on the stars above');
              }}
            >
              Update Rating
            </Button>
          </div>
        ) : user && user.role === 'USER' ? (
          <Button 
            variant="outline" 
            size="sm"
            disabled={submitting}
            onClick={() => {
              toast.info('Click on the stars to rate this store');
            }}
          >
            Submit Rating
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
