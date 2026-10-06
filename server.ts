import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'school_reservations_db.json');

// 確保資料庫目錄存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ServerDatabase {
  version: number;
  lastUpdated: string;
  resources: any[];
  reservations: any[];
  notifications: any[];
  customLogo: string | null;
}

// 預設資料庫讀取或初始化
function loadDatabase(): ServerDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.resources) && Array.isArray(parsed.reservations)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read db file, initializing fresh:', err);
  }

  // 預設備份資料庫結構
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    resources: [],
    reservations: [],
    notifications: [],
    customLogo: null
  };
}

let db: ServerDatabase = loadDatabase();

// 儲存資料庫至磁碟
function saveDatabase() {
  try {
    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to database file:', err);
  }
}

const app = express();

// 支援大圖檔 base64 上傳（如教室實景照片、校徽）
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// SSE 連線客戶端集合，支援跨電腦全校即時推播
const sseClients = new Set<express.Response>();

function broadcast(type: string, payload: any) {
  const message = `data: ${JSON.stringify({ type, version: db.version, lastUpdated: db.lastUpdated, payload })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

// 心跳機制保持 SSE 連線在 Cloud Run 與反向代理中持續活躍
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': keepalive\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 15000);

// --- API 路由群組 ---

// 1. 系統健康檢查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: db.version,
    clientsCount: sseClients.size,
    lastUpdated: db.lastUpdated,
    serverTime: new Date().toISOString()
  });
});

// 2. 即時 SSE 事件推播管道 (任一電腦送出預約或核定，其他電腦即刻同步更新)
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // 初始連線時發送目前最新伺服器狀態
  res.write(`data: ${JSON.stringify({ type: 'init', version: db.version, lastUpdated: db.lastUpdated, payload: db })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// 3. 獲取全系統即時完整資料 (供所有同仁跨電腦登入時讀取)
app.get('/api/state', (req, res) => {
  res.json({
    success: true,
    version: db.version,
    lastUpdated: db.lastUpdated,
    data: db
  });
});

// 4. 全系統狀態同步 (供跨電腦同步更新或合併本機異動)
app.post('/api/sync', (req, res) => {
  try {
    const { resources, reservations, notifications, customLogo } = req.body;
    let changed = false;

    if (Array.isArray(reservations) && reservations.length > 0) {
      db.reservations = reservations;
      changed = true;
    }
    if (Array.isArray(resources) && resources.length > 0) {
      db.resources = resources;
      changed = true;
    }
    if (Array.isArray(notifications)) {
      db.notifications = notifications;
      changed = true;
    }
    if (customLogo !== undefined) {
      db.customLogo = customLogo;
      changed = true;
    }

    if (changed) {
      db.version += 1;
      saveDatabase();
      broadcast('sync', db);
    }

    res.json({ success: true, version: db.version, data: db });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. 新增借用預約申請 (任一電腦填報即時寫入中央資料庫並廣播至所有電腦)
app.post('/api/reservations', (req, res) => {
  try {
    const { reservation } = req.body;
    if (!reservation || !reservation.id) {
      return res.status(400).json({ success: false, error: '預約資料不完整' });
    }

    // 檢查是否已存在，若存在則替換，否則置頂新增
    const idx = db.reservations.findIndex(r => r.id === reservation.id);
    if (idx >= 0) {
      db.reservations[idx] = reservation;
    } else {
      db.reservations.unshift(reservation);
    }

    // 若有對應招設組審核通知，同步新增至系統通知中
    const notifTitle = '新借用申請待初審';
    const notifMsg = `${reservation.applicantName || '教職員'}提出【${reservation.resourceName}】借用登記 (單號: ${reservation.trackingNumber})，請招設組長進行業務初審。`;
    
    // 檢查是否已有一樣的通知
    const existingNotif = db.notifications.find(n => n.reservationId === reservation.id && n.title === notifTitle);
    if (!existingNotif) {
      db.notifications.unshift({
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: 'user-officer-lin',
        title: notifTitle,
        message: notifMsg,
        type: 'info',
        timestamp: '剛剛',
        read: false,
        reservationId: reservation.id
      });
    }

    db.version += 1;
    saveDatabase();
    broadcast('reservation_created', { reservation, db });

    res.json({ success: true, version: db.version, reservation, data: db });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. 更新既有借用案 (初審、主任核定、點交借出、歸還結案、延長審核等)
app.patch('/api/reservations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const idx = db.reservations.findIndex(r => r.id === id);

    if (idx < 0) {
      return res.status(404).json({ success: false, error: '找不到該預約單號' });
    }

    db.reservations[idx] = {
      ...db.reservations[idx],
      ...updates
    };

    const updatedResv = db.reservations[idx];

    // 依據審核階段自動派發即時推播通知
    if (updates.status === 'approved') {
      // 主任核定通過 -> 發送通知給申請人
      db.notifications.unshift({
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: updatedResv.applicantId,
        title: '借用核定通過通知',
        message: `您申請的【${updatedResv.resourceName}】(單號: ${updatedResv.trackingNumber}) 已由黃寀霓教務主任核定通過！`,
        type: 'success',
        timestamp: '剛剛',
        read: false,
        reservationId: updatedResv.id
      });
    } else if (updates.status === 'section_approved') {
      // 招設組初審通過 -> 發送通知給教務主任
      db.notifications.unshift({
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: 'user-director-huang',
        title: '待核定借用案呈報',
        message: `【${updatedResv.resourceName}】(單號: ${updatedResv.trackingNumber}) 已由招設組初審通過，請教務主任批示核定。`,
        type: 'urgent',
        timestamp: '剛剛',
        read: false,
        reservationId: updatedResv.id
      });
    }

    db.version += 1;
    saveDatabase();
    broadcast('reservation_updated', { reservation: updatedResv, db });

    res.json({ success: true, version: db.version, reservation: updatedResv, data: db });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. 更新與鎖定教室/設備實景照片 (招設組或教務主任上傳後固定鎖定)
app.post('/api/resources/:id/photo', (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, photoLockedBy, isPhotoLocked } = req.body;

    const idx = db.resources.findIndex(r => r.id === id);
    if (idx < 0) {
      return res.status(404).json({ success: false, error: '找不到該資源項目' });
    }

    db.resources[idx] = {
      ...db.resources[idx],
      imageUrl: imageUrl || db.resources[idx].imageUrl,
      isPhotoLocked: isPhotoLocked !== undefined ? isPhotoLocked : true,
      photoLockedBy: photoLockedBy || '校內官方核定',
      photoLockedAt: new Date().toLocaleString('zh-TW', { hour12: false })
    };

    db.version += 1;
    saveDatabase();
    broadcast('resource_photo_locked', { resource: db.resources[idx], db });

    res.json({ success: true, version: db.version, resource: db.resources[idx], data: db });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. 更新校徽 (教務主任專屬權限)
app.post('/api/logo', (req, res) => {
  try {
    const { logo } = req.body;
    db.customLogo = logo;
    db.version += 1;
    saveDatabase();
    broadcast('logo_updated', { customLogo: logo, db });

    res.json({ success: true, version: db.version, customLogo: logo, data: db });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. 資料重設 (還原標準展示範例資料，保留官方鎖定照片)
app.post('/api/reset', (req, res) => {
  try {
    const { defaultReservations, defaultNotifications } = req.body;
    if (Array.isArray(defaultReservations)) {
      db.reservations = defaultReservations;
    }
    if (Array.isArray(defaultNotifications)) {
      db.notifications = defaultNotifications;
    }

    db.version += 1;
    saveDatabase();
    broadcast('reset', db);

    res.json({ success: true, version: db.version, data: db });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 前端頁面託管整合 ---
async function startServer() {
  if (!isProd) {
    // 開發模式：掛載 Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // 生產模式：靜態檔案伺服
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[教務處教學設備借用系統] 伺服器啟動於 http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
