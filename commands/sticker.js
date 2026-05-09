const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    async execute(client, m) {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        
        if (/image/.test(mime)) {
            const stream = await downloadContentFromMessage(quoted.msg || quoted, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            const fileName = path.join(__dirname, `../tmp/${Date.now()}.webp`);
            if (!fs.existsSync(path.join(__dirname, '../tmp'))) fs.mkdirSync(path.join(__dirname, '../tmp'));
            
            fs.writeFileSync(fileName.replace('.webp', '.jpg'), buffer);
            
            const sticker = new Sticker(buffer, {
                pack: 'kinebot',
                author: 'own by kine ✧',
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#00000000'
            });
            const stickerBuffer = await sticker.toBuffer();
            client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
        } else if (/video/.test(mime)) {
            if ((quoted.msg || quoted).seconds > 10) return m.reply('Maksimal durasi video adalah 10 detik!');
            const stream = await downloadContentFromMessage(quoted.msg || quoted, 'video');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            const fileName = path.join(__dirname, `../tmp/${Date.now()}.webp`);
            if (!fs.existsSync(path.join(__dirname, '../tmp'))) fs.mkdirSync(path.join(__dirname, '../tmp'));
            
            fs.writeFileSync(fileName.replace('.webp', '.mp4'), buffer);
            
            const sticker = new Sticker(buffer, {
                pack: 'kinebot',
                author: 'own by kine ✧',
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#00000000'
            });
            const stickerBuffer = await sticker.toBuffer();
            client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
        } else {
            m.reply('Kirim/reply gambar atau video dengan caption .sticker');
        }
    }
};
