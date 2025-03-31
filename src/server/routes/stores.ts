
import { Router } from 'express';
import { db } from '../db';
import { authenticate, authorize } from '../middleware/auth';
import { validateStore } from '../utils/validation';

const router = Router();

// Get all stores
router.get('/', async (req, res, next) => {
  try {
    const { name, address } = req.query;
    const userId = req.user?.id;
    
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
        AVG(r.rating) as average_rating,
        (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    const params: any[] = [userId || null];
    let paramIndex = 2;
    
    query += ' WHERE 1=1';
    
    if (name) {
      query += ` AND s.name ILIKE $${paramIndex}`;
      params.push(`%${name}%`);
      paramIndex++;
    }
    
    if (address) {
      query += ` AND s.address ILIKE $${paramIndex}`;
      params.push(`%${address}%`);
      paramIndex++;
    }
    
    query += ' GROUP BY s.id';
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get a store by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
        AVG(r.rating) as average_rating,
        (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_rating,
        (SELECT json_agg(json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'rating', r2.rating
        ))
        FROM ratings r2
        JOIN users u ON r2.user_id = u.id
        WHERE r2.store_id = s.id) as ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $2
      GROUP BY s.id
    `;
    
    const result = await db.query(query, [userId || null, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create a new store (admin only)
router.post('/', authenticate, authorize(['ADMIN']), async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;
    
    // Validate input
    const validationErrors = validateStore(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    // Check if email is unique
    const existingStore = await db.query('SELECT * FROM stores WHERE email = $1', [email]);
    if (existingStore.rows.length > 0) {
      return res.status(409).json({ message: 'Store with this email already exists' });
    }
    
    // If owner ID is provided, check if user exists and is a STORE_OWNER
    if (ownerId) {
      const ownerResult = await db.query('SELECT * FROM users WHERE id = $1', [ownerId]);
      
      if (ownerResult.rows.length === 0) {
        return res.status(404).json({ message: 'Owner user not found' });
      }
      
      const owner = ownerResult.rows[0];
      
      // If user is not a store owner, update their role
      if (owner.role !== 'STORE_OWNER') {
        await db.query('UPDATE users SET role = $1 WHERE id = $2', ['STORE_OWNER', ownerId]);
      }
    }
    
    // Insert new store
    const result = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, ownerId || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update a store (admin only)
router.put('/:id', authenticate, authorize(['ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;
    
    // Check if store exists
    const existingStore = await db.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (existingStore.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Build update query dynamically
    let query = 'UPDATE stores SET updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (name) {
      query += `, name = $${paramIndex}`;
      params.push(name);
      paramIndex++;
    }
    
    if (email) {
      query += `, email = $${paramIndex}`;
      params.push(email);
      paramIndex++;
    }
    
    if (address) {
      query += `, address = $${paramIndex}`;
      params.push(address);
      paramIndex++;
    }
    
    if (ownerId !== undefined) {
      // If owner ID is provided and not null, check if user exists and is a STORE_OWNER
      if (ownerId !== null) {
        const ownerResult = await db.query('SELECT * FROM users WHERE id = $1', [ownerId]);
        
        if (ownerResult.rows.length === 0) {
          return res.status(404).json({ message: 'Owner user not found' });
        }
        
        const owner = ownerResult.rows[0];
        
        // If user is not a store owner, update their role
        if (owner.role !== 'STORE_OWNER') {
          await db.query('UPDATE users SET role = $1 WHERE id = $2', ['STORE_OWNER', ownerId]);
        }
      }
      
      query += `, owner_id = $${paramIndex}`;
      params.push(ownerId);
      paramIndex++;
    }
    
    query += ` WHERE id = $${paramIndex} RETURNING *`;
    params.push(id);
    
    const result = await db.query(query, params);
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete a store (admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if store exists
    const existingStore = await db.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (existingStore.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Delete store
    await db.query('DELETE FROM stores WHERE id = $1', [id]);
    
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export const storeRoutes = router;
