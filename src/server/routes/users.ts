
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { authenticate, authorize } from '../middleware/auth';
import { validateUser } from '../utils/validation';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, authorize(['ADMIN']), async (req, res, next) => {
  try {
    const { name, email, address, role } = req.query;
    
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, 
        (SELECT AVG(r.rating) FROM ratings r JOIN stores s ON r.store_id = s.id WHERE s.owner_id = u.id) as store_rating
      FROM users u
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (name) {
      query += ` AND u.name ILIKE $${paramIndex}`;
      params.push(`%${name}%`);
      paramIndex++;
    }
    
    if (email) {
      query += ` AND u.email ILIKE $${paramIndex}`;
      params.push(`%${email}%`);
      paramIndex++;
    }
    
    if (address) {
      query += ` AND u.address ILIKE $${paramIndex}`;
      params.push(`%${address}%`);
      paramIndex++;
    }
    
    if (role && role !== 'ALL') {
      query += ` AND u.role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Regular users can only see their own profile
    if (req.user?.role !== 'ADMIN' && req.user?.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    
    const userQuery = `
      SELECT u.id, u.name, u.email, u.address, u.role
      FROM users u
      WHERE u.id = $1
    `;
    
    const userResult = await db.query(userQuery, [id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // If user is a store owner, fetch store details
    if (user.role === 'STORE_OWNER') {
      const storeQuery = `
        SELECT s.*, AVG(r.rating) as average_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.owner_id = $1
        GROUP BY s.id
      `;
      
      const storeResult = await db.query(storeQuery, [id]);
      
      if (storeResult.rows.length > 0) {
        user.store = storeResult.rows[0];
      }
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Create a new user (admin only)
router.post('/', authenticate, authorize(['ADMIN']), async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    // Validate input
    const validationErrors = validateUser(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const result = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
      [name, email, hashedPassword, address, role]
    );
    
    const user = result.rows[0];
    
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Update a user
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;
    
    // Regular users can only update their own profile
    if (req.user?.role !== 'ADMIN' && req.user?.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    
    // Regular users cannot change their role
    if (req.user?.role !== 'ADMIN' && role) {
      return res.status(403).json({ message: 'Cannot change role' });
    }
    
    // Check if user exists
    const existingUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Build update query dynamically
    let query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
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
    
    if (role && req.user?.role === 'ADMIN') {
      query += `, role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    
    query += ` WHERE id = $${paramIndex} RETURNING id, name, email, address, role`;
    params.push(id);
    
    const result = await db.query(query, params);
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete a user (admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export const userRoutes = router;
