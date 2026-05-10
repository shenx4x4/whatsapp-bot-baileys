const fs = require('fs');
const { tmpdir } = require('os');
const path = require('path');
const webp = require('node-webpmux');

async function addMetadata(buffer, packname, author) {
    const img = new webp.Image();
    const json = {
        "sticker-pack-id": `kinebot-${Date.now()}`,
        "sticker-pack-name": packname,
        "sticker-pack-publisher": author,
        "emojis": ["🤩", "🎉"]
    };
    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    
    await img.load(buffer);
    img.exif = exif;
    return await img.save(null);
}

module.exports = { addMetadata };
