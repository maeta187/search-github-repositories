import { fetchRepositoryDetail } from '@/features/detail/service';
import { RepositoryDetailParams } from '@/types/detail';

interface DetailRoutePrams {
  params: RepositoryDetailParams;
}

export async function GET(_: Request, { params }: DetailRoutePrams) {
  try {
    const { owner, repo } = await params;
    const data = await fetchRepositoryDetail({ owner, repo });
    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(
      { error: 'リポジトリーの取得に失敗しました' },
      { status: 500 },
    );
  }
}
