import { expect, test } from '@playwright/test';

test('リポジトリーが存在しない場合', async ({ page }) => {
  await page.goto('/top');
  await page
    .getByRole('textbox', { name: 'Repository Name' })
    .fill('nonexistent-repononexistent-repo');
  await page.getByRole('button', { name: '検索' }).click();
  await expect(page.getByText('リポジトリーが見つかりません。')).toBeVisible();
});
