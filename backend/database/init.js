const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const isVercel = process.env.NODE_ENV === 'production' && process.env.VERCEL;
const dbPath = isVercel
  ? '/tmp/cars_catalog.json'
  : path.join(__dirname, 'cars_catalog.json');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({}));
}

const adapter = new FileSync(dbPath);
const lowdb = low(adapter);
lowdb.defaults({ users: [], cars: [], orders: [], transactions: [] }).write();

function getTimestamp() {
  return new Date().toISOString();
}

function getUsers() {
  return lowdb.get('users').value();
}

function getCars() {
  return lowdb.get('cars').value();
}

function getOrders() {
  return lowdb.get('orders').value();
}

function getTransactions() {
  return lowdb.get('transactions').value();
}

function userById(id) {
  return lowdb.get('users').find({ id }).value();
}

function carById(id) {
  return lowdb.get('cars').find({ id }).value();
}

function orderById(id) {
  return lowdb.get('orders').find({ id }).value();
}

function transactionById(id) {
  return lowdb.get('transactions').find({ id }).value();
}

function orderWithUser(order) {
  const createdBy = userById(order.created_by);
  return {
    ...order,
    created_by_username: createdBy ? createdBy.username : null,
  };
}

function transactionWithJoin(transaction) {
  const order = transaction.order_id ? orderById(transaction.order_id) : null;
  const processedBy = userById(transaction.processed_by);
  return {
    ...transaction,
    customer_name: order ? order.customer_name : null,
    customer_email: order ? order.customer_email : null,
    processed_by_username: processedBy ? processedBy.username : null,
  };
}

function sortDescending(array, field) {
  return array.slice().sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    if (aValue > bValue) return -1;
    if (aValue < bValue) return 1;
    return 0;
  });
}

function runCallback(callback, err, result, changes = 0) {
  if (typeof callback !== 'function') return;
  callback.call({ changes }, err, result);
}

function initializeDatabase() {
  seedSuperAdmin();
  seedCars();
}

function seedSuperAdmin() {
  const existingAdmin = lowdb.get('users').find({ id: 'super-admin-1' }).value();
  if (existingAdmin) return;

  const hashedPassword = bcrypt.hashSync('admin', 10);
  lowdb.get('users')
    .push({
      id: 'super-admin-1',
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'super_admin',
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
    })
    .write();
}

