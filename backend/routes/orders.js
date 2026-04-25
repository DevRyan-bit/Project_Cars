const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all orders (admin only)
router.get('/', authenticateToken, authorizeAdmin, (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;

  let query = `
    SELECT o.*, u.username as created_by_username
    FROM orders o
    LEFT JOIN users u ON o.created_by = u.id
  `;
  let params = [];

  if (status) {
    query += ' WHERE o.status = ?';
    params.push(status);
  }

  query += ' ORDER BY o.order_date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ orders });
  });
});

// Get order by ID (admin only)
router.get('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT o.*, u.username as created_by_username
    FROM orders o
    LEFT JOIN users u ON o.created_by = u.id
    WHERE o.id = ?
  `, [id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  });
});

// Create order (admin only)
router.post('/', authenticateToken, authorizeAdmin, (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    car_id,
    car_brand,
    car_model,
    selected_color,
    quantity = 1,
    total_amount,
    status = 'pending',
    notes
  } = req.body;

  if (!customer_name || !customer_email || !car_id || !car_brand || !car_model || !total_amount) {
    return res.status(400).json({
      error: 'Customer name, email, car details, and total amount are required'
    });
  }

  const orderId = uuidv4();

  db.run(`
    INSERT INTO orders (id, customer_name, customer_email, customer_phone,
                        car_id, car_brand, car_model, selected_color,
                        quantity, total_amount, status, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    orderId,
    customer_name,
    customer_email,
    customer_phone || '',
    car_id,
    car_brand,
    car_model,
    selected_color || '',
    quantity,
    total_amount,
    status,
    notes || '',
    req.user.id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create order' });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        customer_name,
        customer_email,
        customer_phone,
        car_id,
        car_brand,
        car_model,
        selected_color,
        quantity,
        total_amount,
        status,
        notes,
        created_by: req.user.id
      }
    });
  });
});

// Update order (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const {
    customer_name,
    customer_email,
    customer_phone,
    selected_color,
    quantity,
    total_amount,
    status,
    notes
  } = req.body;

  db.run(`
    UPDATE orders SET
      customer_name = ?, customer_email = ?, customer_phone = ?,
      selected_color = ?, quantity = ?, total_amount = ?,
      status = ?, notes = ?
    WHERE id = ?
  `, [
    customer_name, customer_email, customer_phone || '',
    selected_color || '', quantity, total_amount, status, notes || '',
    id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully' });
  });
});

// Delete order (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete order' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  });
});

// Get order statistics (admin only)
router.get('/stats/summary', authenticateToken, authorizeAdmin, (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_orders FROM orders',
    'SELECT COUNT(*) as pending_orders FROM orders WHERE status = "pending"',
    'SELECT COUNT(*) as completed_orders FROM orders WHERE status IN ("shipped", "delivered")',
    'SELECT SUM(total_amount) as total_revenue FROM orders WHERE status != "cancelled"',
    'SELECT AVG(total_amount) as avg_order_value FROM orders WHERE status != "cancelled"'
  ];

  const results = {};

  let completed = 0;
  const totalQueries = queries.length;

  queries.forEach((query, index) => {
    db.get(query, [], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (index === 0) results.total_orders = row.total_orders || 0;
      else if (index === 1) results.pending_orders = row.pending_orders || 0;
      else if (index === 2) results.completed_orders = row.completed_orders || 0;
      else if (index === 3) results.total_revenue = row.total_revenue || 0;
      else if (index === 4) results.avg_order_value = row.avg_order_value || 0;

      completed++;
      if (completed === totalQueries) {
        res.json({ stats: results });
      }
    });
  });
});

module.exports = router;