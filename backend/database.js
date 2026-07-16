const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Bảng accounts
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      session_token TEXT,
      api_key TEXT,
      name TEXT,
      status TEXT DEFAULT 'active',
      plan_type TEXT DEFAULT 'FREE',
      quota_percent REAL DEFAULT 100,
      last_sync DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bảng quota_logs
  db.run(`
    CREATE TABLE IF NOT EXISTS quota_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER,
      quota_percent REAL,
      burn_rate REAL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(account_id) REFERENCES accounts(id)
    )
  `);
});

module.exports = db;
