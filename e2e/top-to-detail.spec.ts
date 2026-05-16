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
  // リストアイテムをクリック
  await reactItem.click();
  // URL が変わるまで明示的に待機(firefox対策)
  await page.waitForURL('**/detail/**');
  // 詳細画面に遷移したことを確認
  await expect(page).toHaveURL('/detail/facebook/react');
  await expect(
    page.getByText('react', { exact: true }).filter({ visible: true }),
  ).toBeVisible();

  // 「Star数」が表示されることを確認
  const starItem = page.getByRole('listitem').filter({ hasText: 'Star数' });
  await expect(starItem).toBeVisible();
});

test('存在しないリポジトリーの詳細画面に遷移した場合', async ({ page }) => {
  await page.goto('/detail/nonexistent-owner/nonexistent-repo');
  await expect(
    page.getByText(
      'エラーが発生しました。検索画面から再度検索を行ってください。',
    ),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: '検索画面に戻る' }),
  ).toBeVisible();
  await page.getByRole('link', { name: '検索画面に戻る' }).click();
  await expect(page).toHaveURL('/top');
});
