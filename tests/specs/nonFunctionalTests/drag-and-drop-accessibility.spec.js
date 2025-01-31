// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/');
});

test('accessibility check', async ({ page }) => {
    await test.step('accessibility check with build-in tool', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    })
});