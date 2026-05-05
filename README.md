## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 拘ったポイント工夫したポイント

- ダークモードとライトモードを実装しました。
  - システム依存にし、アイコンクリックでダークモードとライトモードを切り替えられるようにしました。
- 一覧画面では10件取得するようにし、スクロールでページングするようにしました。
- API実行中はローディングアニメーションを表示するようにしました。
- 未入力で検索を行うとエラーが起きるのでクライアントバリデーションを実装しました。

## テスト

- `src/app/top/_components/TopContent.tsx`
  - `RepositorySearchForm` : コンポーネントはバリデーションを行っており、期待通りに動作することを確認しました。
  - `RepositorySearchResult` : APIの値を受け取って表示するコンポーネントなのでe2eテストで確認するためユニットテストは行わない。
  - `RepositoryListPagination` : ページングを行うコンポーネントなのでe2eテストで確認するためユニットテストは行わない。

## AIを使ったポイント

- Emotion依存のHydrationErrorがドキュメント通りにしても直らなかったのでAIに質問しました。
- ダークモードとライトモードの切り替えアイコンでHydrationErrorが発生したので解決方法がないか質問しました。
- 各タスク完了時に事前に設計したrulesなどを元にレビューしてもらいました。(修正してもらうのではなくあくまで指摘してもらう)
- テスト項目に不備がないか相談。
- GitHub APIの仕様について質問。
- `TopContent.tsx`内の処理が冗長になっていたのでリファクタリングできないか相談。
- `TopContent.tsx`内ので当初は`useForm`から参照した`isSubmitting`を使用していたが、ページネ ーションで遷移する時もdisabledの有効やアニメーションの表示を行いたくなったが、`submit`しないので`isSubmitting`では網羅できなかった。
  - AIに相談したところ、`useState`を使用した状態管理を提案したが冗長な状態管理と判断し、`useTransition`を使用した状態管理を採用。
- `RepositorySearchForm`で使用しているYamadaUIのコンポーネントや関数のモック化の方法を質問。
