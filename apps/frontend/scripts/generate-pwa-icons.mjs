import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

// Minimal PNG generator (solid background + simple centered mark).
// No external deps; deterministic output for PWA icons.

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function pngSolid({ width, height, rgb, markRgb }) {
  const bytesPerPixel = 3;
  const stride = width * bytesPerPixel;
  const raw = Buffer.alloc((stride + 1) * height);

  const [r, g, b] = rgb;
  const [mr, mg, mb] = markRgb;

  // Draw: background + a soft "N" glyph (simple block mark) centered.
  const markW = Math.max(8, Math.floor(width * 0.42));
  const markH = Math.max(8, Math.floor(height * 0.42));
  const x0 = Math.floor((width - markW) / 2);
  const y0 = Math.floor((height - markH) / 2);

  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const idx = rowStart + 1 + x * 3;
      let pr = r,
        pg = g,
        pb = b;

      const inBox = x >= x0 && x < x0 + markW && y >= y0 && y < y0 + markH;
      if (inBox) {
        const relX = x - x0;
        const relY = y - y0;
        const t = Math.max(2, Math.floor(markW * 0.12));
        const leftBar = relX < t;
        const rightBar = relX > markW - t;
        const diag = Math.abs(relX - Math.floor((relY * markW) / markH)) < t;
        if (leftBar || rightBar || diag) {
          pr = mr;
          pg = mg;
          pb = mb;
        }
      }

      raw[idx] = pr;
      raw[idx + 1] = pg;
      raw[idx + 2] = pb;
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const compressed = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const outDir = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

const brandRgb = [255, 251, 230]; // amaranth-50
const markRgb = [230, 119, 0]; // amaranth-600

const icons = [
  { name: "icon-192x192.png", w: 192, h: 192 },
  { name: "icon-512x512.png", w: 512, h: 512 },
  { name: "maskable-512x512.png", w: 512, h: 512 },
];

for (const ic of icons) {
  const buf = pngSolid({ width: ic.w, height: ic.h, rgb: brandRgb, markRgb });
  fs.writeFileSync(path.join(outDir, ic.name), buf);
}

console.log("Generated PWA icons in", outDir);

