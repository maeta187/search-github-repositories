import { fetchRepositories } from '@/features/top/service';
import { validateRepositoryParams } from '@/features/top/validation';
import { RepositoriesParams } from '@/types/top';

interface TopRoutePrams {
  params: RepositoriesParams;
}

export async function GET(_: Request, { params }: TopRoutePrams) {
  try {
    const { q, page } = await params;

    // パラメーターのバリデーション
    const isValid = validateRepositoryParams(q, page);
    if (isValid instanceof Object && 'message' in isValid) {
      return Response.json({ message: isValid.message }, { status: 400 });
    }

    const data = await fetchRepositories({ q, page });
    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }
    return Response.json(
      { message: 'リポジトリーの一覧取得に失敗しました' },
      { status: 500 },
    );
  }
}
