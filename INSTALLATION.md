# Panduan Instalasi dan Penggunaan Bot WhatsApp

Bot WhatsApp ini dibangun menggunakan Node.js dan library Baileys, dioptimalkan untuk berjalan di Termux (Android).

## Persyaratan
- Android dengan aplikasi Termux terinstal.
- Koneksi internet yang stabil.
- Akun WhatsApp yang belum terhubung ke perangkat lain.

## Langkah-langkah Instalasi di Termux

1.  **Instal Termux:**
    Unduh dan instal aplikasi Termux dari F-Droid atau Google Play Store.

2.  **Update Termux:**
    Buka Termux dan jalankan perintah berikut untuk memperbarui paket:
    ```bash
    pkg update && pkg upgrade -y
    ```

3.  **Instal Dependensi:**
    Instal Node.js, FFmpeg, dan Git:
    ```bash
    pkg install nodejs ffmpeg git -y
    ```

4.  **Clone Repository Bot:**
    Clone repository bot ini ke perangkat Anda. Ganti `YOUR_GITHUB_USERNAME` dengan username GitHub Anda.
    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/whatsapp-bot.git
    cd whatsapp-bot
    ```

5.  **Instal Modul Node.js:**
    Masuk ke direktori bot dan instal semua dependensi Node.js:
    ```bash
    npm install
    ```

6.  **Konfigurasi Bot:**
    Buka file `.env` menggunakan editor teks seperti `nano`:
    ```bash
    nano .env
    ```
    Edit nilai-nilai berikut:
    -   `BOT_NAME`: Nama bot Anda.
    -   `OWNER_NAME`: Nama pemilik bot.
    -   `OWNER_NUMBER`: Nomor WhatsApp pemilik bot (misal: `6281234567890`).
    -   `PAIRING_NUMBER`: Nomor WhatsApp yang akan digunakan untuk pairing (harus sama dengan `OWNER_NUMBER` jika bot akan dijalankan di nomor owner).
    -   `OPENAI_API_KEY`: Kunci API OpenAI Anda (opsional, jika ingin menggunakan fitur AI yang lebih canggih).

    Simpan perubahan dengan menekan `Ctrl + X`, lalu `Y`, dan `Enter`.

## Menjalankan Bot

1.  **Mulai Bot:**
    Jalankan bot dengan perintah:
    ```bash
    npm start
    ```

2.  **Pairing Code:**
    Bot akan menampilkan pairing code di terminal. Buka WhatsApp di ponsel Anda, pergi ke `Pengaturan > Perangkat Tertaut > Tautkan Perangkat`, lalu pilih `Tautkan dengan nomor telepon` dan masukkan pairing code yang muncul di Termux.

3.  **Bot Siap Digunakan:**
    Setelah berhasil pairing, bot akan online dan siap digunakan.

## Fitur Bot

Berikut adalah daftar fitur utama bot:

-   **Menu:** `.menu` atau `.help` untuk melihat daftar perintah.
-   **AI Chat:** `.ai <pertanyaan>` untuk bertanya kepada AI.
-   **Sticker Maker:**
    -   `.sticker` atau `.s` (reply gambar/video) untuk membuat stiker dari media.
    -   Mendukung gambar dan video (maksimal 10 detik).
-   **Downloader:**
    -   `.ytmp3 <url>` untuk mengunduh audio dari YouTube.
    -   `.ytmp4 <url>` untuk mengunduh video dari YouTube.
    -   `.tiktok <url>` untuk mengunduh video dari TikTok.
-   **Auto Reply:** Bot akan merespons otomatis kata tertentu (dapat dikonfigurasi di `handler.js`).
-   **Group Features:**
    -   `Welcome Message`: Pesan selamat datang untuk anggota baru.
    -   `Anti Link`: (Belum diimplementasikan, perlu penambahan di `handler.js`)
    -   `Kick User`: `.kick @user` untuk mengeluarkan anggota grup (membutuhkan bot sebagai admin).
    -   `Promote/Demote`: `.promote @user` / `.demote @user` untuk mengubah status admin (membutuhkan bot sebagai admin).
-   **Owner Features:**
    -   `Broadcast`: `.bc <pesan>` untuk mengirim pesan ke semua chat bot.
    -   `Eval Code`: `.eval <code>` untuk menjalankan kode JavaScript (hanya owner).
    -   `Restart Bot`: `.restart` untuk me-restart bot (hanya owner).

## Struktur Proyek

```
whatsapp-bot/
├── commands/          # Berisi file-file command bot
│   ├── menu.js
│   ├── ai.js
│   ├── sticker.js
│   ├── downloader.js
│   ├── group.js
│   └── owner.js
├── events/            # Berisi file-file event handler
│   └── group-participants.js
├── lib/               # Berisi fungsi-fungsi pembantu (utilities)
│   ├── myfunc.js
│   └── utils.js
├── sessions/          # Folder untuk menyimpan sesi WhatsApp
├── .env               # File konfigurasi lingkungan
├── config.js          # File konfigurasi bot
├── handler.js         # Logika utama penanganan pesan dan perintah
├── index.js           # Entry point bot
└── package.json       # Daftar dependensi dan script
```

## Catatan Penting

-   Pastikan nomor yang Anda masukkan di `PAIRING_NUMBER` pada `.env` adalah nomor yang sama dengan nomor WhatsApp yang akan Anda tautkan.
-   Untuk fitur downloader YouTube dan TikTok, Anda mungkin perlu mengintegrasikan API atau library downloader yang lebih robust dan up-to-date karena sering terjadi perubahan pada platform tersebut.
-   Fitur `Anti Link` dan `Broadcast` belum sepenuhnya diimplementasikan dan memerlukan penambahan logika di `handler.js` dan `owner.js`.
-   Pastikan bot memiliki izin admin di grup untuk fitur-fitur manajemen grup.

Selamat menggunakan bot Anda!
