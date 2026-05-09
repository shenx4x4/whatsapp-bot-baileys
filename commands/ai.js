const axios = require('axios');

module.exports = {
    name: 'ai',
    async execute(client, m, { text }) {
        if (!text) return m.reply('Silahkan masukkan pertanyaan!');
        
        try {
            // Menggunakan API publik gratis sebagai alternatif jika OpenAI key tidak ada
            const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=id`);
            const result = response.data.success;
            await m.reply(result || "Maaf, saya tidak mengerti.");
        } catch (err) {
            m.reply('Terjadi kesalahan pada server AI.');
        }
    }
};
