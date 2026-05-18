import { expect, test } from '@playwright/test';

test('エラーが発生した場合', async ({ page }) => {
  await page.goto('/top');
  await page.getByRole('textbox', { name: 'Repository Name' }).fill('.');
  await page.getByRole('button', { name: '検索' }).click();
  await expect(
    page.getByText('エラーが発生しました。再度検索を行ってください。'),
  ).toBeVisible();
});
