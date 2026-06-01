# GasFlow — Monitoring Stok & Keuangan Gas 3kg

React + Vite PWA untuk mencatat stok gas, pengiriman, penjualan, modal, dan profit. Data di localStorage — zero backend.

## Stack

- **Framework:** React 18 (no router, no TypeScript)
- **Build:** Vite 6, `base: './'`
- **Mobile:** PWA (manifest.json + cache-first SW) + Capacitor siap
- **Persistence:** localStorage (6 keys: `gas_stok`, `gas_history`, `gas_harga`, `gas_auth`, `gas_saldo`)

## Commands

| Usage | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Preview over LAN | `npm run preview -- --host` |
| Capacitor sync | `npx cap sync android` |
| Capacitor open | `npx cap open android` |

## Flow Otomatis

Hanya gas 3kg. Tiga aksi utama — stok & uang otomatis berubah:

| Aksi | Stok Rumah | Stok Kantin | Uang |
|---|---|---|---|
| **Isi Ulang** (agent→rumah) | kosong -QTY, isi +QTY | - | -Rp20.000/qty |
| **Kirim ke Kantin** (rumah→kantin) | isi -QTY | isi +QTY | - |
| **Ambil dari Kantin** (kantin→jual) | kosong +QTY | isi -QTY | +Rp23.000/qty |

Saldo = diatur langsung oleh user (kaya stok gas), otomatis berubah tiap transaksi.
Profit = total penjualan − total modal terpakai.
Harga bisa diubah di Pengaturan, saldo & stok awal bisa diatur sendiri.

## Struktur

```
src/
  main.jsx    Entry + SW register
  App.jsx     Semua komponen + state + style inline (1 file)
  utils.js    Helpers + localStorage CRUD
```

## Navigasi

5 tab (sidebar kiri): Dashboard, Isi Ulang, Kirim, Ambil, Riwayat, Pengaturan.

## Quirks

- **Hanya 3kg** — jenis gas lain tidak ada
- **No router** — navigasi via state `view`
- **No CSS framework** — styling inline di objek `s`
- **Auto stok** — tiap aksi langsung ubah stok rumah/kantin (isi & kosong)
- **Auto finansial** — isi ulang catat modal, ambil catat income, profit otomatis
- **Saldo = modal** — uang modal jangan dipake, dipisah dari profit
- **Profit** — uang yang bisa dipake, ada fitur "Ambil Profit" di Dashboard (kurangi saldo + catat riwayat)
- **Modal awal** bisa diatur sendiri di Pengaturan, saldo uang otomatis sinkron
- **Stok awal** rumah & kantin (isi & kosong) bisa diatur sendiri di Pengaturan
- **Default password** `admin123` — hashless, localStorage
- **Harga default** modal 20.000, jual 23.000 — bisa diubah di Pengaturan
- **APK butuh** Java JDK + Android SDK di mesin lain
- **`node_modules/`, `dist/`, `scripts/`** di-gitignore
