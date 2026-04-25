const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const { authenticateToken, authorizeSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { username, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  let query = 'SELECT * FROM users WHERE ';
  let params = [];

  if (username) {
    query += 'username = ?';
    params.push(username);
  } else if (email) {
    query += 'email = ?';
    params.push(email);
  } else {
    return res.status(400).json({ error: 'Username or email is required' });
  }

  db.get(query, params, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) {
        return res.status(500).json({ error: 'Password comparison error' });
      }

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  });
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  });
});

// Create admin user (super admin only)
router.post('/users', authenticateToken, authorizeSuperAdmin, (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  if (role !== 'admin') {
    return res.status(400).json({ error: 'Invalid role. Only admin role can be created' });
  }

  // Limit admin count to 5 under the super admin
  db.get('SELECT COUNT(*) AS admin_count FROM users WHERE role = ?', ['admin'], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.admin_count >= 5) {
      return res.status(400).json({ error: 'Maximum of 5 admin users reached' });
    }

    // Check if user already exists
    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }

      // Hash password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Password hashing error' });
      }

      const userId = uuidv4();
      db.run(
        'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [userId, username, email, hashedPassword, role],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          res.status(201).json({
            message: 'Admin user created successfully',
            user: {
              id: userId,
              username,
              email,
              role
            }
          });
        }
      );
    });
  });
});
});

// Get all users (super admin only)
router.get('/users', authenticateToken, authorizeSuperAdmin, (req, res) => {
  db.all('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC', [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ users });
  });
});

// Delete user (super admin only)
router.delete('/users/:id', authenticateToken, authorizeSuperAdmin, (req, res) => {
  const { id } = req.params;

  // Prevent deleting super admin
  db.get('SELECT role FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot delete super admin' });
    }

    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete user' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    });
  });
});

module.exports = router;