function seedCars() {
  const existingCars = lowdb.get('cars').size().value();
  if (existingCars > 0) return;

  const cars = [
    {
      id: 'toyota-camry',
      brand: 'Toyota',
      model: 'Camry',
      type: 'Sedan',
      year: 2025,
      price: 28500,
      image: '/assets/car-sedan.jpg',
      description: 'The iconic mid-size sedan redefining comfort and reliability with cutting-edge hybrid technology.',
      specs_engine: '2.5L Hybrid',
      specs_horsepower: 208,
      specs_acceleration: '7.6s',
      specs_top_speed: '130 mph',
      specs_fuel_type: 'Hybrid',
      colors: JSON.stringify([
        { name: 'Supersonic Red', hex: '#C41E3A' },
        { name: 'Wind Chill Pearl', hex: '#F0EDE8' },
        { name: 'Midnight Black', hex: '#1A1A2E' },
        { name: 'Celestial Silver', hex: '#C0C0C0' },
      ]),
      features: JSON.stringify([
        'Toyota Safety Sense 3.0',
        '12.3" Touchscreen',
        'Wireless CarPlay',
        'JBL Premium Audio',
      ]),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
    },
    {
      id: 'toyota-rav4',
      brand: 'Toyota',
      model: 'RAV4',
      type: 'SUV',
      year: 2025,
      price: 32000,
      image: '/assets/car-suv.jpg',
      description: 'The versatile compact SUV that combines urban sophistication with off-road capability.',
      specs_engine: '2.5L 4-Cylinder',
      specs_horsepower: 203,
      specs_acceleration: '7.1s',
      specs_top_speed: '125 mph',
      specs_fuel_type: 'Gasoline',
      colors: JSON.stringify([
        { name: 'Barcelona Red', hex: '#9B1C2C' },
        { name: 'Radiant Sea', hex: '#2E5C6E' },
        { name: 'Salsa Red Pearl', hex: '#8B1A1A' },
        { name: 'Ice Cap', hex: '#F8F8F8' },
      ]),
      features: JSON.stringify([
        'Toyota Safety Sense 3.0',
        '8" Touchscreen Display',
        'Smart Key System',
        'LED Headlights',
      ]),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
    },
    {
      id: 'honda-civic',
      brand: 'Honda',
      model: 'Civic',
      type: 'Sedan',
      year: 2025,
      price: 26500,
      image: '/assets/car-sedan.jpg',
      description: 'The perfect blend of sporty performance and everyday practicality.',
      specs_engine: '2.0L Turbo',
      specs_horsepower: 200,
      specs_acceleration: '6.8s',
      specs_top_speed: '140 mph',
      specs_fuel_type: 'Gasoline',
      colors: JSON.stringify([
        { name: 'Rallye Red', hex: '#B22222' },
        { name: 'Lunar Silver', hex: '#C0C0C0' },
        { name: 'Cosmic Blue', hex: '#1E3A8A' },
        { name: 'Platinum White', hex: '#F5F5F5' },
      ]),
      features: JSON.stringify([
        'Honda Sensing Suite',
        '9" Display Audio',
        'HondaLink',
        'Sport-Tuned Suspension',
      ]),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
    },
    {
      id: 'ford-mustang',
      brand: 'Ford',
      model: 'Mustang',
      type: 'SAV',
      year: 2025,
      price: 45000,
      image: '/assets/car-suv.jpg',
      description: 'The legendary American muscle car with modern performance and technology.',
      specs_engine: '5.0L V8',
      specs_horsepower: 460,
      specs_acceleration: '3.9s',
      specs_top_speed: '155 mph',
      specs_fuel_type: 'Gasoline',
      colors: JSON.stringify([
        { name: 'Grabber Blue', hex: '#1E40AF' },
        { name: 'Race Red', hex: '#DC2626' },
        { name: 'Oxford White', hex: '#F8F8F8' },
        { name: 'Shadow Black', hex: '#1F2937' },
      ]),
      features: JSON.stringify([
        '10-Speed Automatic',
        '12" Digital Cluster',
        'Bang & Olufsen Audio',
        'Track Apps',
      ]),
      created_at: getTimestamp(),
      updated_at: getTimestamp(),
    },
  ];

  cars.forEach((car) => {
    lowdb.get('cars').push(car).write();
  });
}

function parseFilterCondition(sql, params) {
  const normalized = sql.replace(/\s+/g, ' ').trim();

  if (normalized.includes('WHERE role = ?')) {
    return { filter: (row) => row.role === params[0] };
  }

  if (normalized.includes('WHERE username = ? OR email = ?')) {
    return { filter: (row) => row.username === params[0] || row.email === params[1] };
  }

  if (normalized.includes('WHERE id = ?')) {
    const id = params[0];
    return { filter: (row) => row.id === id };
  }

  if (normalized.includes('WHERE o.status = ?')) {
    return { filter: (row) => row.status === params[0] };
  }

  if (normalized.includes('WHERE t.status = ?')) {
    return { filter: (row) => row.status === params[0] };
  }

  if (normalized.includes('WHERE t.type = ?')) {
    return { filter: (row) => row.type === params[0] };
  }

  if (normalized.includes('WHERE status = "pending"')) {
    return { filter: (row) => row.status === 'pending' };
  }

  if (normalized.includes('WHERE status != "cancelled"')) {
    return { filter: (row) => row.status !== 'cancelled' };
  }

  if (normalized.includes('WHERE status IN ("shipped", "delivered")')) {
    return { filter: (row) => ['shipped', 'delivered'].includes(row.status) };
  }

  if (normalized.includes('WHERE status = "completed" AND type = "payment"')) {
    return { filter: (row) => row.status === 'completed' && row.type === 'payment' };
  }

  if (normalized.includes('WHERE status = "completed" AND type = "refund"')) {
    return { filter: (row) => row.status === 'completed' && row.type === 'refund' };
  }

  return null;
}

