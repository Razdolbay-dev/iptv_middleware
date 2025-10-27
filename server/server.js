// backend/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import tvRoutes from './routes/tvRoutes.js';

const app = express();
const PORT = 8081;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());


// 🔸 Логгер запросов
app.use((req, res, next) => {
    const now = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    console.log(`[${now}] ${ip} → ${req.method} ${req.originalUrl} (${userAgent})`);
    next();
});

// Подключаем маршруты
app.use('/api/tv', tvRoutes);


// Отдача фронтенда — статические файлы
app.use(express.static(path.resolve('./dist')))

// SPA catch-all (только если путь не начинается с /api)
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.resolve('./dist/index.html'))
    } else {
        next()
    }
})

app.listen(PORT, HOST, () => {
    console.log(`🚀 Сервер запущен: http://${HOST}:${PORT}`);
});
