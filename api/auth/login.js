const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase, initializeDatabase } = require('../../lib/database');

// Initialize database on first request
initializeDatabase();

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!username && !email) {
    return res.status(400).json({ error: 'Username or email is required' });
  }

  try {
    const db = getDatabase();
    
    let query = 'SELECT * FROM users WHERE ';
    let params = [];

    if (username) {
      query += 'username = ?';
      params.push(username);
    } else if (email) {
      query += 'email = ?';
      params.push(email);
    }

    const user = db.prepare(query).get(...params);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = bcryptjs.compareSync(password, user.password);

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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
