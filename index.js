const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidDecode,
    getContentType
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const chalk = require("chalk");
const readline = require("readline");
const terminalImage = require('terminal-image');
const config = require("./config");
const { smsg } = require("./lib/myfunc");

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(text, (answer) => {
        rl.close();
        resolve(answer);
    }));
};

async function startBot() {
    try {
        const banner = await terminalImage.file('./rimuru.jpg', { width: '50%' });
        console.log(banner);
        console.log(chalk.cyan.bold("\n          WELCOME TO KINEBOT - 2025          "));
        console.log(chalk.blue.italic("        RIMURU TEMPEST EDITION BANNER        \n"));
    } catch (e) {
        console.log(chalk.cyan("Welcome to kinebot - 2025"));
    }

    const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName}`);
    const { version } = await fetchLatestBaileysVersion();

    const client = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    if (!client.authState.creds.registered) {
        let phoneNumber = config.pairingNumber;
        if (!phoneNumber) {
            phoneNumber = await question(chalk.blueBright("\n\nMasukkan nomor WhatsApp Anda (contoh: 628xxx):\n"));
        }
        phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
        
        setTimeout(async () => {
            let code = await client.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(chalk.black.bgGreen(" Pairing Code Anda: ") + " " + chalk.black.white(code));
        }, 3000);
    }

    client.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.red("Koneksi Terputus, Silahkan Hapus Session dan Scan Ulang"));
                process.exit();
            } else if (reason === DisconnectReason.restartRequired) {
                startBot();
            } else if (reason === DisconnectReason.timedOut) {
                startBot();
            } else {
                // Untuk error lain, coba hubungkan kembali kecuali jika memang sengaja ditutup
                console.log(chalk.yellow(`Koneksi ditutup karena ${reason}, mencoba menghubungkan kembali...`));
                startBot();
            }
        } else if (connection === "open") {
            console.log(chalk.green("\nBot Berhasil Terhubung!"));
        }
    });

    client.ev.on("creds.update", saveCreds);

    client.ev.on("group-participants.update", async (anu) => {
        require("./events/group-participants")(client, anu);
    });

    client.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
            const m = smsg(client, mek, state);
            require("./handler")(client, m, chatUpdate, state);
        } catch (err) {
            console.log(err);
        }
    });

    client.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    return client;
}

startBot();