function selectAll(sql, params) {
  const normalized = sql.replace(/\s+/g, ' ').trim();

  if (normalized.includes('FROM users ORDER BY created_at DESC')) {
    return sortDescending(getUsers(), 'created_at');
  }

  if (normalized.includes('FROM cars ORDER BY created_at DESC')) {
    return sortDescending(getCars(), 'created_at');
  }

  if (normalized.includes('FROM orders o')) {
    let records = getOrders();
    const filter = parseFilterCondition(sql, params);
    if (filter) {
      records = records.filter(filter.filter);
    }
    records = sortDescending(records, 'order_date');
    const limit = parseInt(params[params.length - 2], 10);
    const offset = parseInt(params[params.length - 1], 10);
    return records.slice(offset, offset + limit).map(orderWithUser);
  }

  if (normalized.includes('FROM transactions t')) {
    let records = getTransactions();
    const filter = parseFilterCondition(sql, params);
    if (filter) {
      records = records.filter(filter.filter);
    }
    records = sortDescending(records, 'transaction_date');
    const limit = parseInt(params[params.length - 2], 10);
    const offset = parseInt(params[params.length - 1], 10);
    return records.slice(offset, offset + limit).map(transactionWithJoin);
  }

  if (normalized.includes('FROM cars WHERE id = ?')) {
    const car = carById(params[0]);
    return car ? [car] : [];
  }

  if (normalized.includes('FROM users WHERE id = ?')) {
    const user = userById(params[0]);
    return user ? [user] : [];
  }

  return [];
}

function selectOne(sql, params) {
  const normalized = sql.replace(/\s+/g, ' ').trim();

  if (normalized.includes('FROM users WHERE username = ? OR email = ?')) {
    return getUsers().find((row) => row.username === params[0] || row.email === params[1]);
  }

  if (normalized.includes('FROM users WHERE id = ?')) {
    return userById(params[0]);
  }

  if (normalized.includes('FROM cars WHERE id = ?')) {
    return carById(params[0]);
  }

  if (normalized.includes('FROM orders o') && normalized.includes('WHERE o.id = ?')) {
    const order = orderById(params[0]);
    return order ? orderWithUser(order) : undefined;
  }

  if (normalized.includes('FROM transactions t') && normalized.includes('WHERE t.id = ?')) {
    const transaction = transactionById(params[0]);
    return transaction ? transactionWithJoin(transaction) : undefined;
  }

  if (normalized.includes('COUNT(*) as admin_count')) {
    const count = getUsers().filter((row) => row.role === params[0]).length;
    return { admin_count: count };
  }

  if (normalized.includes('COUNT(*) as total_orders')) {
    return { total_orders: getOrders().length };
  }

  if (normalized.includes('COUNT(*) as pending_orders')) {
    return { pending_orders: getOrders().filter((row) => row.status === 'pending').length };
  }

  if (normalized.includes('COUNT(*) as completed_orders')) {
    return { completed_orders: getOrders().filter((row) => ['shipped', 'delivered'].includes(row.status)).length };
  }

  if (normalized.includes('SUM(total_amount) as total_revenue')) {
    return { total_revenue: getOrders().filter((row) => row.status !== 'cancelled').reduce((sum, order) => sum + Number(order.total_amount || 0), 0) };
  }

  if (normalized.includes('AVG(total_amount) as avg_order_value')) {
    const orders = getOrders().filter((row) => row.status !== 'cancelled');
    const total = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    return { avg_order_value: orders.length ? total / orders.length : 0 };
  }

  if (normalized.includes('COUNT(*) as total_transactions')) {
    return { total_transactions: getTransactions().length };
  }

  if (normalized.includes('COUNT(*) as completed_transactions')) {
    return { completed_transactions: getTransactions().filter((row) => row.status === 'completed').length };
  }

  if (normalized.includes('SUM(amount) as total_amount')) {
    return { total_amount: getTransactions().filter((row) => row.status === 'completed' && row.type === 'payment').reduce((sum, trx) => sum + Number(trx.amount || 0), 0) };
  }

  if (normalized.includes('SUM(amount) as total_refunds')) {
    return { total_refunds: getTransactions().filter((row) => row.status === 'completed' && row.type === 'refund').reduce((sum, trx) => sum + Number(trx.amount || 0), 0) };
  }

  if (normalized.includes('COUNT(*) as pending_transactions')) {
    return { pending_transactions: getTransactions().filter((row) => row.status === 'pending').length };
  }

  return undefined;
}

