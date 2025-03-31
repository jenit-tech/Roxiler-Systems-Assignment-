
import { Router } from 'express';
import { db } from '../db';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get admin dashboard stats
router.get('/admin', authenticate, authorize(['ADMIN']), async (req, res, next) => {
  try {
    // Get total users count
    const usersResult = await db.query('SELECT COUNT(*) as total_users FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total_users);
    
    // Get total stores count
    const storesResult = await db.query('SELECT COUNT(*) as total_stores FROM stores');
    const totalStores = parseInt(storesResult.rows[0].total_stores);
    
    // Get total ratings count
    const ratingsResult = await db.query('SELECT COUNT(*) as total_ratings FROM ratings');
    const totalRatings = parseInt(ratingsResult.rows[0].total_ratings);
    
    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    next(error);
  }
});

// Get store owner dashboard stats
router.get('/store-owner', authenticate, authorize(['STORE_OWNER']), async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    // Get store details
    const storeResult = await db.query(
      'SELECT * FROM stores WHERE owner_id = $1',
      [userId]
    );
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }
    
    const store = storeResult.rows[0];
    
    // Get average rating
    const ratingResult = await db.query(
      'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = $1',
      [store.id]
    );
    
    const averageRating = ratingResult.rows[0].average_rating || 0;
    
    // Get users who rated the store
    const usersResult = await db.query(`
      SELECT u.id, u.name, u.email, r.rating, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `, [store.id]);
    
    const ratingUsers = usersResult.rows;
    
    // Get total ratings count
    const totalRatingsResult = await db.query(
      'SELECT COUNT(*) as total_ratings FROM ratings WHERE store_id = $1',
      [store.id]
    );
    
    const totalRatings = parseInt(totalRatingsResult.rows[0].total_ratings);
    
    res.json({
      store,
      averageRating,
      totalRatings,
      ratingUsers
    });
  } catch (error) {
    next(error);
  }
});

export const dashboardRoutes = router;
