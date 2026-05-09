module.exports = {
    name: 'kick',
    async execute(client, m, { text, isOwner }) {
        if (!m.isGroup) return m.reply('Hanya bisa digunakan di grup!');
        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const botAdmin = participants.find(p => p.id === client.user.id.split(':')[0] + '@s.whatsapp.net')?.admin;
        
        if (!botAdmin) return m.reply('Bot harus menjadi admin!');
        
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await client.groupParticipantsUpdate(m.chat, [users], 'remove');
        m.reply('Berhasil mengeluarkan user.');
    }
};
