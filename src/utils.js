const STOK_KEY = 'gas_stok';
const HISTORY_KEY = 'gas_history';
const HARGA_KEY = 'gas_harga';
const AUTH_KEY = 'gas_auth';
const SALDO_KEY = 'gas_saldo';

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function today() {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
}

export function fmtRupiah(n) {
  return 'Rp' + Number(n).toLocaleString('id-ID');
}

function load(key, def) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : def;
  } catch { return def; }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Auth
function hashPassword(pw) {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h) + pw.charCodeAt(i);
  return 'h' + Math.abs(h).toString(36);
}

export function setPassword(pw) {
  save(AUTH_KEY, { password: hashPassword(pw), hashed: 1 });
}
export function getPassword() {
  const stored = load(AUTH_KEY, { password: hashPassword('admin123'), hashed: 1 });
  if (!stored.hashed) {
    stored.password = hashPassword(stored.password);
    stored.hashed = 1;
    save(AUTH_KEY, stored);
  }
  return stored;
}
export function checkPassword(pw) {
  return getPassword().password === hashPassword(pw);
}

// Harga
export function getHarga() {
  return load(HARGA_KEY, { modal: 20000, jual: 23000 });
}
export function setHarga(h) {
  save(HARGA_KEY, h);
}

// Stock langsung (isi + kosong per lokasi)
export function getStock() {
  return load(STOK_KEY, { rumah: { isi: 0, kosong: 0 }, kantin: { isi: 0, kosong: 0 } });
}
export function setStock(s) {
  save(STOK_KEY, s);
}

// Saldo uang langsung (kaya stok gas)
export function getSaldo() {
  return load(SALDO_KEY, 0);
}
export function setSaldo(n) {
  save(SALDO_KEY, n);
}

// History
export function getHistory() {
  return load(HISTORY_KEY, []);
}
export function addHistory(h) {
  const list = getHistory();
  list.unshift({ id: generateId(), ...h });
  save(HISTORY_KEY, list);
}

// Profit dari history
export function getProfit() {
  const h = getHistory();
  const modal = h.filter(t => t.type === 'isi').reduce((s, t) => s + t.total, 0);
  const income = h.filter(t => t.type === 'ambil').reduce((s, t) => s + t.total, 0);
  return income - modal;
}

export function getProfitDiambil() {
  const h = getHistory();
  return h.filter(t => t.type === 'ambil_profit').reduce((s, t) => s + t.total, 0);
}

export function getSisaProfit() {
  return getProfit() - getProfitDiambil();
}
