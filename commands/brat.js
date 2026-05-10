const axios = require('axios');
const { addMetadata } = require('../lib/exif');

module.exports = {
    name: 'brat',
    async execute(client, m, { text }) {
        if (!text) return m.reply('Masukkan teks untuk brat stiker! Contoh: .brat manus');
        
        try {
            // Menggunakan API Brat alternatif yang lebih stabil
            const url = `https://api.siputzx.my.id/api/mics/brat?text=${encodeURIComponent(text)}`;
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            
            if (response.status !== 200) throw new Error('API Error');
            
            const buffer = Buffer.from(response.data);
            const stickerBuffer = await addMetadata(buffer, 'kinebot', 'own by kine ✧');
            
            await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
        } catch (err) {
            console.log(err);
            // Mencoba API cadangan jika API pertama gagal
            try {
                const backupUrl = `https://api.vreden.web.id/api/brat?text=${encodeURIComponent(text)}`;
                const backupRes = await axios.get(backupUrl, { responseType: 'arraybuffer' });
                const stickerBuffer = await addMetadata(Buffer.from(backupRes.data), 'kinebot', 'own by kine ✧');
                await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
            } catch (err2) {
                m.reply('Gagal membuat brat stiker. API sedang bermasalah, coba lagi nanti.');
            }
        }
    }
};
