import { SEARCH_REPOSITORIES_ENDPOINT } from '@/constant/endpoint';
import {
  FetchRepositoriesParams,
  RepositoryList,
  RepositoryListResponse,
} from '@/types/top';
import { cacheLife } from 'next/cache';

const SORT = 'stars';
const ORDER = 'desc';
const PER_PAGE = 10;

export async function fetchRepositories({
  q,
  page,
}: FetchRepositoriesParams): Promise<RepositoryList> {
  'use cache';
  cacheLife({
    stale: 300,
    revalidate: 600,
    expire: 1800,
  });

  const queryString = new URLSearchParams({
    q,
    page: String(page),
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
      cause: response,
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
    totalCount: Math.min(Math.ceil(responseData.total_count / PER_PAGE), 10),
    incompleteResults: responseData.incomplete_results,
  };
}
