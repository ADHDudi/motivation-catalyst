import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { generateIcons } from '../../scripts/generate-icons.mjs';

const publicDir = path.resolve(__dirname, '../../public');
const listFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(e => e.isFile())
    .map(e => path.relative(dir, path.join(e.parentPath, e.name)))
    .sort();

let outDir: string;
afterEach(() => fs.rmSync(outDir, { recursive: true, force: true }));

describe('npm run icons', () => {
  it('has been re-run since the master mark last changed', () => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'icons-'));
    generateIcons(outDir);

    // Every generated file is committed under public/…
    for (const file of listFiles(outDir)) expect(fs.existsSync(path.join(publicDir, file)), file).toBe(true);
    // …and the vector favicon, rendered straight from the master, is current.
    // (PNG bytes can differ slightly between CPU architectures, so they aren't compared.)
    expect(fs.readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8'))
      .toBe(fs.readFileSync(path.join(outDir, 'favicon.svg'), 'utf8'));
  });
});
