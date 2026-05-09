require('dotenv').config();

module.exports = {
    botName: process.env.BOT_NAME || 'Manus Bot',
    ownerName: process.env.OWNER_NAME || 'Manus',
    ownerNumber: process.env.OWNER_NUMBER || '628xxx', // Ganti dengan nomor owner
    prefix: '.',
    pairingNumber: process.env.PAIRING_NUMBER || '', // Masukkan nomor bot di sini untuk pairing code
    openaiKey: process.env.OPENAI_API_KEY || '',
    sessionName: 'session',
    autoRead: true,
    publicMode: true
};
