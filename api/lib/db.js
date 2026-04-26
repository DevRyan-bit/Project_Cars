const Database = require('better-sqlite3');
const path = require('path');

let db = null;

function getDatabase() {
  if (!db) {
    // Use /tmp for Vercel ephemeral filesystem
    const dbPath = process.env.NODE_ENV === 'production'
      ? '/tmp/cars.db'
      : path.join(process.cwd(), 'data', 'cars.db');

    db = new Database(dbPath);
  }
  return db;
}

module.exports = { getDatabase };
