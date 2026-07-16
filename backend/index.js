require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const CryptoJS = require('crypto-js');

const prisma = new PrismaClient({});
const app = express();
app.use(cors());
app.use(express.json());

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_fallback_key';

function encrypt(text) {
  if (!text) return null;
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(cipherText) {
  if (!cipherText) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
}

// API: Lấy danh sách accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await prisma.account.findMany();
    // Do NOT send back raw api keys or session tokens to frontend!
    const safeAccounts = accounts.map(acc => ({
      id: acc.id,
      platform: acc.platform,
      name: acc.name,
      status: acc.status,
      plan_type: acc.planType,
      quota_percent: acc.quotaPercent,
      last_sync: acc.lastSync,
      created_at: acc.createdAt
    }));
    res.json(safeAccounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Thêm account mới
app.post('/api/accounts', async (req, res) => {
  try {
    const { platform, session_token, api_key, name, plan_type } = req.body;
    
    // Encrypt sensitive data
    const safeSessionToken = encrypt(session_token);
    const safeApiKey = encrypt(api_key);

    const newAccount = await prisma.account.create({
      data: {
        platform,
        name,
        planType: plan_type,
        sessionToken: safeSessionToken,
        apiKey: safeApiKey,
        quotaPercent: 100.0
      }
    });

    res.json({ 
      id: newAccount.id, 
      platform: newAccount.platform, 
      name: newAccount.name, 
      quota_percent: newAccount.quotaPercent 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy lịch sử quota của account
app.get('/api/quota_logs/:accountId', async (req, res) => {
  try {
    const accountId = parseInt(req.params.accountId);
    const logs = await prisma.quotaLog.findMany({
      where: { accountId },
      orderBy: { recordedAt: 'asc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mock Cronjob để đồng bộ Quota mỗi phút
cron.schedule('* * * * *', async () => {
  console.log('Running mock quota sync...');
  try {
    const accounts = await prisma.account.findMany();
    
    for (const account of accounts) {
      // Mock logic: Giảm quota ngẫu nhiên 0.1 - 2% mỗi lần quét
      const decrease = Math.random() * 2;
      let newQuota = Math.max(0, account.quotaPercent - decrease);
      
      // Update account & ghi log trong cùng 1 transaction
      await prisma.$transaction([
        prisma.account.update({
          where: { id: account.id },
          data: { 
            quotaPercent: newQuota,
            lastSync: new Date()
          }
        }),
        prisma.quotaLog.create({
          data: {
            accountId: account.id,
            quotaPercent: newQuota,
            burnRate: decrease
          }
        })
      ]);
    }
  } catch (error) {
    console.error('Cronjob error:', error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
