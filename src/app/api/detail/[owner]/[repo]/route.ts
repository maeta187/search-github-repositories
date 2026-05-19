import { fetchRepositoryDetail } from '@/features/detail/service';
import {
  validateRepositoryDetailOwnerParams,
  validateRepositoryDetailRepoParams,
} from '@/features/detail/validation';
import { RepositoryDetailParams } from '@/types/detail';

interface DetailRoutePrams {
  params: RepositoryDetailParams;
}

export async function GET(_: Request, { params }: DetailRoutePrams) {
  try {
    const { owner, repo } = await params;

    // オーナーのバリデーション
    const isValidOwner = validateRepositoryDetailOwnerParams(owner);
    if (isValidOwner instanceof Object && 'message' in isValidOwner) {
      return Response.json({ message: isValidOwner.message }, { status: 400 });
    }

    // リポジトリー名のバリデーション
    const isValidRepo = validateRepositoryDetailRepoParams(repo);
    if (isValidRepo instanceof Object && 'message' in isValidRepo) {
      return Response.json({ message: isValidRepo.message }, { status: 400 });
    }

    const data = await fetchRepositoryDetail({ owner, repo });
    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }
    return Response.json(
      { message: 'リポジトリーの取得に失敗しました' },
      { status: 500 },
    );
  }
}
