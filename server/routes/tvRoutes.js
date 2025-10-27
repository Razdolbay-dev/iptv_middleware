import express from 'express';
import { getChannels, getGroups } from '../controllers/tvController.js';

const router = express.Router();

// /api/tv/channels — получить все каналы
router.get('/channels', getChannels);

// /api/tv/groups — получить все группы каналов
router.get('/groups', getGroups);

export default router;
