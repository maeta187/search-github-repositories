import { FIND_ONE_REPOSITORY_ENDPOINT } from '@/constant/endpoint';
import {
  FetchRepositoryDetailParams,
  RepositoryDetail,
  RepositoryDetailResponse,
} from '@/types/detail';

/**
 * リポジトリー詳細取得サービス
 */
export async function fetchRepositoryDetail({
  owner,
  repo,
}: FetchRepositoryDetailParams): Promise<RepositoryDetail> {
  const response = await fetch(
    `${FIND_ONE_REPOSITORY_ENDPOINT}/${owner}/${repo}`,
    {
      headers: {
        Accept: 'application/vnd.github.text-match+json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    const errorMessage =
      error.status === '404'
        ? 'リポジトリーが見つかりませんでした。'
        : 'APIリクエスト中にエラーが発生しました。';
    throw new Error(errorMessage, {
      cause: response,
    });
  }

  const responseData: RepositoryDetailResponse = await response.json();
  return {
    id: responseData.id,
    name: responseData.name,
    fullName: responseData.full_name,
    avatarUrl: responseData.owner.avatar_url,
    language: responseData.language,
    stargazersCount: responseData.stargazers_count,
    watchersCount: responseData.watchers_count,
    forksCount: responseData.forks_count,
    openIssuesCount: responseData.open_issues_count,
  };
}
