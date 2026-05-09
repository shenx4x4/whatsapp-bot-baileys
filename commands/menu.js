module.exports = {
    name: 'menu',
    aliases: ['help', '?'],
    async execute(client, m, { config }) {
        const menuText = `
*${config.botName}*

*MAIN MENU*
.menu - Menampilkan menu
.ai <tanya> - Tanya AI

*STICKER MENU*
.sticker - Gambar ke Sticker
.s - Alias sticker

*DOWNLOADER*
.ytmp3 <url> - Download YouTube Audio
.ytmp4 <url> - Download YouTube Video
.tiktok <url> - Download TikTok Video

*GROUP MENU*
.kick @user - Kick member
.promote @user - Jadikan admin
.demote @user - Hapus admin

*OWNER MENU*
.bc <teks> - Broadcast
.eval <code> - Jalankan kode
.restart - Restart bot

_Bot ini dibuat dengan Node.js & Baileys_
`;
        await client.sendMessage(m.chat, { text: menuText.trim() }, { quoted: m });
    }
};
