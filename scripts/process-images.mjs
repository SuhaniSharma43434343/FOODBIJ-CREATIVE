// Converts the chosen client photos from the handover pack into web-sized WebP files.
// Source: ../Foodbiz-website-rework-pack/05-assets/images (client photos only, per brief rule 3).
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('../Foodbiz-website-rework-pack/05-assets/images');
const OUT = path.resolve('src/assets/img');
const S1 = '1-weddings', S2 = '2-celebrations-private-dining', S3 = '3-brand-launches-live-events', S4 = '4-corporate-office-dining';

// [service folder, event folder, frame, optional crop {left, top, width, height} as fractions]
const PICKS = [
  [S1, 'bangalore-wedding', 'bangalore-wedding-01'],
  [S1, 'bangalore-wedding', 'bangalore-wedding-02'],
  // crop to the hands and the plate; the brief rules out chef hats
  [S1, 'bangalore-wedding', 'bangalore-wedding-03', { left: 0.0, top: 0.46, width: 1, height: 0.54 }],
  [S1, 'bangalore-wedding', 'bangalore-wedding-04'],
  [S1, 'bayview-lawns-wedding', 'bayview-lawns-wedding-01'],
  [S1, 'bayview-lawns-wedding', 'bayview-lawns-wedding-02'],
  [S1, 'bayview-lawns-wedding', 'bayview-lawns-wedding-04'],
  [S1, 'randive-wedding', 'randive-wedding-01'],
  [S1, 'aurangabad-wedding', 'aurangabad-wedding-04'],
  [S2, 'the-gummy-gourmet', 'the-gummy-gourmet-01'],
  [S2, 'the-gummy-gourmet', 'the-gummy-gourmet-02'],
  [S2, 'ninja', 'ninja-03'],
  [S2, 'ninja', 'ninja-04'],
  [S2, 'playseum-set-ups', 'playseum-set-ups-02'],
  [S2, 'carnival', 'carnival-01'],
  [S3, 'cartier', 'cartier-01'],
  [S3, 'cartier', 'cartier-03'],
  [S3, 'cartier', 'cartier-07'],
  [S3, 'cartier', 'cartier-08'],
  [S3, 'cartier', 'cartier-09'],
  [S3, 'raymond-chairmans-lounge', 'raymond-chairmans-lounge-03'],
  [S3, 'raymond-chairmans-lounge', 'raymond-chairmans-lounge-05'],
  [S3, 'merc-eqg-launch', 'merc-eqg-launch-01'],
  [S3, 'merc-eqg-launch', 'merc-eqg-launch-02'],
  [S3, 'casio', 'casio-02'],
  [S3, 'ferrari', 'ferrari-02'],
  [S3, 'ferrari', 'ferrari-01'],
  [S3, 'hublot', 'hublot-01'],
  [S3, 'kaytranada', 'kaytranada-03'],
  [S3, 'rolling-loud', 'rolling-loud-02'],
  [S3, 'himesh-reshamiya', 'himesh-reshamiya-01'],
  [S3, 'essentia', 'essentia-01'],
  [S3, 'himalayan-defender-journey', 'himalayan-defender-journey-02'],
  [S3, 'love-beauty-planet', 'love-beauty-planet-01'],
  [S4, 'sbi', 'sbi-02'],
  [S4, 'sbi', 'sbi-03'],
  [S4, 'motilal-oswal', 'motilal-oswal-01'],
  [S4, 'netflix', 'netflix-03'],
  [S4, 'uti', 'uti-03'],
  [S4, 'bloomberg-bsmr', 'bloomberg-bsmr-02'],
];

fs.mkdirSync(OUT, { recursive: true });
for (const [svc, evt, frame, crop] of PICKS) {
  const file = path.join(SRC, svc, evt, `${frame}.jpg`);
  let img = sharp(file).rotate();
  if (crop) {
    const { width, height } = await sharp(file).rotate().metadata();
    img = img.extract({
      left: Math.round(crop.left * width), top: Math.round(crop.top * height),
      width: Math.round(crop.width * width), height: Math.round(crop.height * height),
    });
    img = sharp(await img.toBuffer());
  }
  const out = path.join(OUT, `${frame}.webp`);
  // one shared grade so phone-shot frames read as one set: a touch warmer, slightly richer
  await img
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .modulate({ saturation: 1.04, brightness: 1.0 })
    .recomb([[1.03, 0, 0], [0, 1.0, 0], [0, 0, 0.95]])
    .webp({ quality: 76 })
    .toFile(out);
  console.log(frame, Math.round(fs.statSync(out).size / 1024) + 'KB');
}
