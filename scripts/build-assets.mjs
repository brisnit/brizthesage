// Builds web-ready images from the untouched originals in "brand assets/".
// Run with: npm run assets
// Originals are never modified; every output lands in public/.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const COVER = "brand assets/What-Up-World_Cover.png";
const PORTRAIT = "brand assets/Brizz12.png";

await mkdir("public/art", { recursive: true });
await mkdir("public/textures", { recursive: true });

const jobs = [
  // Full, uncropped artwork (resized only).
  { src: COVER, out: "public/art/what-up-world.jpg", size: 1600 },
  { src: PORTRAIT, out: "public/art/briz-portrait.jpg", size: 1600 },
  // Deliberate crops.
  { src: PORTRAIT, out: "public/art/briz-hood.jpg", crop: [1580, 150, 1040, 1040], size: 640 },
  { src: PORTRAIT, out: "public/art/skeleton-companion.jpg", crop: [380, 1450, 870, 1850], size: 900 },
  { src: COVER, out: "public/art/house-door-detail.jpg", crop: [1900, 2600, 1000, 900], size: 900 },
  { src: COVER, out: "public/art/cloud-face-detail.jpg", crop: [105, 420, 1100, 1300], size: 800 },
];

for (const job of jobs) {
  let img = sharp(job.src);
  if (job.crop) {
    const [left, top, width, height] = job.crop;
    img = img.extract({ left, top, width, height });
  }
  await img
    .resize(job.size, job.size, { fit: "inside" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(job.out);
  console.log("wrote", job.out);
}

// Sanctuary: Briz’s face from the same portrait, as its own layer with a soft
// oval edge, so the throne scene can place it inside the drawn hood.
{
  await mkdir("public/art/sanctum", { recursive: true });
  const W = 480, H = 570;
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="48%" r="50%"><stop offset="0.72" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><ellipse cx="${W / 2}" cy="${H * 0.48}" rx="${W * 0.5}" ry="${H * 0.5}" fill="url(#g)"/></svg>`,
  );
  await sharp(PORTRAIT)
    .extract({ left: 1780, top: 300, width: 640, height: 760 })
    .resize(W, H)
    .composite([{ input: mask, blend: "dest-in" }])
    .webp({ quality: 84, alphaQuality: 90 })
    .toFile("public/art/sanctum/briz-face.webp");
  console.log("wrote public/art/sanctum/briz-face.webp");
}

// Social preview: the top of the cover (moon + title lettering).
await sharp(COVER)
  .extract({ left: 0, top: 120, width: 4213, height: 2212 })
  .resize(1200, 630)
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile("public/og.jpg");
console.log("wrote public/og.jpg");

// Tileable paper grain (transparent, applied site-wide at low opacity).
const N = 192;
const px = Buffer.alloc(N * N * 4);
for (let i = 0; i < N * N; i++) {
  const v = Math.random();
  const light = v > 0.5;
  px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = light ? 255 : 0;
  px[i * 4 + 3] = Math.floor(Math.abs(v - 0.5) * 2 * 70);
}
await sharp(px, { raw: { width: N, height: N, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile("public/textures/grain.png");
console.log("wrote public/textures/grain.png");
