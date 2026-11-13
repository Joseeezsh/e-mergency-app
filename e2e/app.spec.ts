import { expect, test } from '@playwright/test';

test.describe('E-mergency App', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 14.5995, longitude: 120.9842, accuracy: 12 });

    await page.route('https://nominatim.openstreetmap.org/reverse*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          display_name: 'Padre Burgos Ave, Ermita, Manila, Metro Manila, Philippines',
        }),
      });
    });

    await page.route('https://*.tile.openstreetmap.org/**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.alloc(0) });
    });
  });

  test('opens directly on SOS screen, cancels accidental press, dispatches in Safe Test Mode, and manages alert in Admin tab', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('app-sos ion-title')).toContainText('E-mergency App');
    await expect(page.getByText('SAFE TEST', { exact: true })).toBeVisible();
    await expect(page.getByText('Padre Burgos Ave, Ermita, Manila')).toBeVisible();

    // Verify accidental-press guard can be canceled
    await page.getByRole('button', { name: /SOS — CALL 911/i }).click();
    await expect(page.getByText('Sending Emergency Alert in')).toBeVisible();
    await page.getByRole('button', { name: /CANCEL SOS/i }).click();
    await expect(page.getByText('Sending Emergency Alert in')).toBeHidden();

    // Switch countdown to 3s in Settings so E2E completes quickly
    await page.locator('ion-tab-button[tab="settings"]').click();
    await expect(page.locator('app-settings ion-title')).toContainText('Settings & Info');
    await page.getByText('Gregorio, Maricar F.').scrollIntoViewIfNeeded();
    await expect(page.getByText('Gregorio, Maricar F.')).toBeVisible();

    await page.locator('ion-select').click();
    await page.getByRole('radio', { name: '3 seconds' }).click();

    // Return to SOS, pick Fire category, add note, and complete dispatch
    await page.locator('ion-tab-button[tab="sos"]').click();
    await page.locator('ion-chip', { hasText: 'Fire' }).click();
    await page.locator('ion-textarea textarea').fill('Near main gate');
    await page.getByRole('button', { name: /SOS — CALL 911 \(3s GUARD\)/i }).click();

    await expect(page.getByText('Emergency Output Sent')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('911 (BLOCKED - Safe Test Mode)')).toBeVisible();

    // Inspect alert in Admin Monitor and resolve it
    await page.locator('ion-tab-button[tab="admin"]').click();
    await expect(page.locator('app-admin ion-title')).toContainText('Admin Monitor');
    await expect(page.getByText('Near main gate')).toBeVisible();

    await page.getByRole('button', { name: /Acknowledge/i }).click();
    await expect(page.locator('ion-badge', { hasText: 'Acknowledged' }).first()).toBeVisible();

    await page.getByRole('button', { name: /Mark Resolved/i }).click();
    await expect(page.locator('ion-badge', { hasText: 'Resolved' }).first()).toBeVisible();
  });
});
