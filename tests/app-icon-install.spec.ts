import { test, expect, Page, APIRequestContext } from '@playwright/test';
import { VIEWS } from './support/views';
import { brandToken } from './support/brandTokens';

const headHref = (page: Page, selector: string) =>
  page.locator(`head ${selector}`).getAttribute('href');

type ManifestIcon = { src: string; sizes: string; type: string; purpose?: string };

const fetchManifest = async (page: Page, request: APIRequestContext) => {
  const res = await request.get((await headHref(page, 'link[rel="manifest"]'))!);
  expect(res.status()).toBe(200);
  return { contentType: res.headers()['content-type'], json: await res.json() };
};

// Sizes stored in an .ico file's directory (a width byte of 0 means 256).
const icoSizes = (buf: Buffer) =>
  Array.from({ length: buf.readUInt16LE(4) }, (_, i) => buf[6 + i * 16] || 256).sort((a, b) => a - b);

// Decodes an image in the page and reports what a launcher would show.
const inspectImage = (page: Page, url: string) =>
  page.evaluate(async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = (x: number, y: number) => data.slice((y * width + x) * 4, (y * width + x) * 4 + 4);

    let minAlpha = 255;
    let inkOutsideSafeZone = 0; // non-white pixels outside the maskable safe zone (circle, r = 40%)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [r, g, b, a] = px(x, y);
        minAlpha = Math.min(minAlpha, a);
        const outside = (x + 0.5 - width / 2) ** 2 + (y + 0.5 - height / 2) ** 2 > (0.4 * width) ** 2;
        if (outside && a > 0 && (r < 245 || g < 245 || b < 245)) inkOutsideSafeZone++;
      }
    }
    const cornerAlpha = [px(0, 0), px(width - 1, 0), px(0, height - 1), px(width - 1, height - 1)].map(p => p[3]);
    return { width, height, minAlpha, cornerAlpha, inkOutsideSafeZone };
  }, url);

for (const view of VIEWS) {
  test.describe(`App icon — browser tab — ${view.name}`, () => {
    test.use(view.use);

    test('links an SVG favicon and a 16/32/48 px favicon.ico', async ({ page, request }) => {
      await page.goto('/');

      const svgHref = await headHref(page, 'link[rel="icon"][type="image/svg+xml"]');
      const svg = await request.get(svgHref!);
      expect(svg.status()).toBe(200);
      expect(svg.headers()['content-type']).toContain('image/svg+xml');

      const icoHref = await headHref(page, 'link[rel="icon"][href$=".ico"]');
      const ico = await request.get(icoHref!);
      expect(ico.status()).toBe(200);
      expect(icoSizes(await ico.body())).toEqual([16, 32, 48]);
    });
  });
}

for (const view of VIEWS) {
  test.describe(`App icon — home screen — ${view.name}`, () => {
    test.use(view.use);

    test('iOS: links a 180 px apple-touch-icon with no transparent corners', async ({ page }) => {
      await page.goto('/');

      const href = await headHref(page, 'link[rel="apple-touch-icon"]');
      const icon = await inspectImage(page, href!);

      expect([icon.width, icon.height]).toEqual([180, 180]);
      expect(icon.minAlpha).toBe(255);
    });
  });
}

for (const view of VIEWS) {
  test.describe(`App icon — install — ${view.name}`, () => {
    test.use(view.use);

    test('serves an installable manifest themed in the app base color', async ({ page, request }) => {
      await page.goto('/');
      const { contentType, json } = await fetchManifest(page, request);

      expect(contentType).toContain('application/manifest+json');
      expect(json).toMatchObject({ name: expect.stringContaining('MotivationOS'), short_name: 'MotivationOS', start_url: '/', display: 'standalone' });
      expect(json.theme_color.toUpperCase()).toBe(brandToken('b2c-azure'));
      expect((await page.locator('head meta[name="theme-color"]').getAttribute('content'))!.toUpperCase()).toBe(brandToken('b2c-azure'));
    });

    test('lists 192 and 512 px standard icons with rounded, transparent corners', async ({ page, request }) => {
      await page.goto('/');
      const { json } = await fetchManifest(page, request);
      const icons = (json.icons as ManifestIcon[]).filter(i => (i.purpose ?? 'any').split(' ').includes('any'));

      expect(icons.map(i => i.sizes).sort()).toEqual(['192x192', '512x512']);
      for (const i of icons) {
        const img = await inspectImage(page, i.src);
        expect(`${img.width}x${img.height}`).toBe(i.sizes);
        expect(img.cornerAlpha).toEqual([0, 0, 0, 0]);
      }
    });

    test('lists a 512 px maskable icon: opaque, with the mark inside the safe zone', async ({ page, request }) => {
      await page.goto('/');
      const { json } = await fetchManifest(page, request);
      const maskable = (json.icons as ManifestIcon[]).find(i => i.purpose?.split(' ').includes('maskable'));

      expect(maskable?.sizes).toBe('512x512');
      const img = await inspectImage(page, maskable!.src);
      expect([img.width, img.height]).toEqual([512, 512]);
      expect(img.minAlpha).toBe(255);
      expect(img.inkOutsideSafeZone).toBe(0);
    });
  });
}

