import { expect, test } from '@playwright/test';

test('詳細画面からヘッダーのリンクをクリックして検索画面に戻る', async ({
  page,
}) => {
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
  await page.getByRole('link', { name: 'search-github-repositories' }).click();

  await expect(page).toHaveURL('/top');
  // 検索結果のリストアイテムが表示されることを確認
  await expect(
    page.getByRole('list').first().getByRole('listitem').first(),
  ).not.toBeVisible();
});

test('詳細画面から戻るボタンをクリックして検索画面に戻る', async ({ page }) => {
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
  await page.getByRole('button', { name: '戻る' }).click();

  await expect(page).toHaveURL('/top');
  // 検索結果のリストアイテムが表示されることを確認
  await expect(
    page.getByRole('list').first().getByRole('listitem').first(),
  ).toBeVisible();
});
