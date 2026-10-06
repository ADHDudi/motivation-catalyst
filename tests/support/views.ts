// Mobile Display (< md 768px) and Desktop Display (≥ md), as defined in CONTEXT.md.
export const VIEWS = [
  { name: 'Mobile view', use: { viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true } },
  { name: 'Desktop view', use: { viewport: { width: 1280, height: 800 } } },
];
