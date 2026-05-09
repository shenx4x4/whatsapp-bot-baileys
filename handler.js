const { getContentType, downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const chalk = require("chalk");
const config = require("./config");
const { exec } = require("child_process");
const path = require("path");

module.exports = async (client, m, chatUpdate, store) => {
    try {
        const { type, quotedMsg, mentioned, now, fromMe } = m;
        const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '';
        const prefix = config.prefix;
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const text = args.join(" ");
        const sender = m.sender;
        const from = m.chat;
        const isOwner = config.ownerNumber.includes(sender.split('@')[0]);

        // Logging
        if (isCmd) {
            console.log(chalk.black.bgWhite(' CMD ') + " " + chalk.black.bgGreen(new Date().toLocaleString()) + " " + chalk.black.bgBlue(command) + " from " + chalk.black.bgYellow(sender));
        }

        // Load Commands from /commands folder
        const cmdPath = path.join(__dirname, 'commands');
        const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));
        
        for (const file of cmdFiles) {
            const cmd = require(path.join(cmdPath, file));
            if (cmd.name === command || (cmd.aliases && cmd.aliases.includes(command))) {
                await cmd.execute(client, m, { text, args, isOwner, config });
                return;
            }
        }

        // Auto Reply Simple
        if (body.toLowerCase() === 'p') {
            m.reply('Halo! Ada yang bisa saya bantu? Ketik .menu untuk melihat fitur.');
        }

    } catch (err) {
        console.log(chalk.red(err));
    }
};
