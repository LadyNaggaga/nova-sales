import { expect, test, type Page } from '@playwright/test';

const mobileViewports = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
];

async function expectNoPageOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
}

for (const viewport of mobileViewports) {
  test(`mobile flow is usable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.getByRole('button', { name: 'Enter the theater' }).click();

    const reveal = page.locator('.intro-reveal');
    const proceed = page.getByRole('button', { name: /Proceed to seat map/i });
    await expect(reveal).toBeVisible();
    await proceed.scrollIntoViewIfNeeded();
    await expect(proceed).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Close curtain' })).toBeVisible();

    await proceed.click();
    await expect(page.getByRole('heading', { name: 'Pick your spot' })).toBeVisible();
    await expectNoPageOverflow(page);

    const seat = page.getByRole('button', { name: /Floor · A2/ });
    const seatBox = await seat.boundingBox();
    expect(seatBox?.width).toBeGreaterThanOrEqual(44);
    expect(seatBox?.height).toBeGreaterThanOrEqual(44);

    const seatMap = page.getByRole('region', { name: 'Scrollable seat map' });
    const scrollDimensions = await seatMap.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(scrollDimensions.scrollWidth).toBeGreaterThan(scrollDimensions.clientWidth);

    await seat.click();
    await page.locator('.mobile-bar [data-action="pay"]').click();
    const confirmation = page.getByRole('heading', { name: 'See you at the show!' });
    await expect(confirmation).toBeVisible({ timeout: 3_000 });
    await expect(confirmation).toBeFocused();
    await expect(confirmation).toBeInViewport();
  });
}

test('deterministic scenes and desktop layout remain intact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?demo=seat-map');
  await expect(page.getByRole('button', { name: /Floor · A2.*selected/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /Lower Bowl · A2.*selected/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Pay $341.60' })).toBeVisible();
  await expectNoPageOverflow(page);

  await page.goto('/?demo=confirmation');
  const confirmation = page.getByRole('heading', { name: 'See you at the show!' });
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toBeFocused();
  await expect(page.getByText('Order NL-CLOUD-DEMO · $341.60')).toBeVisible();
});
