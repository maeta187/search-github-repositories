# API

## APIについて

- APIのロジックの実装は`features`ディレクトリに配置し、`service.ts`というファイル名で実装する。`
- 呼び出し元は`app/api`ディレクトリに配置し、`route.ts`というファイル名で実装する。

## app/apiの仕様

- Next.jsのAPI Routesに準拠する。｀
- 基本的には`ドメイン`配下に配置し、クエリパラメーターが必要な場合はドメイン配下に`[パラメーター]`を配置する。
- `route.ts`内は`service.ts`を呼び出すだけのシンプルなコードにする。
- `try-catch`でエラーハンドリングを行い、エラーが発生した場合は`Response.json`でエラーメッセージを返す。
- paramsはPromiseで渡されるので、`await`でデータを取得する。

## service.tsの仕様

- APIのロジックを実装する。
- APIからはスネークケースでデータが返ってくるので、キャメルケースに変換して返す。
- `try-catch`は使用せず`!response.ok`でエラーハンドリングを行う。

## コンポーネント

## client component

- 基本的に`try-catch`を使用してエラーハンドリングを行う。

## server component

- 基本的に`try-catch`を使用せず、`!response.ok`でエラーハンドリングを行う。
- エラーだった場合はエラーコンポーネントを表示する。
