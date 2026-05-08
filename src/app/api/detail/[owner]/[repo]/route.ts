import { FIND_ONE_REPOSITORY_ENDPOINT } from '@/constant/endpoint';
import {
  RepositoryDetail,
  RepositoryDetailEntity,
  RepositoryDetailParams,
} from '@/types/detail';

interface DetailRoutePrams {
  params: RepositoryDetailParams;
}

export async function GET(_: Request, { params }: DetailRoutePrams) {
  const { owner, repo } = await params;
  const response = await fetch(
    `${FIND_ONE_REPOSITORY_ENDPOINT}/${owner}/${repo}`,
    {
      headers: {
        'X-GitHub-Api-Version': '2026-03-10',
      },
    },
  );
  if (!response.ok) {
    return Response.json(
      { error: 'リポジトリーの取得に失敗しました' },
      { status: response.status },
    );
  }
  const responseData: RepositoryDetailEntity = await response.json();
  const data: RepositoryDetail = {
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
  return Response.json(data);
}
