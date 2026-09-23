// Genera los recursos de marca (logo/isotipo transparentes, favicon e iconos)
// a partir de los archivos originales en assets/brand/.
// Uso: node scripts/build-brand-assets.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const BG = [16, 16, 14]; // fondo casi negro del arte original
const FLOOR = 48; // por debajo de esto es fondo/sombra
const CEIL = 241; // canal máximo del naranja de marca (#F15A23)

async function extractTransparent(input, output, width) {
  const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.min(1, Math.max(0, (Math.max(r, g, b) - FLOOR) / (CEIL - FLOOR)));
    const un = (c, k) => (a > 0 ? Math.min(255, Math.max(0, (c - (1 - a) * BG[k]) / a)) : 0);
    out[j] = un(r, 0);
    out[j + 1] = un(g, 1);
    out[j + 2] = un(b, 2);
    out[j + 3] = Math.round(a * 255);
  }
  const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
  await sharp(trimmed).resize({ width }).png({ compressionLevel: 9 }).toFile(output);
  const meta = await sharp(output).metadata();
  console.log(output, meta.width, "x", meta.height);
}

function pngToIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

await extractTransparent("assets/brand/pixolve-logo.jpg", "public/brand/pixolve-logo.png", 1200);
await extractTransparent("assets/brand/pixolve-favicon.jpg", "public/brand/pixolve-mark.png", 600);

const fav = "assets/brand/pixolve-favicon.jpg";
await sharp(fav).resize(512, 512).png().toFile("src/app/icon.png");
await sharp(fav).resize(180, 180).png().toFile("src/app/apple-icon.png");
const icoSizes = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, buf: await sharp(fav).resize(size, size).ensureAlpha().png().toBuffer() }))
);
await writeFile("src/app/favicon.ico", pngToIco(icoSizes));
console.log("favicon + icons listos");
