const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { addMetadata } = require('../lib/exif');

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    async execute(client, m) {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || quoted.mimetype || '';
        const tmpDir = path.join(__dirname, '../tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        if (/image/.test(mime)) {
            const stream = await downloadContentFromMessage(quoted.msg || quoted, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            const inputPath = path.join(tmpDir, `input_${Date.now()}.jpg`);
            const outputPath = path.join(tmpDir, `output_${Date.now()}.webp`);
            fs.writeFileSync(inputPath, buffer);
            
            // Perintah FFmpeg yang lebih sederhana dan kompatibel
            exec(`ffmpeg -i ${inputPath} -vcodec libwebp -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(512-iw)/2:(512-ih)/2:color=white@0.0" ${outputPath}`, async (err) => {
                if (err) {
                    console.error(err);
                    return m.reply('Gagal mengonversi gambar ke stiker. Pastikan FFmpeg terinstal.');
                }
                
                try {
                    const stickerBuffer = await addMetadata(fs.readFileSync(outputPath), 'kinebot', 'own by kine ✧');
                    await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
                } catch (e) {
                    m.reply('Gagal menambahkan metadata stiker.');
                } finally {
                    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                }
            });
        } else if (/video/.test(mime)) {
            if ((quoted.msg || quoted).seconds > 10) return m.reply('Maksimal durasi video adalah 10 detik!');
            const stream = await downloadContentFromMessage(quoted.msg || quoted, 'video');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            const inputPath = path.join(tmpDir, `input_${Date.now()}.mp4`);
            const outputPath = path.join(tmpDir, `output_${Date.now()}.webp`);
            fs.writeFileSync(inputPath, buffer);
            
            // Perintah FFmpeg video yang lebih sederhana
            exec(`ffmpeg -i ${inputPath} -vcodec libwebp -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(512-iw)/2:(512-ih)/2:color=white@0.0" -loop 0 -preset default -an -vsync 0 ${outputPath}`, async (err) => {
                if (err) {
                    console.error(err);
                    return m.reply('Gagal mengonversi video ke stiker.');
                }
                
                try {
                    const stickerBuffer = await addMetadata(fs.readFileSync(outputPath), 'kinebot', 'own by kine ✧');
                    await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
                } catch (e) {
                    m.reply('Gagal menambahkan metadata stiker.');
                } finally {
                    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                }
            });
        } else {
            m.reply('Kirim/reply gambar atau video dengan caption .sticker');
        }
    }
};
