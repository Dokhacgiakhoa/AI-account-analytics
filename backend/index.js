require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
const app = express();
app.use(cors());
app.use(express.json());

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_fallback_key';
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

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

// Middleware xác thực JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Truy cập bị từ chối' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ' });
    req.user = user;
    next();
  });
}

// --- AUTH API ---

// API Đăng ký
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email đã tồn tại' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    res.json({ message: 'Đăng ký thành công', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Sai email hoặc mật khẩu' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Sai email hoặc mật khẩu' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CORE API ---

// API: Lấy danh sách accounts của User hiện tại
app.get('/api/accounts', authenticateToken, async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user.userId }
    });
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

// API: Thêm account mới thủ công
app.post('/api/accounts', authenticateToken, async (req, res) => {
  try {
    const { platform, session_token, api_key, name, plan_type } = req.body;
    
    const safeSessionToken = encrypt(session_token);
    const safeApiKey = encrypt(api_key);

    const newAccount = await prisma.account.create({
      data: {
        userId: req.user.userId,
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

// API: Lấy lịch sử quota
app.get('/api/quota_logs/:accountId', authenticateToken, async (req, res) => {
  try {
    const accountId = parseInt(req.params.accountId);
    // Xác minh account thuộc về user
    const account = await prisma.account.findFirst({ where: { id: accountId, userId: req.user.userId } });
    if (!account) return res.status(403).json({ error: 'Không có quyền truy cập' });

    const logs = await prisma.quotaLog.findMany({
      where: { accountId },
      orderBy: { recordedAt: 'asc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Đồng bộ dữ liệu từ Cockpit WebSocket
app.post('/api/sync-cockpit', authenticateToken, async (req, res) => {
  try {
    // Dữ liệu từ Cockpit gửi qua WebSocket sẽ được frontend bắt và POST lên đây
    const { accounts } = req.body; // Array of account objects from Cockpit
    
    if (!accounts || !Array.isArray(accounts)) {
      return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }

    const userId = req.user.userId;
    let syncedCount = 0;

    // Duyệt qua danh sách tài khoản từ Cockpit và cập nhật hoặc tạo mới
    for (const cockpitAcc of accounts) {
      // Giả sử Cockpit trả về platform, id nội bộ của nó, tên, plan_type, quota (ví dụ: số % hoặc text)
      // Chúng ta sẽ upsert dựa trên userId và một định danh của account (có thể dùng name + platform làm key tạm thời)
      
      const accPlatform = cockpitAcc.platform || cockpitAcc.provider || cockpitAcc.type || 'Unknown';
      
      // Try to find an identifier (email, name, username, id)
      let accName = cockpitAcc.email || cockpitAcc.name || cockpitAcc.username || cockpitAcc.account || cockpitAcc.id;
      if (!accName) {
        // Fallback to a random ID to prevent overwriting if we don't know the structure
        accName = 'Account ' + Math.floor(Math.random() * 10000);
      }

      const accPlan = cockpitAcc.plan_type || cockpitAcc.plan || cockpitAcc.subscription || cockpitAcc.tier || 'FREE';
      
      // Chuyển đổi quota thành percent
      let quotaPercent = 100.0;
      if (typeof cockpitAcc.quota === 'number') quotaPercent = cockpitAcc.quota;
      else if (cockpitAcc.quota && typeof cockpitAcc.quota.percent === 'number') quotaPercent = cockpitAcc.quota.percent;
      else if (typeof cockpitAcc.quotaPercent === 'number') quotaPercent = cockpitAcc.quotaPercent;
      else if (typeof cockpitAcc.percentage === 'number') quotaPercent = cockpitAcc.percentage;
      else if (cockpitAcc.limits && typeof cockpitAcc.limits.percent === 'number') quotaPercent = cockpitAcc.limits.percent;

      // Tìm xem account này đã có trong db chưa
      let existingAccount = await prisma.account.findFirst({
        where: { userId, platform: accPlatform, name: accName }
      });

      if (existingAccount) {
        // Cập nhật
        await prisma.account.update({
          where: { id: existingAccount.id },
          data: { 
            quotaPercent, 
            planType: accPlan,
            lastSync: new Date()
          }
        });
        
        // Ghi log (chỉ ghi nếu quota thay đổi để tránh rác DB)
        if (existingAccount.quotaPercent !== quotaPercent) {
          await prisma.quotaLog.create({
            data: {
              accountId: existingAccount.id,
              quotaPercent: quotaPercent,
              burnRate: Math.abs(existingAccount.quotaPercent - quotaPercent)
            }
          });
        }
      } else {
        // Tạo mới
        const newAcc = await prisma.account.create({
          data: {
            userId,
            platform: accPlatform,
            name: accName,
            planType: accPlan,
            quotaPercent,
            lastSync: new Date()
          }
        });
        
        await prisma.quotaLog.create({
          data: {
            accountId: newAcc.id,
            quotaPercent,
            burnRate: 0
          }
        });
      }
      syncedCount++;
    }

    res.json({ message: `Đã đồng bộ ${syncedCount} tài khoản thành công` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mock Cronjob - Chú ý: Bị comment để nhường chỗ cho dữ liệu Cockpit thật, nhưng vẫn có thể chạy để test
/*
cron.schedule('* * * * *', async () => {
  // ...
});
*/

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
