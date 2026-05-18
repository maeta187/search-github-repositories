import { SEARCH_REPOSITORIES_ENDPOINT } from '@/constant/endpoint';
import { MAX_COUNT, ORDER, PER_PAGE, SORT } from '@/constant/top';
import {
  FetchRepositoriesParams,
  RepositoryList,
  RepositoryListResponse,
} from '@/types/top';
import { cacheLife } from 'next/cache';

/**
 * リポジトリー一覧取得サービス
 */
export async function fetchRepositories({
  q,
  page,
}: FetchRepositoriesParams): Promise<RepositoryList> {
  'use cache';
  cacheLife('api');

  const queryString = new URLSearchParams({
    q,
    page,
    sort: SORT,
    order: ORDER,
    per_page: String(PER_PAGE),
  }).toString();

  const response = await fetch(
    `${SEARCH_REPOSITORIES_ENDPOINT}?${queryString}`,
    {
      headers: {
        Accept: 'application/vnd.github.text-match+json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? 'APIリクエスト中にエラーが発生しました', {
      cause: error,
    });
  }

  const responseData: RepositoryListResponse = await response.json();
  return {
    items: responseData.items.map((item) => ({
      id: item.id,
      name: item.name,
      fullName: item.full_name,
      owner: { avatarUrl: item.owner.avatar_url },
    })),
    totalCount: Math.min(
      Math.ceil(responseData.total_count / PER_PAGE),
      MAX_COUNT,
    ),
    incompleteResults: responseData.incomplete_results,
  };
}
