const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.resolve(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function createPNG(size) {
  const cx = size / 2, cy = size / 2;
  const bodyW = size * 0.5, bodyH = size * 0.58, bodyX = cx - bodyW / 2, bodyY = size * 0.18;
  const innerW = bodyW * 0.76, innerH = bodyH * 0.79, innerX = cx - innerW / 2, innerY = bodyY + bodyH * 0.1;
  const barW = bodyW * 0.24, barH = size * 0.04, barGap = size * 0.08;

  const rawData = [];
  for (let y = 0; y < size; y++) {
    rawData.push(0);
    for (let x = 0; x < size; x++) {
      let r = 15, g = 23, b = 42, a = 255; // #0f172a background
      // outer body (blue)
      if (x >= bodyX && x < bodyX + bodyW && y >= bodyY && y < bodyY + bodyH) {
        const dx = x - bodyX, dy = y - bodyY;
        const rad = bodyW / 2 * 0.35;
        if (dy < rad || dy > bodyH - rad || (dx >= (bodyW - bodyW * 0.7) / 2 && dx < (bodyW + bodyW * 0.7) / 2)) {
          r = 56; g = 189; b = 248; // #38bdf8
          // inner (dark)
          if (x >= innerX && x < innerX + innerW && y >= innerY && y < innerY + innerH) {
            r = 15; g = 23; b = 42;
          }
        }
      }
      // bars (gas level indicators)
      if (y >= bodyY + size * 0.32 && y < bodyY + size * 0.32 + barH) {
        if ((x >= cx - barW - 2 && x < cx - 2) || (x >= cx + 2 && x < cx + barW + 2)) { r = 56; g = 189; b = 248; }
      }
      if (y >= bodyY + size * 0.32 + barGap && y < bodyY + size * 0.32 + barH + barGap) {
        if ((x >= cx - barW - 2 && x < cx - 2) || (x >= cx + 2 && x < cx + barW + 2)) { r = 56; g = 189; b = 248; }
      }
      if (y >= bodyY + size * 0.32 + barGap * 2 && y < bodyY + size * 0.32 + barH + barGap * 2) {
        if ((x >= cx - barW - 2 && x < cx - 2) || (x >= cx + 2 && x < cx + barW + 2)) { r = 56; g = 189; b = 248; }
      }
      // base
      if (y >= size * 0.76 && y < size * 0.82 && x >= cx - size * 0.12 && x < cx + size * 0.12) {
        r = 71; g = 85; b = 105; // #475569
      }
      rawData.push(r, g, b, a);
    }
  }

  const rawBuffer = Buffer.from(rawData);
  const deflated = zlib.deflateSync(rawBuffer);

  function crc32(buf) {
    let c = 0xffffffff;
    const table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let v = n;
      for (let k = 0; k < 8; k++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1;
      table[n] = v;
    }
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const t = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([t, data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc32(crcData));
    return Buffer.concat([len, t, data, c]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const png = Buffer.concat([signature, chunk('IHDR', ihdr), chunk('IDAT', deflated), chunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png);
  console.log(`Created icon-${size}.png`);
}

createPNG(192);
createPNG(512);
