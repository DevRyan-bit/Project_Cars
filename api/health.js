module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'ok',
      message: 'Backend is running',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
