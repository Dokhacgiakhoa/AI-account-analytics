const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// API: Lấy danh sách accounts
app.get('/api/accounts', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API: Thêm account mới
app.post('/api/accounts', (req, res) => {
  const { platform, session_token, api_key, name, plan_type } = req.body;
  db.run(
    `INSERT INTO accounts (platform, session_token, api_key, name, plan_type, quota_percent) VALUES (?, ?, ?, ?, ?, ?)`,
    [platform, session_token, api_key, name, plan_type, 100],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, platform, name, quota_percent: 100 });
    }
  );
});

// API: Lấy lịch sử quota của account
app.get('/api/quota_logs/:accountId', (req, res) => {
  db.all('SELECT * FROM quota_logs WHERE account_id = ? ORDER BY recorded_at ASC', [req.params.accountId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Mock Cronjob để đồng bộ Quota mỗi phút
cron.schedule('* * * * *', () => {
  console.log('Running mock quota sync...');
  db.all('SELECT * FROM accounts', [], (err, accounts) => {
    if (err) return;
    
    accounts.forEach(account => {
      // Mock logic: Giảm quota ngẫu nhiên 0.1 - 2% mỗi lần quét
      const decrease = Math.random() * 2;
      let newQuota = Math.max(0, account.quota_percent - decrease);
      
      // Update account
      db.run('UPDATE accounts SET quota_percent = ?, last_sync = CURRENT_TIMESTAMP WHERE id = ?', [newQuota, account.id]);
      
      // Ghi log
      const burnRate = decrease; // burn rate trong lần quét này
      db.run('INSERT INTO quota_logs (account_id, quota_percent, burn_rate) VALUES (?, ?, ?)', [account.id, newQuota, burnRate]);
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
