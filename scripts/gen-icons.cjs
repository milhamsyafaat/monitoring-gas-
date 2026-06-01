const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.resolve(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function createPNG(size) {
  const cx = size / 2;
  const w = (n) => Math.round(n * size);
  const rawData = [];
  // rectangle helper
  function rect(x1, y1, x2, y2, r, g, b) {
    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
          const i = (y * size + x) * 4;
          rawData[i] = r; rawData[i+1] = g; rawData[i+2] = b; rawData[i+3] = 255;
        }
      }
    }
  }
  // init dark bg
  for (let i = 0; i < size * size * 4; i++) rawData[i] = 0;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    rawData[i] = 15; rawData[i+1] = 23; rawData[i+2] = 42; rawData[i+3] = 255;
  }
  // outer body (tall blue rounded rect — approximated with rect)
  const bx1 = w(0.3), bx2 = w(0.7), by1 = w(0.15), by2 = w(0.78);
  rect(bx1, by1, bx2, by2, 56, 189, 248);
  // inner dark
  const ix1 = w(0.35), ix2 = w(0.65), iy1 = w(0.22), iy2 = w(0.72);
  rect(ix1, iy1, ix2, iy2, 15, 23, 42);
  // blue gas bars (4 pairs)
  const bw = w(0.08), bg = w(0.07), bs = w(0.08);
  for (let i = 0; i < 4; i++) {
    const yy = iy1 + w(0.08) + i * (bs + bg);
    rect(cx - bw - 4, yy, cx - 4, yy + bs, 56, 189, 248);
    rect(cx + 4, yy, cx + bw + 4, yy + bs, 56, 189, 248);
  }
  // base
  const bbx1 = cx - w(0.1), bbx2 = cx + w(0.1), bby1 = w(0.78), bby2 = w(0.84);
  rect(bbx1, bby1, bbx2, bby2, 71, 85, 105);

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
