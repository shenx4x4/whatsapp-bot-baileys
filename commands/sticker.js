const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

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
            
            exec(`ffmpeg -i ${fileName.replace('.webp', '.jpg')} -vcodec libwebp -filter:v "scale='if(gt(iw,ih),512,-1)':'if(gt(ih,iw),512,-1)',fps=15,pad=512:512:(512-iw)/2:(512-ih)/2:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" ${fileName}`, (err) => {
                if (err) return m.reply('Gagal mengonversi ke stiker.');
                client.sendMessage(m.chat, { sticker: fs.readFileSync(fileName) }, { quoted: m });
                fs.unlinkSync(fileName);
                fs.unlinkSync(fileName.replace('.webp', '.jpg'));
            });
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
            
            exec(`ffmpeg -i ${fileName.replace('.webp', '.mp4')} -vcodec libwebp -filter:v "scale='if(gt(iw,ih),512,-1)':'if(gt(ih,iw),512,-1)',fps=15,pad=512:512:(512-iw)/2:(512-ih)/2:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -loop 0 -preset default -an -vsync 0 ${fileName}`, (err) => {
                if (err) return m.reply('Gagal mengonversi video ke stiker.');
                client.sendMessage(m.chat, { sticker: fs.readFileSync(fileName) }, { quoted: m });
                fs.unlinkSync(fileName);
                fs.unlinkSync(fileName.replace('.webp', '.mp4'));
            });
        } else {
            m.reply('Kirim/reply gambar atau video dengan caption .sticker');
        }
    }
};
