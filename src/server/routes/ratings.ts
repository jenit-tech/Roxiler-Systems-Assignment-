
import { Router } from 'express';
import { db } from '../db';
import { authenticate } from '../middleware/auth';
import { validateRating } from '../utils/validation';

const router = Router();

// Get all ratings for a store
router.get('/store/:storeId', async (req, res, next) => {
  try {
    const { storeId } = req.params;
    
    const query = `
      SELECT r.id, r.store_id, r.user_id, r.rating, r.created_at, r.updated_at,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) as user
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
    `;
    
    const result = await db.query(query, [storeId]);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get all ratings submitted by a user
router.get('/user/:userId', authenticate, async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Regular users can only see their own ratings
    if (req.user?.role !== 'ADMIN' && req.user?.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    
    const query = `
      SELECT r.id, r.store_id, r.user_id, r.rating, r.created_at, r.updated_at,
        json_build_object(
          'id', s.id,
          'name', s.name,
          'email', s.email,
          'address', s.address
        ) as store
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
    `;
    
    const result = await db.query(query, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Submit or update a rating
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user?.id;
    
    // Validate rating
    const validationErrors = validateRating({ storeId, rating });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    // Check if store exists
    const storeResult = await db.query('SELECT * FROM stores WHERE id = $1', [storeId]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check if user already rated this store
    const existingRating = await db.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );
    
    let result;
    
    if (existingRating.rows.length > 0) {
      // Update existing rating
      result = await db.query(
        'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3 RETURNING *',
        [rating, userId, storeId]
      );
    } else {
      // Create new rating
      result = await db.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *',
        [userId, storeId, rating]
      );
    }
    
    // Get average rating for the store
    const avgRatingResult = await db.query(
      'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = $1',
      [storeId]
    );
    
    const averageRating = avgRatingResult.rows[0].average_rating;
    
    res.status(existingRating.rows.length > 0 ? 200 : 201).json({
      ...result.rows[0],
      average_rating: averageRating
    });
  } catch (error) {
    next(error);
  }
});

// Delete a rating
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get rating details to check user
    const ratingResult = await db.query('SELECT * FROM ratings WHERE id = $1', [id]);
    
    if (ratingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    const rating = ratingResult.rows[0];
    
    // Users can only delete their own ratings, admins can delete any
    if (req.user?.role !== 'ADMIN' && req.user?.id !== rating.user_id) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    
    // Delete the rating
    await db.query('DELETE FROM ratings WHERE id = $1', [id]);
    
    // Get updated average rating for the store
    const avgRatingResult = await db.query(
      'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = $1',
      [rating.store_id]
    );
    
    const averageRating = avgRatingResult.rows[0].average_rating || 0;
    
    res.json({
      message: 'Rating deleted successfully',
      store_id: rating.store_id,
      average_rating: averageRating
    });
  } catch (error) {
    next(error);
  }
});

export const ratingRoutes = router;
