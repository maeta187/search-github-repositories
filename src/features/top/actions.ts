import type { FetchRepositoriesQuery, RepositoryResponse } from '@/types/top';
import { cacheLife } from 'next/cache';

const ENDPOINT = 'https://api.github.com/search/repositories';

export async function fetchRepositories(query: FetchRepositoriesQuery) {
  'use cache';
  cacheLife({
    stale: 300, // 5分: クライアントがサーバーに問い合わせずキャッシュを使う期間
    revalidate: 300, // 5分: サーバー側でキャッシュを再検証する間隔
    expire: 300, // 5分: キャッシュの最大保持期間
  });

  const { q, page, sort = 'stars', order = 'desc', per_page = 10 } = query;
  // URLSearchParamsを使用してパラメーターを生成
  const params = new URLSearchParams({
    q,
    page: String(page),
    sort,
    order,
    per_page: String(per_page),
  });

  const response = await fetch(`${ENDPOINT}?${params}`, {
    method: 'GET',
    headers: {
      'X-GitHub-Api-Version': '2026-03-10',
    },
  });
  if (!response.ok) {
    throw new Error('リポジトリーの一覧取得に失敗しました');
  }
  const data: RepositoryResponse = await response.json();
  return data;
}