function runQuery(sql, params, callback) {
  const normalized = sql.replace(/\s+/g, ' ').trim();
  let changes = 0;
  try {
    if (normalized.startsWith('INSERT INTO users')) {
      const [id, username, email, password, role] = params;
      const exists = lowdb.get('users').find({ id }).value();
      if (!exists) {
        lowdb.get('users').push({ id, username, email, password, role, created_at: getTimestamp(), updated_at: getTimestamp() }).write();
        changes = 1;
      }
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('INSERT INTO cars')) {
      const [id, brand, model, type, year, price, image, description, specs_engine, specs_horsepower, specs_acceleration, specs_top_speed, specs_fuel_type, colors, features] = params;
      const exists = carById(id);
      if (!exists) {
        lowdb.get('cars').push({ id, brand, model, type, year, price, image, description, specs_engine, specs_horsepower, specs_acceleration, specs_top_speed, specs_fuel_type, colors, features, created_at: getTimestamp(), updated_at: getTimestamp() }).write();
        changes = 1;
      }
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('INSERT INTO orders')) {
      const [id, customer_name, customer_email, customer_phone, car_id, car_brand, car_model, selected_color, quantity, total_amount, status, notes, created_by] = params;
      lowdb.get('orders').push({ id, customer_name, customer_email, customer_phone, car_id, car_brand, car_model, selected_color, quantity, total_amount, status, notes, created_by, order_date: getTimestamp() }).write();
      changes = 1;
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('INSERT INTO transactions')) {
      const [id, order_id, amount, type, status, payment_method, notes, processed_by] = params;
      lowdb.get('transactions').push({ id, order_id, amount, type, status, payment_method, notes, processed_by, transaction_date: getTimestamp() }).write();
      changes = 1;
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('DELETE FROM users')) {
      const [id] = params;
      const removed = lowdb.get('users').remove({ id }).write();
      changes = removed.length;
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('DELETE FROM cars')) {
      const [id] = params;
      const removed = lowdb.get('cars').remove({ id }).write();
      changes = removed.length;
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('DELETE FROM orders')) {
      const [id] = params;
      const removed = lowdb.get('orders').remove({ id }).write();
      changes = removed.length;
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('DELETE FROM transactions')) {
      const [id] = params;
      const removed = lowdb.get('transactions').remove({ id }).write();
      changes = removed.length;
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('UPDATE cars SET')) {
      const [brand, model, type, year, price, image, description, specs_engine, specs_horsepower, specs_acceleration, specs_top_speed, specs_fuel_type, colors, features, id] = params;
      const car = carById(id);
      if (car) {
        lowdb.get('cars').find({ id }).assign({ brand, model, type, year, price, image, description, specs_engine, specs_horsepower, specs_acceleration, specs_top_speed, specs_fuel_type, colors, features, updated_at: getTimestamp() }).write();
        changes = 1;
      }
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('UPDATE orders SET')) {
      const [customer_name, customer_email, customer_phone, selected_color, quantity, total_amount, status, notes, id] = params;
      const order = orderById(id);
      if (order) {
        lowdb.get('orders').find({ id }).assign({ customer_name, customer_email, customer_phone, selected_color, quantity, total_amount, status, notes }).write();
        changes = 1;
      }
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('UPDATE transactions SET')) {
      const [status, payment_method, notes, id] = params;
      const transaction = transactionById(id);
      if (transaction) {
        lowdb.get('transactions').find({ id }).assign({ status, payment_method, notes }).write();
        changes = 1;
      }
      return runCallback(callback, null, null, changes);
    }

    if (normalized.startsWith('INSERT OR IGNORE INTO')) {
      return runQuery(sql.replace('OR IGNORE', ''), params, callback);
    }

    return runCallback(callback, new Error('Unsupported query'), null, 0);
  } catch (err) {
    return runCallback(callback, err, null, 0);
  }
}

function allQuery(sql, params, callback) {
  try {
    const rows = selectAll(sql, params);
    return runCallback(callback, null, rows, 0);
  } catch (err) {
    return runCallback(callback, err, null, 0);
  }
}

function getQuery(sql, params, callback) {
  try {
    const row = selectOne(sql, params);
    return runCallback(callback, null, row, 0);
  } catch (err) {
    return runCallback(callback, err, null, 0);
  }
}

const db = {
  get: getQuery,
  all: allQuery,
  run: runQuery,
};

initializeDatabase();

module.exports = db;
