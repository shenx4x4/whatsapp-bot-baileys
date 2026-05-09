const { exec } = require("child_process");

module.exports = {
    name: 'restart',
    async execute(client, m, { isOwner }) {
        if (!isOwner) return m.reply('Hanya untuk owner!');
        await m.reply('Sedang merestart bot...');
        process.exit();
    }
};
