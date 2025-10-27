import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];
    let current = {};

    for (let line of lines) {
        line = line.trim();

        if (line.startsWith('#EXTINF:')) {
            const info = line.match(/#EXTINF:-?\d+(?:.*),(.*)/);
            const name = info ? info[1].trim() : 'Unknown';

            const attrs = {};
            const attrMatches = line.match(/([a-zA-Z0-9\-]+)="([^"]+)"/g);
            if (attrMatches) {
                attrMatches.forEach(attr => {
                    const [key, value] = attr.split('=');
                    attrs[key] = value.replace(/"/g, '');
                });
            }

            current = { name, attrs };
        } else if (line && !line.startsWith('#')) {
            current.url = line;
            channels.push(current);
            current = {};
        }
    }

    return channels;
}

// Контроллер: отдать все каналы
export const getChannels = (req, res) => {
    const playlistPath = path.join(__dirname, 'server', 'playlist.m3u');

    fs.readFile(playlistPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения playlist.m3u:', err);
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        const channels = parseM3U(data);
        res.json({
            count: channels.length,
            channels,
        });
    });
};

// Контроллер: отдать список групп
export const getGroups = (req, res) => {
    const playlistPath = path.join(__dirname, 'server', 'playlist.m3u');

    fs.readFile(playlistPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения playlist.m3u:', err);
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        const channels = parseM3U(data);
        const groups = [...new Set(channels.map(c => c.attrs['group-title'] || 'Other'))];
        res.json({ count: groups.length, groups });
    });
};
