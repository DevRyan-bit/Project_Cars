const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all cars (public)
router.get('/', (req, res) => {
  db.all(`
    SELECT id, brand, model, type, year, price, image, description,
           specs_engine, specs_horsepower, specs_acceleration,
           specs_top_speed, specs_fuel_type, colors, features
    FROM cars ORDER BY created_at DESC
  `, [], (err, cars) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

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
  });
});

// Get car by ID (public)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT id, brand, model, type, year, price, image, description,
           specs_engine, specs_horsepower, specs_acceleration,
           specs_top_speed, specs_fuel_type, colors, features
    FROM cars WHERE id = ?
  `, [id], (err, car) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Parse JSON fields
    const formattedCar = {
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
    };

    res.json({ car: formattedCar });
  });
});

// Create car (admin only)
router.post('/', authenticateToken, authorizeAdmin, (req, res) => {
  const {
    brand, model, type, year, price, image, description,
    specs, colors, features
  } = req.body;

  if (!brand || !model || !type || !year || !price) {
    return res.status(400).json({ error: 'Brand, model, type, year, and price are required' });
  }

  const carId = `${brand.toLowerCase()}-${model.toLowerCase()}`.replace(/\s+/g, '-');

  // Check if car already exists
  db.get('SELECT id FROM cars WHERE id = ?', [carId], (err, existingCar) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingCar) {
      return res.status(409).json({ error: 'Car with this brand and model already exists' });
    }

    db.run(`
      INSERT INTO cars (id, brand, model, type, year, price, image, description,
                        specs_engine, specs_horsepower, specs_acceleration,
                        specs_top_speed, specs_fuel_type, colors, features)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      carId,
      brand,
      model,
      type,
      year,
      price,
      image || '',
      description || '',
      specs?.engine || '',
      specs?.horsepower || 0,
      specs?.acceleration || '',
      specs?.topSpeed || '',
      specs?.fuelType || '',
      JSON.stringify(colors || []),
      JSON.stringify(features || [])
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create car' });
      }

      res.status(201).json({
        message: 'Car created successfully',
        car: {
          id: carId,
          brand,
          model,
          type,
          year,
          price,
          image,
          description,
          specs,
          colors,
          features
        }
      });
    });
  });
});

// Update car (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const {
    brand, model, type, year, price, image, description,
    specs, colors, features
  } = req.body;

  if (!brand || !model || !type || !year || !price) {
    return res.status(400).json({ error: 'Brand, model, type, year, and price are required' });
  }

  db.run(`
    UPDATE cars SET
      brand = ?, model = ?, type = ?, year = ?, price = ?,
      image = ?, description = ?, specs_engine = ?, specs_horsepower = ?,
      specs_acceleration = ?, specs_top_speed = ?, specs_fuel_type = ?,
      colors = ?, features = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    brand, model, type, year, price, image || '', description || '',
    specs?.engine || '', specs?.horsepower || 0, specs?.acceleration || '',
    specs?.topSpeed || '', specs?.fuelType || '',
    JSON.stringify(colors || []), JSON.stringify(features || []),
    id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update car' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ message: 'Car updated successfully' });
  });
});

// Delete car (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM cars WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete car' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  });
});

module.exports = router;