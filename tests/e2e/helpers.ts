import { expect, Page } from '@playwright/test';

/** Mocked `generateMotivationAnalysis` response — matches `MotivationAnalysisResult`. */
const MOCK_ANALYSIS = {
    autonomy: {
        analysis: 'ניתוח AI מדומה לאוטונומיה',
        tip: 'טיפ AI מדומה לאוטונומיה',
        adhd_tip: 'טיפ קשב מדומה לאוטונומיה',
    },
    competence: {
        analysis: 'ניתוח AI מדומה למסוגלות',
        tip: 'טיפ AI מדומה למסוגלות',
        adhd_tip: 'טיפ קשב מדומה למסוגלות',
    },
    relatedness: {
        analysis: 'ניתוח AI מדומה לשייכות',
        tip: 'טיפ AI מדומה לשייכות',
        adhd_tip: 'טיפ קשב מדומה לשייכות',
    },
};

/** Serve the mocked AI analysis instead of calling the Cloud Function. */
export async function mockAnalysis(page: Page) {
    await page.route('**/generateMotivationAnalysis', route =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: MOCK_ANALYSIS }),
        }),
    );
}

/**
 * Replace Firestore writes with an in-page fake so tests never write to the
 * real project. Documents passed to `collection(...).add()` are recorded and
 * returned by `getFirestoreWrites`. Network traffic is blocked as a safety net.
 * Call after the app has loaded (the Firebase SDK must be on the page).
 */
export async function stubFirestoreWrites(page: Page) {
    await page.route('**/firestore.googleapis.com/**', route => route.abort());
    await page.evaluate(() => {
        const w = window as any;
        w.__firestoreWrites = [];
        w.firebase.firestore.CollectionReference.prototype.add = async function (doc: unknown) {
            w.__firestoreWrites.push({ collection: this.path, doc });
            return { id: 'e2e-stub' };
        };
    });
}

export async function getFirestoreWrites(page: Page): Promise<{ collection: string; doc: any }[]> {
    return page.evaluate(() => JSON.parse(JSON.stringify((window as any).__firestoreWrites ?? [])));
}

/** Open the app and wait for the welcome screen. */
export async function openWelcome(page: Page) {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'MotivationOS' })).toBeVisible({ timeout: 10000 });
}

/**
 * Reach the analysis screen through demo mode (typing "dudi" reveals the demo
 * panel). Demo mode skips auth and the assessment and always uses the solo role.
 */
export async function openDemoAnalysis(page: Page, profile: 'high' | 'mid' | 'at-risk' = 'mid') {
    await openWelcome(page);
    await page.locator('input[type="email"]').fill('dudi');
    await expect(page.getByText('DEMO MODE')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: profile, exact: true }).click();
    await expect(page.getByRole('heading', { name: /פרופיל מוטיבציה/ })).toBeVisible({ timeout: 10000 });
}

/** Wait until the mocked AI tip has rendered, so the analysis DOM is stable. */
export async function waitForMockedTip(page: Page) {
    await expect(page.getByText('טיפ AI מדומה').first()).toBeVisible({ timeout: 10000 });
}
