const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { addMetadata } = require('../lib/exif');

module.exports = {
    name: 'brat',
    async execute(client, m, { text }) {
        if (!text) return m.reply('Masukkan teks untuk brat stiker! Contoh: .brat manus');
        
        try {
            const url = `https://aqul-brat.vercel.app/api/brat?text=${encodeURIComponent(text)}`;
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'utf-8');
            
            const stickerBuffer = await addMetadata(buffer, 'kinebot', 'own by kine ✧');
            await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
        } catch (err) {
            console.log(err);
            m.reply('Gagal membuat brat stiker. Coba lagi nanti.');
        }
    }
};
