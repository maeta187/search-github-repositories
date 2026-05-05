'use server';

import type {
  FetchRepositoriesDto,
  RepositoryResponse,
  RepositoryResponseEntity,
} from '@/types/top';
import { cacheLife } from 'next/cache';

const ENDPOINT = 'https://api.github.com/search/repositories';

export async function fetchRepositories(dto: FetchRepositoriesDto) {
  'use cache';
  cacheLife({
    stale: 300, // 5分: クライアントがサーバーに問い合わせずキャッシュを使う期間
    revalidate: 300, // 5分: サーバー側でキャッシュを再検証する間隔
    expire: 300, // 5分: キャッシュの最大保持期間
  });

  const { q, page, sort = 'stars', order = 'desc', perPage = 10 } = dto;
  // URLSearchParamsを使用してパラメーターを生成
  const params = new URLSearchParams({
    q,
    page: String(page),
    sort,
    order,
    per_page: String(perPage),
  });

  const response = await fetch(`${ENDPOINT}?${params}`, {
    method: 'GET',
    headers: {
      'X-GitHub-Api-Version': '2026-03-10',
    },
  });
  if (!response.ok) {
    throw new Error('リポジトリーの一覧取得に失敗しました', {
      cause: response,
    });
  }

  const data: RepositoryResponseEntity = await response.json();
  const returnData: RepositoryResponse = {
    items: data.items.map((item) => ({
      ...item,
      fullName: item.full_name,
      owner: {
        avatarUrl: item.owner.avatar_url,
      },
    })),
    // 上限を10ページに制限する
    totalCount: Math.min(Math.ceil(data.total_count / perPage), 10),
    incompleteResults: data.incomplete_results,
  };
  return returnData;
}
