# テスト戦略

テストは**Vitest**を使用します。
ロジック、コンポーネント、APIの単位ではユニットテストを行います。
一覧画面から詳細画面への遷移はe2eテストを行います。
e2eテストは**Vitest**のブラウザモードを使用してテストを行います。
内部的に**Playwright**を使用してテストを行いますのでテストコードの書き方は**Playwright**のドキュメントを参考にしてください。

## ファイル名の命名規則

テストファイルはテスト対象のファイルと同じディレクトリに配置します。
ファイル名はテスト対象のファイル名に`*.test.ts`を追加します。
ユニットテストとe2eは分けて実行するので下記のように命名します。

- ユニットテスト: `*.unit.test.ts`
- e2eテスト: `*.browser.test.tsx`

## 参考URL

- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Vitest Browser Mode](https://vitest.dev/config/browser/)