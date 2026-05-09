import { fetchRepositories } from '@/features/top/service';
import { RepositoriesParams } from '@/types/top';

interface TopRoutePrams {
  params: RepositoriesParams;
}

export async function GET(_: Request, { params }: TopRoutePrams) {
  try {
    const { q, page } = await params;
    const data = await fetchRepositories({ q, page });
    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(
      { error: 'リポジトリーの一覧取得に失敗しました' },
      { status: 500 },
    );
  }
}
