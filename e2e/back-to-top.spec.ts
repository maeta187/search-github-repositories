import { expect, test } from '@playwright/test';

test('詳細画面から検索画面に戻る', async ({ page }) => {
  await page.goto('/detail/facebook/react');
  await page.getByRole('link', { name: 'search-github-repositories' }).click();

  await expect(page).toHaveURL('/top');
});
