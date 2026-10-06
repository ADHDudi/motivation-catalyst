import fs from 'fs';
import path from 'path';

// Resolved from the repo root, where both Playwright and Vitest run (via npm scripts).
const css = fs.readFileSync(path.resolve(process.cwd(), 'src/styles/colors_and_type.css'), 'utf8');

// A hex color token from the design system, e.g. brandToken('b2c-azure') → '#1F7AFF'.
export const brandToken = (name: string) =>
  css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))![1].toUpperCase();
