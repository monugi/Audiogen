import { test, expect } from '@playwright/test';

test('Convert, Play, and Download work', async ({ page }) => {
  await page.goto('/');

  // Enter text
  const textarea = page.locator('textarea');
  await expect(textarea).toBeVisible();
  await textarea.fill('Hello from automated test. This is a test of offline TTS.');

  // Click Convert
  const convertBtn = page.locator('[data-testid="btn-convert"]');
  await convertBtn.click();

  // Wait for conversion to finish by checking window.__lastWavUrl
  await page.waitForFunction(() => (window as any).__lastWavUrl, null, { timeout: 30000 });
  const wavUrl = await page.evaluate(() => (window as any).__lastWavUrl as string);
  expect(wavUrl).toBeTruthy();

  // Click Play
  const playBtn = page.locator('[data-testid="btn-play"]');
  await expect(playBtn).toBeEnabled();
  await playBtn.click();

  // Trigger Download and confirm download starts
  const [ download ] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    page.locator('[data-testid="btn-download"]').click(),
  ]);
  expect(download.suggestedFilename()).toContain('speech');
}); 