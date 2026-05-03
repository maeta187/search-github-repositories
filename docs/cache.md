# キャッシュ戦略

今回はNext.jsv16から追加された`Cache Component`を使用します。
新しい機能なので有効なのか不透明な部分はありますが、機能などのボリュームが少ないので有効で無いと判断した場合まだ剥がし易いので試験的に導入してみます。
JSXに対してもキャッシュ可能なのでパフォーマンスの向上にもつながると判断します。
ただし、検索一覧では結果が動的に変わりやすいのでJSXのキャッシュは不向きです。

## 使用方法

基本的に`'use cache'`を使用することでキャッシュを有効にします。
`'use cache'`を使用する位置でキャッシュが有効になります。
なのでどこをキャッシュするのかを明確にする必要があります。
また、`'use cache'`の次の行に`cacheLife()`を使用することでキャッシュの有効期限を設定できます。
細かい使用は公式ドキュメントを参照してください。

## キャッシュの適用範囲

### 検索一覧
JSXのキャッシュは行わずAPIのキャッシュのみ行う

### 詳細画面
同じIDで表示する場合に有効なのでJSXのキャッシュを行う

## Activityの使用検討

キャッシュコンポーネントを有効にすると、React 19.2から利用可能なActivityコンポーネントを使用して、クライアントサイドナビゲーション中のコンポーネントの状態を保持できるようになるようです。
これがApp Routerを使用した場合でも有効なのか不明なので調査して判断します。

## 参考URL

- [Cache Component](https://nextjs.org/docs/app/building-your-application/caching/cache-component)
- [Activity Component](https://react.dev/reference/react/use)
- [Next.js 16で導入されたキャッシュコンポーネントについて理解する](https://zenn.dev/m_noto/articles/ec22016e47a214#use-cache)