# プロジェクト概要

GitHub API (search/repositories)を実行してリポジトリーを検索し、検索結果を一覧表示する。
一覧から１つクリックすると詳細画面に遷移するアプリケーション。

## 技術スタック

- Next.js(v16系)
  - App Router
  - React 19
  - TypeScript
  - YamadaUI

## 開発コマンド

基本的には`pnpm`を使用します。

```bash
pnpm dev                      # 開発サーバー起動
pnpm build                    # プロダクションビルド
pnpm i --frozen-lockfile      # 依存関係インストール
pnpm dlx <pkg>                # パッケージの一時利用
pnpm exec <pkg>               # パッケージを実行
```

## 開発方針

- 基本的に実装はしないでください。
- 主な作業は実装完了時のコードレビューを行なってください。
- プロジェクト独自のルールは`@docs/`ディレクトリ配下のドキュメントを参照してください。
