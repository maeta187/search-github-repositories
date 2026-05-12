import { expect, test } from '@playwright/test';
test('リポジトリーの詳細画面に遷移する', async ({ page }) => {
  await page.goto('/top');
  await page.getByRole('textbox', { name: 'Repository Name' }).fill('React');
  await page.getByRole('button', { name: '検索' }).click();

  // 検索結果のリストアイテムが表示されるのを待つ
  const reactItem = page
    .getByRole('listitem')
    .filter({ hasText: 'react' })
    .first();
  // リストアイテムが表示されることを確認
  await expect(reactItem).toBeVisible();
  // クリックと同時にナビゲーションを待機(firefox対策でPromise.allを使用)
  await Promise.all([
    page.waitForURL(/\/detail\/.+\/react/),
    reactItem.click(),
  ]);
  // 詳細画面に遷移したことを確認
  await expect(
    page.getByText('react', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Star数')).toBeVisible();
});
