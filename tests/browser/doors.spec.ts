import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

async function ready(page: Page, query = '') {
  await page.goto(`/door-preview.html${query}`);
  await expect(page.locator('.hds-gallery')).toHaveAttribute('data-status', 'ready');
}

test('all four doors enter once, focus their destination, and return without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  for (const id of ['about', 'work', 'library', 'garden']) {
    await page.locator(`[data-door=${id}]`).click();
    await expect(page.locator(`.door-demo-room[data-room=${id}]`)).toBeVisible();
    await expect(page.locator('h1')).toBeFocused();
    await page.getByRole('link', { name: 'Back to the doors' }).click();
    await expect(page.locator('.hds-gallery')).toHaveAttribute('data-status', 'ready');
  }
  expect(errors).toEqual([]);
});

test('Escape cancels entry, restores the selected button, and permits another entry', async ({ page }) => {
  await ready(page);
  await page.locator('[data-door=library]').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.hds-gallery')).toHaveAttribute('data-status', 'ready');
  await expect(page.locator('[data-door=library]')).toBeFocused();
  await page.waitForTimeout(1300);
  await expect(page).toHaveURL(/door-preview.html$/);
  await page.locator('[data-door=work]').click();
  await expect(page.locator('.door-demo-room[data-room=work]')).toBeVisible();
});

test('peek mode opens and closes locally without navigating', async ({ page }) => {
  await ready(page);
  await page.getByRole('button', { name: 'Peek inside', exact: true }).click();
  await expect(page.locator('.hds-gallery')).toHaveAttribute('data-status', 'ready');
  const about = page.locator('[data-door=about]');
  await about.click();
  await expect(about).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(about).toHaveAttribute('aria-expanded', 'false');
  await expect(about).toBeFocused();
  await expect(page).toHaveURL(/door-preview.html$/);
});

test('mobile labels fit, do not overlap, and remain usable in both moods', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await ready(page);
    const boxes = await page.locator('.hds-label').evaluateAll(elements => elements.map(el => {
      const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    }));
    for (const box of boxes) {
      expect(box.x).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width);
      expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
    }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      expect(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    const beforeMood = await page.locator('.hds-entrance').getAttribute('data-mood');
    await page.getByRole('button', { name: 'Night mood', exact: true }).click();
    await expect(page.locator('.hds-entrance')).toHaveAttribute('data-mood', beforeMood === 'night' ? 'day' : 'night');
    await page.locator('[data-door=garden]').click();
    await expect(page.locator('.door-demo-room[data-room=garden]')).toBeVisible();
  }
});

test('single door and system reduced motion preserve navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, '?door=garden');
  await expect(page.locator('.hds-label')).toHaveCount(1);
  await expect(page.locator('.hds-gallery')).toHaveAttribute('data-reduced', 'true');
  await page.locator('[data-door=garden]').click();
  await expect(page.locator('.door-demo-room[data-room=garden]')).toBeVisible();
});

test('WebGL failure leaves real door controls available', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await ready(page);
  await expect(page.locator('.hds-gallery')).toHaveAttribute('data-fallback', 'true');
  await page.locator('[data-door=work]').click();
  await expect(page.locator('.door-demo-room[data-room=work]')).toBeVisible();
});

test('existing homepage remains separate from the door preview', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await expect(page.locator('.hds-gallery')).toHaveCount(0);
});

test('hover cracks the door, closes on leave, and respects reduced motion', async ({ page }) => {
  await ready(page);
  const result = await page.evaluate(async () => {
    const modulePath = '/src/components/doors/art/models.ts';
    const { createDoorModel } = await import(modulePath);
    const model = createDoorModel(0);
    model.hover = 1;
    for (let i = 0; i < 60; i++) model.update(1 / 60, i / 60, false);
    const hoveredAngle = model.pivot.rotation.y;
    model.hover = 0;
    for (let i = 0; i < 60; i++) model.update(1 / 60, i / 60, false);
    const closedAngle = model.pivot.rotation.y;
    model.hover = 1;
    model.update(1 / 60, 0, true);
    const reducedAngle = model.pivot.rotation.y;
    model.target = 1.14;
    for (let i = 0; i < 60; i++) model.update(1 / 60, i / 60, false);
    const openAngle = model.pivot.rotation.y;
    return { hoveredAngle, closedAngle, reducedAngle, openAngle };
  });
  expect(result.hoveredAngle).toBeCloseTo(-.045, 3);
  expect(Math.abs(result.closedAngle)).toBeLessThan(.001);
  expect(Math.abs(result.reducedAngle)).toBe(0);
  expect(result.openAngle).toBeLessThan(-1);
});
