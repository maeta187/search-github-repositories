import { expect, test } from '@playwright/test';

test('不明なURLにアクセスした場合', async ({ page }) => {
  await page.goto('http://localhost:4000/foo');
  await expect(
    page.getByText('404 お探しのページは存在しません。'),
  ).toBeVisible();
});
