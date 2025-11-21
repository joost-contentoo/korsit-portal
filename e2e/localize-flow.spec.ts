import { test, expect } from '@playwright/test';

test('localize flow works correctly', async ({ page }) => {
    // Mock the API response to avoid hitting n8n
    await page.route('/api/localize', async route => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
            json: { localized_content: '# Hallo Welt\n\nDas ist ein Test.' }
        });
    });

    // 1. Navigate to the page
    await page.goto('/');

    // 2. Check initial state
    await expect(page.getByText('Input Workspace')).toBeVisible();
    const localizeButton = page.getByRole('button', { name: /Localize to German/i });
    await expect(localizeButton).toBeDisabled();

    // 3. Type content
    await page.getByLabel('Original Markdown').fill('# Hello World\n\nThis is a test.');

    // 4. Button should be enabled
    await expect(localizeButton).toBeEnabled();

    // 5. Click localize
    await localizeButton.click();

    // 6. Check loading state
    // The button should be disabled and show a loading state
    // We check that the original "Localize to German" text is gone
    await expect(page.getByText('Localize to German')).not.toBeVisible();

    // 7. Check result
    // Wait for the result to appear in Comparison Deck
    // The mock returns "# Hallo Welt", so we look for "Hallo Welt"
    await expect(page.getByText('Hallo Welt')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Das ist ein Test.')).toBeVisible();
});
