const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all transactions (admin only)
router.get('/', authenticateToken, authorizeAdmin, (req, res) => {
  const { status, type, limit = 50, offset = 0 } = req.query;

  let query = `
    SELECT t.*, o.customer_name, o.customer_email, u.username as processed_by_username
    FROM transactions t
    LEFT JOIN orders o ON t.order_id = o.id
    LEFT JOIN users u ON t.processed_by = u.id
  `;
  let params = [];

  const conditions = [];
  if (status) {
    conditions.push('t.status = ?');
    params.push(status);
  }
  if (type) {
    conditions.push('t.type = ?');
    params.push(type);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY t.transaction_date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ transactions });
  });
});

// Get transaction by ID (admin only)
router.get('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT t.*, o.customer_name, o.customer_email, u.username as processed_by_username
    FROM transactions t
    LEFT JOIN orders o ON t.order_id = o.id
    LEFT JOIN users u ON t.processed_by = u.id
    WHERE t.id = ?
  `, [id], (err, transaction) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  });
});

// Create transaction (admin only)
router.post('/', authenticateToken, authorizeAdmin, (req, res) => {
  const {
    order_id,
    amount,
    type,
    status = 'pending',
    payment_method,
    notes
  } = req.body;

  if (!amount || !type) {
    return res.status(400).json({ error: 'Amount and type are required' });
  }

  if (!['payment', 'refund', 'adjustment'].includes(type)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }

  const transactionId = uuidv4();

  db.run(`
    INSERT INTO transactions (id, order_id, amount, type, status, payment_method, notes, processed_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    transactionId,
    order_id || null,
    amount,
    type,
    status,
    payment_method || '',
    notes || '',
    req.user.id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create transaction' });
    }

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: {
        id: transactionId,
        order_id,
        amount,
        type,
        status,
        payment_method,
        notes,
        processed_by: req.user.id
      }
    });
  });
});

// Update transaction (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { status, payment_method, notes } = req.body;

  db.run(`
    UPDATE transactions SET
      status = ?, payment_method = ?, notes = ?
    WHERE id = ?
  `, [
    status, payment_method || '', notes || '', id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update transaction' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated successfully' });
  });
});

// Delete transaction (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete transaction' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  });
});

// Get transaction statistics (admin only)
router.get('/stats/summary', authenticateToken, authorizeAdmin, (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_transactions FROM transactions',
    'SELECT COUNT(*) as completed_transactions FROM transactions WHERE status = "completed"',
    'SELECT SUM(amount) as total_amount FROM transactions WHERE status = "completed" AND type = "payment"',
    'SELECT SUM(amount) as total_refunds FROM transactions WHERE status = "completed" AND type = "refund"',
    'SELECT COUNT(*) as pending_transactions FROM transactions WHERE status = "pending"'
  ];

  const results = {};

  let completed = 0;
  const totalQueries = queries.length;

  queries.forEach((query, index) => {
    db.get(query, [], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (index === 0) results.total_transactions = row.total_transactions || 0;
      else if (index === 1) results.completed_transactions = row.completed_transactions || 0;
      else if (index === 2) results.total_amount = row.total_amount || 0;
      else if (index === 3) results.total_refunds = row.total_refunds || 0;
      else if (index === 4) results.pending_transactions = row.pending_transactions || 0;

      completed++;
      if (completed === totalQueries) {
        res.json({ stats: results });
      }
    });
  });
});

module.exports = router;