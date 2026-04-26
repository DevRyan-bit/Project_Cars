const { getDatabase, initializeDatabase } = require('../../lib/database');

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDatabase();
    const cars = db.prepare(`
      SELECT id, brand, model, type, year, price, image, description,
             specs_engine, specs_horsepower, specs_acceleration,
             specs_top_speed, specs_fuel_type, colors, features
      FROM cars ORDER BY created_at DESC
    `).all();

    // Parse JSON fields
    const formattedCars = cars.map(car => ({
      ...car,
      specs: {
        engine: car.specs_engine,
        horsepower: car.specs_horsepower,
        acceleration: car.specs_acceleration,
        topSpeed: car.specs_top_speed,
        fuelType: car.specs_fuel_type
      },
      colors: car.colors ? JSON.parse(car.colors) : [],
      features: car.features ? JSON.parse(car.features) : []
    }));

    res.json({ cars: formattedCars });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
