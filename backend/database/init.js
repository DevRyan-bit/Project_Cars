const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database path
const dbPath = path.join(__dirname, '..', 'database', 'cars_catalog.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  const tables = [
    // Users table (for admin authentication)
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Cars table
    `CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      type TEXT NOT NULL,
      year INTEGER NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      description TEXT,
      specs_engine TEXT,
      specs_horsepower INTEGER,
      specs_acceleration TEXT,
      specs_top_speed TEXT,
      specs_fuel_type TEXT,
      colors TEXT, -- JSON string
      features TEXT, -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Orders table
    `CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      car_id TEXT NOT NULL,
      car_brand TEXT NOT NULL,
      car_model TEXT NOT NULL,
      selected_color TEXT,
      quantity INTEGER DEFAULT 1,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      created_by TEXT, -- User ID who created the order
      FOREIGN KEY (created_by) REFERENCES users (id)
    )`,

    // Transactions table
    `CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      order_id TEXT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('payment', 'refund', 'adjustment')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
      payment_method TEXT,
      transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      processed_by TEXT, -- User ID who processed the transaction
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (processed_by) REFERENCES users (id)
    )`
  ];

  let completed = 0;
  const totalTables = tables.length;

  tables.forEach((sql, index) => {
    db.run(sql, (err) => {
      if (err) {
        console.error(`Error creating table ${index + 1}:`, err);
      } else {
        console.log(`Table ${index + 1} created successfully`);
      }

      completed++;
      if (completed === totalTables) {
        // All tables created, now seed data
        seedDatabase();
      }
    });
  });
}

function seedDatabase() {
  // Insert default super admin user
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('admin', 10);

  db.run(`
    INSERT OR IGNORE INTO users (id, username, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `, ['super-admin-1', 'admin', 'admin@example.com', hashedPassword, 'super_admin'], (err) => {
    if (err) {
      console.error('Error seeding super admin:', err);
    } else {
      console.log('Super admin user seeded');
    }
  });

  // Seed cars data
  const cars = [
    {
      id: "toyota-camry",
      brand: "Toyota",
      model: "Camry",
      type: "Sedan",
      year: 2025,
      price: 28500,
      image: "/assets/car-sedan.jpg",
      description: "The iconic mid-size sedan redefining comfort and reliability with cutting-edge hybrid technology.",
      specs: {
        engine: "2.5L Hybrid",
        horsepower: 208,
        acceleration: "7.6s",
        topSpeed: "130 mph",
        fuelType: "Hybrid"
      },
      colors: [
        { name: "Supersonic Red", hex: "#C41E3A" },
        { name: "Wind Chill Pearl", hex: "#F0EDE8" },
        { name: "Midnight Black", hex: "#1A1A2E" },
        { name: "Celestial Silver", hex: "#C0C0C0" }
      ],
      features: [
        "Toyota Safety Sense 3.0",
        "12.3\" Touchscreen",
        "Wireless CarPlay",
        "JBL Premium Audio"
      ]
    },
    {
      id: "toyota-rav4",
      brand: "Toyota",
      model: "RAV4",
      type: "SUV",
      year: 2025,
      price: 32000,
      image: "/assets/car-suv.jpg",
      description: "The versatile compact SUV that combines urban sophistication with off-road capability.",
      specs: {
        engine: "2.5L 4-Cylinder",
        horsepower: 203,
        acceleration: "7.1s",
        topSpeed: "125 mph",
        fuelType: "Gasoline"
      },
      colors: [
        { name: "Barcelona Red", hex: "#9B1C2C" },
        { name: "Radiant Sea", hex: "#2E5C6E" },
        { name: "Salsa Red Pearl", hex: "#8B1A1A" },
        { name: "Ice Cap", hex: "#F8F8F8" }
      ],
      features: [
        "Toyota Safety Sense 3.0",
        "8\" Touchscreen Display",
        "Smart Key System",
        "LED Headlights"
      ]
    },
    {
      id: "honda-civic",
      brand: "Honda",
      model: "Civic",
      type: "Sedan",
      year: 2025,
      price: 26500,
      image: "/assets/car-sedan.jpg",
      description: "The perfect blend of sporty performance and everyday practicality.",
      specs: {
        engine: "2.0L Turbo",
        horsepower: 200,
        acceleration: "6.8s",
        topSpeed: "140 mph",
        fuelType: "Gasoline"
      },
      colors: [
        { name: "Rallye Red", hex: "#B22222" },
        { name: "Lunar Silver", hex: "#C0C0C0" },
        { name: "Cosmic Blue", hex: "#1E3A8A" },
        { name: "Platinum White", hex: "#F5F5F5" }
      ],
      features: [
        "Honda Sensing Suite",
        "9\" Display Audio",
        "HondaLink",
        "Sport-Tuned Suspension"
      ]
    },
    {
      id: "ford-mustang",
      brand: "Ford",
      model: "Mustang",
      type: "SAV",
      year: 2025,
      price: 45000,
      image: "/assets/car-suv.jpg",
      description: "The legendary American muscle car with modern performance and technology.",
      specs: {
        engine: "5.0L V8",
        horsepower: 460,
        acceleration: "3.9s",
        topSpeed: "155 mph",
        fuelType: "Gasoline"
      },
      colors: [
        { name: "Grabber Blue", hex: "#1E40AF" },
        { name: "Race Red", hex: "#DC2626" },
        { name: "Oxford White", hex: "#F8F8F8" },
        { name: "Shadow Black", hex: "#1F2937" }
      ],
      features: [
        "10-Speed Automatic",
        "12\" Digital Cluster",
        "Bang & Olufsen Audio",
        "Track Apps"
      ]
    }
  ];

  cars.forEach(car => {
    db.run(`
      INSERT OR IGNORE INTO cars (
        id, brand, model, type, year, price, image, description,
        specs_engine, specs_horsepower, specs_acceleration,
        specs_top_speed, specs_fuel_type, colors, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      car.id,
      car.brand,
      car.model,
      car.type,
      car.year,
      car.price,
      car.image,
      car.description,
      car.specs.engine,
      car.specs.horsepower,
      car.specs.acceleration,
      car.specs.topSpeed,
      car.specs.fuelType,
      JSON.stringify(car.colors),
      JSON.stringify(car.features)
    ], function(err) {
      if (err) {
        console.error('Error inserting car:', err);
      } else if (this.changes > 0) {
        console.log(`Inserted car: ${car.brand} ${car.model}`);
      }
    });
  });

  console.log('Database seeding completed.');
}

module.exports = db;