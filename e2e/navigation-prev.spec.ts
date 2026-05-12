import { expect, test } from '@playwright/test';

test('ページネーションのテスト : prev', async ({ page }) => {
  // Recording...
  await page.goto('/top');
  await expect(page.getByRole('navigation')).not.toBeVisible();
  await page.getByRole('textbox', { name: 'Repository Name' }).click();
  await page.getByRole('textbox', { name: 'Repository Name' }).fill('React');
  await page.getByRole('button', { name: '検索' }).click();
  // 検索結果のリストアイテムが表示されることを確認
  await expect(
    page.getByRole('list').first().getByRole('listitem').first(),
  ).toBeVisible();
  // ページネーションが表示されることを確認
  await expect(page.getByRole('navigation')).toBeVisible();
  // ページ1が表示されるカレントページであることを確認
  await expect(
    page.getByRole('button', { name: 'Go to page 1', exact: true }),
  ).toHaveAttribute('aria-current', 'page');

  // 最後のページに遷移する
  await page.getByRole('button', { name: 'Go to last page' }).click();
  // 最後のページが表示されるカレントページであることを確認
  await expect(
    page.getByRole('button', { name: 'Go to page 10', exact: true }),
  ).toHaveAttribute('aria-current', 'page');

  // ページ9に遷移する
  await page.getByRole('button', { name: 'Go to page 9' }).click();
  // ページ9が表示されるカレントページであることを確認
  await expect(
    page.getByRole('button', { name: 'Go to page 9', exact: true }),
  ).toHaveAttribute('aria-current', 'page');

  // ページ6に遷移する
  await page.getByRole('button', { name: 'Go to page 6' }).click();
  // ページ6が表示されるカレントページであることを確認
  await expect(
    page.getByRole('button', { name: 'Go to page 6', exact: true }),
  ).toHaveAttribute('aria-current', 'page');

  // 次のページに遷移する
  await page.getByRole('button', { name: 'Go to previous page' }).click();
  // ページ5が表示されるカレントページであることを確認
  await expect(
    page.getByRole('button', { name: 'Go to page 5', exact: true }),
  ).toHaveAttribute('aria-current', 'page');

  // ファーストページに遷移する
  await page.getByRole('button', { name: 'Go to first page' }).click();
  // ファーストページが表示されるカレントページであることを確認
  await expect(
    page.getByRole('button', { name: 'Go to page 1', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  // 前のページのボタンがdisabledであることを確認
  await expect(
    page.getByRole('button', { name: 'Go to previous page' }),
  ).toBeDisabled();
  // ファーストページのボタンがdisabledであることを確認
  await expect(
    page.getByRole('button', { name: 'Go to first page' }),
  ).toBeDisabled();
});
