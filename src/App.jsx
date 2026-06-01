import React, { useState, useEffect } from 'react';
import {
  generateId, today, fmtRupiah,
  checkPassword, setPassword,
  getStock, setStock,
  getHarga, setHarga,
  getSaldo, setSaldo,
  getHistory, addHistory, getProfit, getProfitDiambil, getSisaProfit,
} from './utils.js';

const s = {
  root: { background: '#0f172a', color: '#e2e8f0', minHeight: '100vh', width:'100%', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif", display:'flex', flexDirection:'column' },

  loginWrap:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'2rem' },
  loginBox:{ background:'#1e293b', borderRadius:16, padding:'2rem', width:'100%', maxWidth:360, border:'1px solid #334155' },
  loginTitle:{ fontSize:24, fontWeight:700, marginBottom:4, textAlign:'center' },
  loginSub:{ fontSize:13, color:'#94a3b8', textAlign:'center', marginBottom:24 },
  inp:{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #334155', background:'#0f172a', color:'#e2e8f0', fontSize:15, outline:'none', boxSizing:'border-box', marginBottom:12 },
  btn:{ padding:'10px 20px', borderRadius:10, border:'none', background:'#3b82f6', color:'#fff', fontWeight:600, fontSize:14, cursor:'pointer' },
  btnBlock:{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:'#3b82f6', color:'#fff', fontWeight:600, fontSize:15, cursor:'pointer', marginTop:4 },
  btnDanger:{ background:'#ef4444' },
  btnSmall:{ padding:'6px 14px', borderRadius:8, border:'none', background:'#3b82f6', color:'#fff', fontSize:13, cursor:'pointer', fontWeight:500 },
  btnSmallOutline:{ padding:'6px 14px', borderRadius:8, border:'1px solid #334155', background:'transparent', color:'#94a3b8', fontSize:13, cursor:'pointer' },
  label:{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:4, marginTop:8 },

  layout:{ display:'flex', flex:1 },
  sidebar:{ width:64, background:'#1e293b', borderRight:'1px solid #334155', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:16, gap:2, flexShrink:0 },
  navItem:{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:56, height:52, borderRadius:10, cursor:'pointer', border:'none', background:'transparent', color:'#64748b', fontSize:9, gap:2, transition:'all 0.15s' },
  navActive:{ background:'rgba(59,130,246,0.15)', color:'#3b82f6' },
  content:{ flex:1, overflowY:'auto', padding:'16px 14px', maxHeight:'100vh' },
  topTitle:{ fontSize:20, fontWeight:600, marginBottom:4 },
  topDate:{ fontSize:12, color:'#94a3b8' },

  grid2:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 },
  statCard:{ background:'#1e293b', borderRadius:12, padding:14, border:'1px solid #334155' },
  statLabel:{ fontSize:11, color:'#94a3b8', marginBottom:2 },
  statValue:{ fontSize:24, fontWeight:600 },
  statSmall:{ fontSize:11, color:'#64748b', marginTop:2 },

  card:{ background:'#1e293b', borderRadius:12, padding:16, border:'1px solid #334155', marginBottom:12 },
  cardTitle:{ fontSize:14, fontWeight:600, marginBottom:12 },

  row:{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #1e293b', fontSize:13 },
  rowLabel:{ color:'#94a3b8' },
  rowValue:{ fontWeight:500 },

  badge:{ display:'inline-block', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:600 },
  badgeIn:{ background:'rgba(34,197,94,0.15)', color:'#4ade80' },
  badgeOut:{ background:'rgba(239,68,68,0.15)', color:'#f87171' },
  badgeBlue:{ background:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  badgeYellow:{ background:'rgba(234,179,8,0.15)', color:'#facc15' },

  table:{ width:'100%', fontSize:12, borderCollapse:'collapse' },
  th:{ textAlign:'left', padding:'6px 4px', color:'#94a3b8', fontWeight:500, borderBottom:'1px solid #334155' },
  td:{ padding:'6px 4px', borderBottom:'1px solid #1e293b' },
  empty:{ textAlign:'center', color:'#64748b', padding:24, fontSize:13 },

  overlay:{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:16 },
  modal:{ background:'#1e293b', borderRadius:16, padding:20, width:'100%', maxWidth:360, border:'1px solid #334155' },
  modalTitle:{ fontSize:16, fontWeight:600, marginBottom:12 },

  fa:{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 },
  fi:{ padding:'8px 12px', borderRadius:8, border:'1px solid #334155', background:'#0f172a', color:'#e2e8f0', fontSize:14, outline:'none', flex:1, minWidth:80, boxSizing:'border-box' },
  fiS:{ padding:'8px 12px', borderRadius:8, border:'1px solid #334155', background:'#0f172a', color:'#e2e8f0', fontSize:14, outline:'none', width:80, boxSizing:'border-box' },

  msgBox:{ padding:'8px 14px', borderRadius:8, fontSize:13, marginBottom:12 },
  successMsg:{ background:'rgba(34,197,94,0.15)', color:'#4ade80' },
  errorMsg:{ background:'rgba(239,68,68,0.15)', color:'#f87171' },
};

const NAV = [
  { key:'dashboard', icon:'📊', label:'Dashboard' },
  { key:'isi', icon:'🔄', label:'Isi Ulang' },
  { key:'kirim', icon:'🚚', label:'Kirim' },
  { key:'ambil', icon:'💰', label:'Ambil' },
  { key:'riwayat', icon:'📋', label:'Riwayat' },
  { key:'pengaturan', icon:'⚙️', label:'Atur' },
];

function LoginPage({ onLogin }) {
  const [user, setUser] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(0);

  const handleLogin = async () => {
    if (Date.now() < lockout) {
      const s = Math.ceil((lockout - Date.now()) / 1000);
      setErr(`Terlalu banyak percobaan. Coba lagi ${s} detik`);
      return;
    }
    if (!user || user !== 'admin') { setErr('Username salah'); return; }
    const ok = await checkPassword(pw);
    if (ok) {
      setAttempts(0);
      sessionStorage.setItem('gas_logged', '1');
      onLogin();
    } else {
      const a = attempts + 1;
      setAttempts(a);
      if (a >= 5) {
        setLockout(Date.now() + 30000);
        setErr('Terlalu banyak percobaan. Tunggu 30 detik');
        setAttempts(0);
      } else {
        setErr(`Password salah (${a}/5 percobaan)`);
      }
    }
  };

  const handleSetup = async () => {
    if (!newPw || newPw.length < 4) { setErr('Minimal 4 karakter'); return; }
    if (newPw !== confirmPw) { setErr('Konfirmasi tidak cocok'); return; }
    await setPassword(newPw);
    sessionStorage.setItem('gas_logged', '1');
    onLogin();
  };

  return (
    <div style={s.loginWrap}>
      <div style={s.loginBox}>
        <div style={s.loginTitle}>GasMonitor</div>
        <div style={s.loginSub}>Monitoring stok & keuangan gas 3kg</div>
        {!showSetup ? (
          <>
            <input style={s.inp} placeholder="Username" value={user} onChange={e => { setUser(e.target.value); setErr(''); }} autoFocus />
            <input style={s.inp} type="password" placeholder="Password" value={pw} onChange={e => { setPw(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            {err && <div style={{color:'#ef4444',fontSize:12,marginBottom:8}}>{err}</div>}
            <button style={s.btnBlock} onClick={handleLogin}>Masuk</button>
            <div style={{textAlign:'center',marginTop:12}}>
              <button style={{...s.btnSmallOutline,fontSize:11}} onClick={() => { setShowSetup(true); setErr(''); }}>Ganti Password</button>
            </div>
          </>
        ) : (
          <>
            <label style={s.label}>Password baru (min 4 karakter)</label>
            <input style={s.inp} type="password" placeholder="Password baru" value={newPw} onChange={e => { setNewPw(e.target.value); setErr(''); }} />
            <input style={s.inp} type="password" placeholder="Konfirmasi" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && handleSetup()} />
            {err && <div style={{color:'#ef4444',fontSize:12,marginBottom:8}}>{err}</div>}
            <button style={s.btnBlock} onClick={handleSetup}>Simpan & Masuk</button>
            <div style={{textAlign:'center',marginTop:12}}>
              <button style={{...s.btnSmallOutline,fontSize:11}} onClick={() => { setShowSetup(false); setErr(''); }}>Kembali</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const stock = getStock();
  const saldo = getSaldo();
  const profit = getProfit();
  const profitDiambil = getProfitDiambil();
  const sisaProfit = getSisaProfit();
  const history = getHistory();

  const todayTrx = history.filter(t => t.tanggal === today());
  const pemasukanHari = todayTrx.filter(t => t.type === 'ambil').reduce((s, t) => s + t.total, 0);
  const pengeluaranHari = todayTrx.filter(t => t.type === 'isi').reduce((s, t) => s + t.total, 0);
  const terjualHari = todayTrx.filter(t => t.type === 'ambil').reduce((s, t) => s + t.qty, 0);
  const recent = history.slice(0, 8);

  const [waktu, setWaktu] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setWaktu(new Date()), 1000); return () => clearInterval(i); }, []);

  const [showAmbilProfit, setShowAmbilProfit] = useState(false);
  const [ambilProfitQty, setAmbilProfitQty] = useState('');
  const [ambilProfitKet, setAmbilProfitKet] = useState('');
  const [ambilProfitMsg, setAmbilProfitMsg] = useState('');

  const handleAmbilProfit = () => {
    const n = parseInt(ambilProfitQty);
    if (!n || n <= 0) { setAmbilProfitMsg('Jumlah tidak valid'); return; }
    if (n > sisaProfit) { setAmbilProfitMsg(`Sisa profit hanya ${fmtRupiah(sisaProfit)}`); return; }
    addHistory({ tanggal: today(), type: 'ambil_profit', qty: 0, harga_satuan: 0, total: n, keterangan: ambilProfitKet });
    setAmbilProfitQty('');
    setAmbilProfitKet('');
    setAmbilProfitMsg('');
    setShowAmbilProfit(false);
  };

  const jam = String(waktu.getHours()).padStart(2,'0');
  const menit = String(waktu.getMinutes()).padStart(2,'0');
  const detik = String(waktu.getSeconds()).padStart(2,'0');
  const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][waktu.getDay()];
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][waktu.getMonth()];

  return (
    <>
      <div style={{marginBottom:16}}>
        <div style={s.topTitle}>Dashboard</div>
        <div style={s.topDate}>{hari}, {waktu.getDate()} {bulan} {waktu.getFullYear()} | {jam}:{menit}:{detik}</div>
      </div>

      <div style={s.grid2}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Stok Rumah</div>
          <div style={s.statValue}>{stock.rumah.isi + stock.rumah.kosong}</div>
          <div style={s.statSmall}>isi {stock.rumah.isi} / kosong {stock.rumah.kosong}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Stok Kantin</div>
          <div style={s.statValue}>{stock.kantin.isi + stock.kantin.kosong}</div>
          <div style={s.statSmall}>isi {stock.kantin.isi} / kosong {stock.kantin.kosong}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Saldo (Modal)</div>
          <div style={{...s.statValue, color: saldo >= 0 ? '#4ade80' : '#f87171'}}>{fmtRupiah(saldo)}</div>
          <div style={s.statSmall}>uang modal — jangan dipake</div>
        </div>
        <div style={s.statCard}>
          <div style={{...s.statLabel}}>Profit</div>
          <div style={{...s.statValue, color: profit >= 0 ? '#4ade80' : '#f87171'}}>{fmtRupiah(profit)}</div>
          <div style={s.statSmall}>{profit >= 0 ? 'untung' : 'rugi'}</div>
        </div>
      </div>

      <div style={s.grid2}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Terjual Hari Ini</div>
          <div style={{...s.statValue, color:'#4ade80'}}>{terjualHari} tabung</div>
          <div style={s.statSmall}>{fmtRupiah(pemasukanHari)}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Pemasukan / Pengeluaran</div>
          <div style={s.statValue}>{fmtRupiah(pemasukanHari)}</div>
          <div style={s.statSmall}>masuk {fmtRupiah(pemasukanHari)} / keluar {fmtRupiah(pengeluaranHari)}</div>
        </div>
      </div>

      <div style={s.card}>
        <div style={{...s.cardTitle, color:'#22c55e'}}>Profit — Uang yang Bisa lo Pake</div>
        <div style={s.row}><span style={s.rowLabel}>Total Profit</span><span style={s.rowValue}>{fmtRupiah(profit)}</span></div>
        <div style={s.row}><span style={s.rowLabel}>Sudah Diambil</span><span style={{...s.rowValue,color:'#f87171'}}>{fmtRupiah(profitDiambil)}</span></div>
        <div style={{...s.row,borderBottom:'none'}}><span style={s.rowLabel}>Sisa Profit</span><span style={{...s.rowValue,color: '#22c55e',fontSize:15}}>{fmtRupiah(sisaProfit)}</span></div>
        {sisaProfit > 0 && (
          <div style={{marginTop:12}}>
            <button style={s.btn} onClick={() => setShowAmbilProfit(true)}>Ambil Profit</button>
          </div>
        )}
      </div>

      {showAmbilProfit && (
        <div style={s.overlay} onClick={() => setShowAmbilProfit(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>Ambil Profit</div>
            {ambilProfitMsg && <div style={{...s.msgBox,...s.errorMsg}}>{ambilProfitMsg}</div>}
            <label style={s.label}>Jumlah uang</label>
            <input style={s.fi} type="number" min="1000" step="1000" placeholder="Jumlah" value={ambilProfitQty} onChange={e => { setAmbilProfitQty(e.target.value); setAmbilProfitMsg(''); }} />
            <label style={s.label}>Keperluan (opsional)</label>
            <input style={s.fi} type="text" placeholder="Misal: beli sembako" value={ambilProfitKet} onChange={e => setAmbilProfitKet(e.target.value)} maxLength={100} />
            <div style={s.modalActions || {display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
              <button style={s.btnSmallOutline} onClick={() => setShowAmbilProfit(false)}>Batal</button>
              <button style={{...s.btnSmall,background:'#22c55e'}} onClick={handleAmbilProfit}>Ambil</button>
            </div>
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div style={s.card}>
          <div style={s.cardTitle}>Aktivitas Terbaru</div>
          {recent.map(t => {
            const label = {
              isi: { text: 'Isi Ulang', badge: s.badgeIn },
              kirim: { text: 'Kirim ke Kantin', badge: s.badgeBlue },
              ambil: { text: 'Ambil dari Kantin', badge: s.badgeOut },
              ambil_profit: { text: 'Ambil Profit', badge: s.badgeYellow },
            }[t.type];
            if (!label) return null;
            return (
              <div key={t.id} style={s.row}>
                <div>
                  <span style={{...s.badge,...label.badge}}>{label.text}</span>
                  <span style={{color:'#64748b',marginLeft:6,fontSize:11}}>{t.tanggal.slice(5)}</span>
                </div>
                <span style={s.rowValue}>{t.type === 'ambil_profit' ? fmtRupiah(t.total) : `${t.qty} tabung`}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function IsiUlangPage() {
  const [qty, setQty] = useState('');
  const [ket, setKet] = useState('');
  const [msg, setMsg] = useState({});

  const handle = () => {
    const q = parseInt(qty);
    if (!q || q <= 0) { setMsg({type:'error',text:'Jumlah tidak valid'}); return; }
    const harga = getHarga();
    const total = q * harga.modal;
    const stock = getStock();
    if (stock.rumah.kosong < q) { setMsg({type:'error',text:`Stok kosong di rumah kurang (tersedia ${stock.rumah.kosong})`}); return; }
    stock.rumah.kosong -= q;
    stock.rumah.isi += q;
    setStock(stock);
    setSaldo(getSaldo() - total);
    addHistory({ tanggal: today(), type: 'isi', qty: q, harga_satuan: harga.modal, total, keterangan: ket });
    setQty('');
    setKet('');
    setMsg({text:`${q} tabung terisi (kosong ${q} → isi ${q}), biaya ${fmtRupiah(total)}`});
    setTimeout(() => setMsg({}), 3000);
  };

  return (
    <>
      <div style={{marginBottom:16}}>
        <div style={s.topTitle}>Isi Ulang</div>
        <div style={s.topDate}>Tukar tabung kosong dengan isi dari agent</div>
      </div>

      {msg.text && <div style={{...s.msgBox,...(msg.type==='error'?s.errorMsg:s.successMsg)}}>{msg.text}</div>}

      <div style={s.card}>
        <div style={s.cardTitle}>Tukar Tabung</div>
        <label style={s.label}>Jumlah tabung 3kg (kosong → isi)</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="1" placeholder="Jumlah" value={qty} onChange={e => setQty(e.target.value)} />
        </div>
        <label style={s.label}>Keterangan (opsional)</label>
        <input style={{...s.fi,width:'100%'}} placeholder="Nama agent / catatan" value={ket} onChange={e => setKet(e.target.value)} maxLength={100} />
        <div style={{marginTop:12}}>
          <button style={s.btn} onClick={handle}>Isi Ulang ({fmtRupiah(getHarga().modal)}/tabung)</button>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Efek Otomatis</div>
        <div style={s.row}><span style={s.rowLabel}>Stok kosong rumah</span><span style={{...s.rowValue,color:'#f87171'}}>-QTY</span></div>
        <div style={s.row}><span style={s.rowLabel}>Stok isi rumah</span><span style={{...s.rowValue,color:'#4ade80'}}>+QTY</span></div>
        <div style={s.row}><span style={s.rowLabel}>Saldo uang</span><span style={{...s.rowValue,color:'#f87171'}}>-{fmtRupiah(getHarga().modal)}/tabung</span></div>
      </div>
    </>
  );
}

function KirimPage() {
  const [qty, setQty] = useState('');
  const [ket, setKet] = useState('');
  const [msg, setMsg] = useState({});

  const handle = () => {
    const q = parseInt(qty);
    if (!q || q <= 0) { setMsg({type:'error',text:'Jumlah tidak valid'}); return; }
    const stock = getStock();
    if (stock.rumah.isi < q) { setMsg({type:'error',text:`Stok isi rumah kurang (tersedia ${stock.rumah.isi})`}); return; }
    stock.rumah.isi -= q;
    stock.kantin.isi += q;
    setStock(stock);
    addHistory({ tanggal: today(), type: 'kirim', qty: q, harga_satuan: 0, total: 0, keterangan: ket });
    setQty('');
    setKet('');
    setMsg({text:`${q} tabung isi dikirim ke kantin`});
    setTimeout(() => setMsg({}), 3000);
  };

  return (
    <>
      <div style={{marginBottom:16}}>
        <div style={s.topTitle}>Kirim ke Kantin</div>
        <div style={s.topDate}>Kirim tabung isi dari rumah ke kantin</div>
      </div>

      {msg.text && <div style={{...s.msgBox,...(msg.type==='error'?s.errorMsg:s.successMsg)}}>{msg.text}</div>}

      <div style={s.card}>
        <div style={s.cardTitle}>Pindahkan Stok Isi</div>
        <label style={s.label}>Jumlah tabung isi 3kg (rumah → kantin)</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="1" placeholder="Jumlah" value={qty} onChange={e => setQty(e.target.value)} />
        </div>
        <label style={s.label}>Keterangan (opsional)</label>
        <input style={{...s.fi,width:'100%'}} placeholder="Catatan" value={ket} onChange={e => setKet(e.target.value)} maxLength={100} />
        <div style={{marginTop:12}}>
          <button style={s.btn} onClick={handle}>Kirim ke Kantin</button>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Efek Otomatis</div>
        <div style={s.row}><span style={s.rowLabel}>Stok isi rumah</span><span style={{...s.rowValue,color:'#f87171'}}>-QTY</span></div>
        <div style={s.row}><span style={s.rowLabel}>Stok isi kantin</span><span style={{...s.rowValue,color:'#4ade80'}}>+QTY</span></div>
      </div>
    </>
  );
}

function AmbilPage() {
  const [qty, setQty] = useState('');
  const [ket, setKet] = useState('');
  const [msg, setMsg] = useState({});

  const handle = () => {
    const q = parseInt(qty);
    if (!q || q <= 0) { setMsg({type:'error',text:'Jumlah tidak valid'}); return; }
    const stock = getStock();
    if (stock.kantin.isi < q) { setMsg({type:'error',text:`Stok isi kantin kurang (tersedia ${stock.kantin.isi})`}); return; }
    const harga = getHarga();
    const total = q * harga.jual;
    const modalKembali = q * harga.modal;
    stock.kantin.isi -= q;
    stock.rumah.kosong += q;
    setStock(stock);
    setSaldo(getSaldo() + modalKembali);
    addHistory({ tanggal: today(), type: 'ambil', qty: q, harga_satuan: harga.jual, total, keterangan: ket });
    setQty('');
    setKet('');
    setMsg({text:`${q} tabung terjual, modal kembali ${fmtRupiah(modalKembali)}`});
    setTimeout(() => setMsg({}), 3000);
  };

  return (
    <>
      <div style={{marginBottom:16}}>
        <div style={s.topTitle}>Ambil dari Kantin</div>
        <div style={s.topDate}>Ambil gas dari kantin = penjualan tercatat otomatis</div>
      </div>

      {msg.text && <div style={{...s.msgBox,...(msg.type==='error'?s.errorMsg:s.successMsg)}}>{msg.text}</div>}

      <div style={s.card}>
        <div style={s.cardTitle}>Catat Ambil Gas</div>
        <label style={s.label}>Jumlah tabung 3kg</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="1" placeholder="Jumlah" value={qty} onChange={e => setQty(e.target.value)} />
        </div>
        <label style={s.label}>Keterangan (opsional)</label>
        <input style={{...s.fi,width:'100%'}} placeholder="Catatan" value={ket} onChange={e => setKet(e.target.value)} maxLength={100} />
        <div style={{marginTop:12}}>
          <button style={s.btn} onClick={handle}>Ambil ({fmtRupiah(getHarga().jual)}/tabung)</button>
        </div>
      </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Efek Otomatis</div>
          <div style={s.row}><span style={s.rowLabel}>Stok isi kantin</span><span style={{...s.rowValue,color:'#f87171'}}>-QTY</span></div>
          <div style={s.row}><span style={s.rowLabel}>Stok kosong rumah</span><span style={{...s.rowValue,color:'#4ade80'}}>+QTY</span></div>
          <div style={s.row}><span style={s.rowLabel}>Modal kembali</span><span style={{...s.rowValue,color:'#4ade80'}}>+{fmtRupiah(getHarga().modal)}/tabung</span></div>
          <div style={s.row}><span style={s.rowLabel}>Profit/tabung</span><span style={{...s.rowValue,color:'#22c55e'}}>{fmtRupiah(getHarga().jual - getHarga().modal)}</span></div>
        </div>
    </>
  );
}

function RiwayatPage() {
  const [filter, setFilter] = useState('semua');
  const history = getHistory();

  const filtered = filter === 'semua' ? history : history.filter(t => t.type === filter);

  const badgeMap = {
    isi: { text: 'Isi Ulang', style: s.badgeIn },
    kirim: { text: 'Kirim', style: s.badgeBlue },
    ambil: { text: 'Ambil', style: s.badgeOut },
    ambil_profit: { text: 'Ambil Profit', style: s.badgeYellow },
  };

  const buildCSV = () => {
    const rows = filter === 'semua' ? history : filtered;
    const labelMap = { isi:'Isi Ulang', kirim:'Kirim ke Kantin', ambil:'Ambil dari Kantin', ambil_profit:'Ambil Profit' };
    const header = 'Tanggal;Aksi;Jumlah;Nominal;Keterangan';
    const body = rows.map(t => {
      const aksi = labelMap[t.type]||t.type;
      const qty = t.type==='ambil_profit' ? '-' : t.qty;
      const nominal = t.total ? `Rp${Number(t.total).toLocaleString('id-ID')}` : '-';
      const ket = (t.keterangan||'-').replace(/;/g,',');
      return `${t.tanggal};${aksi};${qty};${nominal};${ket}`;
    }).join('\n');
    return `sep=;\n${header}\n${body}\n`;
  };

  const exportCSV = () => {
    const csv = buildCSV();
    const blob = new Blob(['\uFEFF' + csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riwayat-gas-${today()}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const csv = buildCSV();
    const blob = new Blob(['\uFEFF' + csv], { type:'text/csv;charset=utf-8;' });
    const fileUrl = URL.createObjectURL(blob);
    try {
      await navigator.share({
        title: 'Riwayat GasMonitor',
        text: `Riwayat gas ${filter} — ${today()}`,
        files: [new File([blob], `riwayat-gas-${today()}.csv`, { type:'text/csv' })],
      });
    } catch { /* user cancelled */ }
    URL.revokeObjectURL(fileUrl);
  };

  return (
    <>
      <div style={{marginBottom:16}}>
        <div style={s.topTitle}>Riwayat</div>
        <div style={s.topDate}>Semua aktivitas stok & keuangan</div>
      </div>

      <div style={{display:'flex',gap:4,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
        {[
          {key:'semua',label:'Semua'},
          {key:'isi',label:'Isi Ulang'},
          {key:'kirim',label:'Kirim'},
          {key:'ambil',label:'Ambil'},
          {key:'ambil_profit',label:'Profit'},
        ].map(f => (
          <button key={f.key} style={{padding:'6px 12px',borderRadius:8,border:'none',background:filter===f.key?'#1e293b':'transparent',color:filter===f.key?'#3b82f6':'#64748b',fontSize:12,cursor:'pointer',fontWeight:500}} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
        <div style={{flex:1}} />
        <button onClick={exportCSV} style={{padding:'6px 12px',borderRadius:8,border:'1px solid #334155',background:'transparent',color:'#4ade80',fontSize:12,cursor:'pointer',fontWeight:500,display:'flex',alignItems:'center',gap:4}}>
          ⬇ CSV
        </button>
        {typeof navigator.share === 'function' && (
          <button onClick={handleShare} style={{padding:'6px 12px',borderRadius:8,border:'1px solid #334155',background:'transparent',color:'#60a5fa',fontSize:12,cursor:'pointer',fontWeight:500,display:'flex',alignItems:'center',gap:4}}>
            📤 Share
          </button>
        )}
      </div>

      <div style={s.card}>
        {filtered.length === 0 ? (
          <div style={s.empty}>Belum ada data</div>
        ) : (
          <table style={s.table}>
            <thead><tr>
              <th style={s.th}>Tgl</th>
              <th style={s.th}>Aksi</th>
              <th style={s.th}>Jumlah</th>
              <th style={s.th}>Nominal</th>
              <th style={s.th}>Ket</th>
            </tr></thead>
            <tbody>
              {filtered.map(t => {
                const b = badgeMap[t.type];
                return (
                  <tr key={t.id}>
                    <td style={s.td}>{t.tanggal.slice(5)}</td>
                    <td style={s.td}><span style={{...s.badge,...(b||s.badgeBlue).style}}>{(b||{text:'?'}).text}</span></td>
                    <td style={{...s.td,fontWeight:600}}>{t.type === 'ambil_profit' ? '-' : t.qty}</td>
                    <td style={{...s.td,color: t.type==='ambil_profit' ? '#f87171' : (t.type==='ambil'?'#4ade80':'#94a3b8'),fontWeight:500}}>{t.total ? fmtRupiah(t.total) : '-'}</td>
                    <td style={{...s.td,color:'#64748b',maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.keterangan || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {filter === 'semua' && history.length > 0 && (
        <div style={s.card}>
          <div style={s.cardTitle}>Rekap Keuangan</div>
          {(() => {
            const profit = getProfit();
            const profitDiambil = getProfitDiambil();
            const sisaProfit = getSisaProfit();
            const saldo = getSaldo();
            const h = getHistory();
            const totalModal = h.filter(t => t.type === 'isi').reduce((s, t) => s + t.total, 0);
            const totalIncome = h.filter(t => t.type === 'ambil').reduce((s, t) => s + t.total, 0);
            return (
              <>
                <div style={s.row}><span style={s.rowLabel}>Saldo (Modal)</span><span style={{...s.rowValue,color:saldo>=0?'#4ade80':'#f87171'}}>{fmtRupiah(saldo)}</span></div>
                <div style={s.row}><span style={s.rowLabel}>Modal Terpakai (isi ulang)</span><span style={{...s.rowValue,color:'#f87171'}}>{fmtRupiah(totalModal)}</span></div>
                <div style={s.row}><span style={s.rowLabel}>Total Pemasukan</span><span style={{...s.rowValue,color:'#4ade80'}}>{fmtRupiah(totalIncome)}</span></div>
                <div style={s.row}><span style={s.rowLabel}>Profit Diambil</span><span style={{...s.rowValue,color:'#f87171'}}>{fmtRupiah(profitDiambil)}</span></div>
                <div style={{...s.row,borderBottom:'none'}}><span style={s.rowLabel}>Sisa Profit</span><span style={{...s.rowValue,color:'#22c55e',fontSize:15}}>{fmtRupiah(sisaProfit)}</span></div>
              </>
            );
          })()}
        </div>
      )}
    </>
  );
}

function PengaturanPage() {
  const [harga, setHargaState] = useState(getHarga());
  const [saldoAwal, setSaldoAwalState] = useState(getSaldo());
  const [stokAwal, setStokAwalState] = useState(getStock());
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [hargaMsg, setHargaMsg] = useState('');
  const [saldoMsg, setSaldoMsg] = useState('');
  const [stokMsg, setStokMsg] = useState('');

  const saveHarga = () => {
    const m = parseInt(harga.modal);
    const j = parseInt(harga.jual);
    if (!m || !j || m <= 0 || j <= 0) { setHargaMsg('Harga tidak valid'); return; }
    if (j <= m) { setHargaMsg('Harga jual harus lebih besar dari modal'); return; }
    setHarga({ modal: m, jual: j });
    setHargaMsg('Harga diperbarui');
    setTimeout(() => setHargaMsg(''), 2000);
  };

  const saveSaldoAwal = () => {
    const n = parseInt(saldoAwal);
    if (n < 0) { setSaldoMsg('Nominal tidak valid'); return; }
    setSaldo(n);
    setSaldoMsg('Saldo disimpan');
    setTimeout(() => setSaldoMsg(''), 2000);
  };

  const saveStokAwal = () => {
    const ri = parseInt(stokAwal.rumah.isi), rk = parseInt(stokAwal.rumah.kosong);
    const ki = parseInt(stokAwal.kantin.isi), kk = parseInt(stokAwal.kantin.kosong);
    if (ri < 0 || rk < 0 || ki < 0 || kk < 0) { setStokMsg('Stok tidak valid'); return; }
    setStock({ rumah: { isi: ri || 0, kosong: rk || 0 }, kantin: { isi: ki || 0, kosong: kk || 0 } });
    setStokMsg('Stok awal disimpan');
    setTimeout(() => setStokMsg(''), 2000);
  };

  const changePw = async () => {
    if (!pw || pw.length < 4) { setPwMsg('Minimal 4 karakter'); return; }
    if (pw !== pwConfirm) { setPwMsg('Konfirmasi tidak cocok'); return; }
    await setPassword(pw);
    setPw(''); setPwConfirm('');
    setPwMsg('Password diganti');
    setTimeout(() => setPwMsg(''), 2000);
  };

  const resetAll = () => {
    if (!confirm('Hapus semua data? (stok, riwayat, modal, keuangan)')) return;
    localStorage.removeItem('gas_stok');
    localStorage.removeItem('gas_history');
    localStorage.removeItem('gas_saldo');
    setHargaState(getHarga());
    setSaldoAwalState(0);
    setStokAwalState({ rumah: { isi: 0, kosong: 0 }, kantin: { isi: 0, kosong: 0 } });
    setHargaMsg('Semua data direset');
    setTimeout(() => setHargaMsg(''), 2000);
  };

  return (
    <>
      <div style={{marginBottom:16}}>
        <div style={s.topTitle}>Pengaturan</div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Harga Gas 3kg</div>
        <label style={s.label}>Modal (harga beli dari agent)</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="1000" step="500" value={harga.modal} onChange={e => setHargaState(h => ({...h, modal: parseInt(e.target.value) || 0}))} />
        </div>
        <label style={s.label}>Harga Jual</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="1000" step="500" value={harga.jual} onChange={e => setHargaState(h => ({...h, jual: parseInt(e.target.value) || 0}))} />
        </div>
          {hargaMsg && <div style={{...s.msgBox,...s.successMsg,marginBottom:8}}>{hargaMsg}</div>}
        <button style={s.btn} onClick={saveHarga}>Simpan Harga</button>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Saldo Uang</div>
        <label style={s.label}>Uang yang lo pegang sekarang</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="0" step="10000" value={saldoAwal} onChange={e => setSaldoAwalState(parseInt(e.target.value) || 0)} />
        </div>
        {saldoMsg && <div style={{...s.msgBox,...s.successMsg,marginBottom:8}}>{saldoMsg}</div>}
        <button style={s.btn} onClick={saveSaldoAwal}>Simpan Saldo</button>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Stok Awal</div>
        <label style={s.label}>Rumah — isi</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="0" value={stokAwal.rumah.isi} onChange={e => setStokAwalState(s => ({...s, rumah: {...s.rumah, isi: parseInt(e.target.value) || 0}}))} />
        </div>
        <label style={s.label}>Rumah — kosong</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="0" value={stokAwal.rumah.kosong} onChange={e => setStokAwalState(s => ({...s, rumah: {...s.rumah, kosong: parseInt(e.target.value) || 0}}))} />
        </div>
        <label style={s.label}>Kantin — isi</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="0" value={stokAwal.kantin.isi} onChange={e => setStokAwalState(s => ({...s, kantin: {...s.kantin, isi: parseInt(e.target.value) || 0}}))} />
        </div>
        <label style={s.label}>Kantin — kosong</label>
        <div style={s.fa}>
          <input style={s.fi} type="number" min="0" value={stokAwal.kantin.kosong} onChange={e => setStokAwalState(s => ({...s, kantin: {...s.kantin, kosong: parseInt(e.target.value) || 0}}))} />
        </div>
        {stokMsg && <div style={{...s.msgBox,...s.successMsg,marginBottom:8}}>{stokMsg}</div>}
        <button style={s.btn} onClick={saveStokAwal}>Simpan Stok Awal</button>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Ganti Password</div>
        <input style={s.inp} type="password" placeholder="Password baru" value={pw} onChange={e => { setPw(e.target.value); setPwMsg(''); }} />
        <input style={s.inp} type="password" placeholder="Konfirmasi" value={pwConfirm} onChange={e => { setPwConfirm(e.target.value); setPwMsg(''); }} />
        {pwMsg && <div style={{color:'#4ade80',fontSize:12,marginBottom:8}}>{pwMsg}</div>}
        <button style={s.btn} onClick={changePw}>Ganti Password</button>
      </div>

      <div style={s.card}>
        <div style={{...s.cardTitle,color:'#f87171'}}>Reset Data</div>
        <button style={{...s.btn,background:'#ef4444'}} onClick={resetAll}>Hapus Semua Data</button>
      </div>
    </>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('gas_logged') === '1');
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = '#0f172a';
  }, []);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={s.root}>
      <div style={s.layout}>
        <div style={s.sidebar}>
          {NAV.map(n => (
            <button key={n.key} style={{...s.navItem,...(view===n.key?s.navActive:{})}} onClick={() => setView(n.key)}>
              <span style={{fontSize:20,lineHeight:1}}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
          <div style={{flex:1}} />
          <button style={{...s.navItem,marginBottom:12}} onClick={() => { sessionStorage.removeItem('gas_logged'); setLoggedIn(false); }}>
            <span style={{fontSize:20,lineHeight:1}}>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
        <div style={s.content}>
          {view === 'dashboard' && <Dashboard />}
          {view === 'isi' && <IsiUlangPage />}
          {view === 'kirim' && <KirimPage />}
          {view === 'ambil' && <AmbilPage />}
          {view === 'riwayat' && <RiwayatPage />}
          {view === 'pengaturan' && <PengaturanPage />}
        </div>
      </div>
    </div>
  );
}
