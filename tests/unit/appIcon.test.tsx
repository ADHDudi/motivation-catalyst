// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, cleanup } from '@testing-library/react';
import AppIcon from '../../components/AppIcon';

const tokens = fs.readFileSync(path.resolve(__dirname, '../../src/styles/colors_and_type.css'), 'utf8');
const token = (name: string) => tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))![1].toUpperCase();

afterEach(cleanup);

describe('AppIcon', () => {
  it('is drawn in the app base colors (--b2c-azure → --b2c-sky)', () => {
    const { getByTestId } = render(<AppIcon size={48} />);

    const stops = [...getByTestId('app-icon').querySelectorAll('stop')].map(s => s.getAttribute('stop-color')!.toUpperCase());

    expect(new Set(stops)).toEqual(new Set([token('b2c-azure'), token('b2c-sky')]));
  });

  it('keeps each copy self-contained when several are on one page', () => {
    // The welcome screen renders a mobile and a desktop copy; one is display:none.
    // A gradient shared by id would leave the visible copy unpainted.
    const { getAllByTestId } = render(<><AppIcon size={48} /><AppIcon size={56} /></>);

    for (const svg of getAllByTestId('app-icon')) {
      const refs = [...svg.querySelectorAll('[fill], [stroke]')]
        .flatMap(el => [el.getAttribute('fill'), el.getAttribute('stroke')])
        .filter((v): v is string => !!v && v.startsWith('url('))
        .map(v => v.slice(5, -1));

      expect(refs.length).toBeGreaterThan(0);
      for (const id of refs) {
        expect(document.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
        expect(svg.querySelector(`[id="${id}"]`)).not.toBeNull();
      }
    }
  });
});
