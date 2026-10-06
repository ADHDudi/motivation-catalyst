// Renders every app icon file from the master mark (assets/icon/icon-mark.svg).
// Usage: npm run icons            → writes into public/
//        node scripts/generate-icons.mjs <outDir>
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARK = path.join(root, 'assets/icon/icon-mark.svg');

// The mark's drawing (everything inside <svg>), placed on a tile of `size` px.
const markBody = () => fs.readFileSync(MARK, 'utf8').match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1].replace(/<!--[\s\S]*?-->/g, '').trim();
const tile = ({ size, radius, markScale }) => {
  const markSize = size * markScale;
  const offset = (size - markSize) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#FFFFFF"/>
  <g transform="translate(${offset} ${offset}) scale(${markSize / 48})">
    ${markBody()}
  </g>
</svg>
`;
};

const render = (svg, px) => new Resvg(svg, { fitTo: { mode: 'width', value: px } }).render().asPng();

// ICO with PNG-compressed entries (supported by every current browser and Windows Vista+).
const ico = (pngs) => {
  const header = Buffer.alloc(6 + pngs.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ px, png }, i) => {
    const e = 6 + i * 16;
    header[e] = px >= 256 ? 0 : px;
    header[e + 1] = px >= 256 ? 0 : px;
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(png.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...pngs.map(p => p.png)]);
};

export const generateIcons = (outDir = path.join(root, 'public')) => {
  // Browser tab: rounded white tile so it reads on light and dark tab strips.
  const favicon = tile({ size: 48, radius: 11, markScale: 1 });

  // Install (manifest "any"): rounded tile on transparent, so it isn't a hard square.
  const standard = tile({ size: 512, radius: 115, markScale: 0.8 });

  // Home screen (Android maskable, iOS): opaque full-bleed tile — the platform cuts
  // its own shape — with the mark inside the 80% safe-zone circle.
  const fullBleed = tile({ size: 512, radius: 0, markScale: 0.68 });

  fs.mkdirSync(path.join(outDir, 'icons'), { recursive: true });
  fs.writeFileSync(path.join(outDir, 'favicon.svg'), favicon);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), ico([16, 32, 48].map(px => ({ px, png: render(favicon, px) }))));
  for (const px of [192, 512]) fs.writeFileSync(path.join(outDir, `icons/icon-${px}.png`), render(standard, px));
  fs.writeFileSync(path.join(outDir, 'icons/icon-maskable-512.png'), render(fullBleed, 512));
  fs.writeFileSync(path.join(outDir, 'icons/apple-touch-icon.png'), render(fullBleed, 180));
};

if (process.argv[1] === fileURLToPath(import.meta.url)) generateIcons(process.argv[2] && path.resolve(process.argv[2]));
