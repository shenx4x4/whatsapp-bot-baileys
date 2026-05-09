module.exports = async (client, { id, participants, action }) => {
    try {
        const metadata = await client.groupMetadata(id);
        for (let jid of participants) {
            let profile;
            try {
                profile = await client.profilePictureUrl(jid, 'image');
            } catch {
                profile = 'https://telegra.ph/file/241d7169c0135a7131f5d.jpg';
            }

            if (action === 'add') {
                client.sendMessage(id, { 
                    image: { url: profile }, 
                    caption: `Selamat datang @${jid.split("@")[0]} di grup ${metadata.subject}!`,
                    mentions: [jid]
                });
            } else if (action === 'remove') {
                client.sendMessage(id, { 
                    image: { url: profile }, 
                    caption: `Selamat tinggal @${jid.split("@")[0]}, semoga tenang di sana!`,
                    mentions: [jid]
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
};
