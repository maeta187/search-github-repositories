import { API_ROUTES } from '@/constant/endpoint';
import { fetchRepositories } from '@/features/top/service';
import { validateRepositoryParams } from '@/features/top/validation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const mockFetch = vi.fn();

const mockParams = Promise.resolve({ q: 'React', page: '1' });

const mockResponse = {
  id: 1,
  name: 'React',
  fullName: 'facebook/react',
  owner: {
    avatarUrl: 'https://avatars.example/u/1',
  },
};

vi.mock('@/features/top/service', () => ({
  fetchRepositories: vi.fn(),
}));

vi.mock('@/features/top/validation', () => ({
  validateRepositoryParams: vi.fn(),
}));

describe('GET /api/top/[q]/[page]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 毎テスト開始時にmockFetchを設定
    vi.stubGlobal('fetch', mockFetch);
    // 毎テスト開始時にバリデーションの結果をtrueに設定
    vi.mocked(validateRepositoryParams).mockReturnValue(true);
  });

  afterEach(() => {
    // 毎テスト終了時にmockFetchを解除
    vi.unstubAllGlobals();
  });

  it('リポジトリーの一覧取得に成功する', async () => {
    // fetchRepositories の戻り値をモック化
    vi.mocked(fetchRepositories).mockResolvedValue({
      items: [mockResponse],
      totalCount: 1,
      incompleteResults: false,
    });

    const { q, page } = await mockParams;
    const request = new Request(
      `${API_ROUTES.SEARCH_REPOSITORIES}/${q}/${page}`,
    );
    const response = await GET(request, { params: mockParams });
    // responseが200であることを確認
    expect(response.status).toBe(200);
    // responseがokがtrueであることを確認
    expect(response.ok).toBeTruthy();

    const data = await response.json();
    // dataがundefinedでないことを確認
    expect(data).toBeDefined();
    // data.items[0]がmockResponseItemと一致することを確認
    expect(data.items[0]).toEqual(mockResponse);
    // data.totalCountが1であることを確認
    expect(data.totalCount).toEqual(1);
    // data.incompleteResultsがfalseであることを確認
    expect(data.incompleteResults).toBeFalsy();
  });

  it('リポジトリーの一覧取得に失敗する', async () => {
    vi.mocked(fetchRepositories).mockRejectedValue(
      new Error('リポジトリーの一覧取得に失敗しました'),
    );

    const { q, page } = await mockParams;
    const request = new Request(
      `${API_ROUTES.SEARCH_REPOSITORIES}/${q}/${page}`,
    );
    const response = await GET(request, { params: mockParams });
    // responseが500であることを確認
    expect(response.status).toBe(500);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();

    // dataがmock化したエラーメッセージと一致することを確認
    expect(data).toEqual({ message: 'リポジトリーの一覧取得に失敗しました' });
  });

  it('リポジトリ名が未入力の場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryParams).mockReturnValue({
      message: 'リポジトリ名は必須です',
    });
    const invalidParams = Promise.resolve({ q: '', page: '1' });
    const { q, page } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.SEARCH_REPOSITORIES}/${q}/${page}`,
    );
    const response = await GET(request, { params: invalidParams });

    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();

    const data = await response.json();
    // dataがmock化したエラーメッセージと一致することを確認
    expect(data).toEqual({ message: 'リポジトリ名は必須です' });
  });

  it('リポジトリ名が256文字を超える場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryParams).mockReturnValue({
      message: 'リポジトリ名は256文字以内で入力してください',
    });
    const invalidParams = Promise.resolve({ q: 'a'.repeat(257), page: '1' });
    const { q, page } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.SEARCH_REPOSITORIES}/${q}/${page}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();

    // dataがmock化したエラーメッセージと一致することを確認
    expect(data).toEqual({
      message: 'リポジトリ名は256文字以内で入力してください',
    });
  });

  it('リポジトリ名に特殊文字が含まれる場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryParams).mockReturnValue({
      message:
        'リポジトリ名には英字、数字、ハイフン、アンダースコア、ドットのみ使用できます',
    });
    const invalidParams = Promise.resolve({ q: 'react@', page: '1' });
    const { q, page } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.SEARCH_REPOSITORIES}/${q}/${page}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();

    // dataがmock化したエラーメッセージと一致することを確認
    expect(data).toEqual({
      message:
        'リポジトリ名には英字、数字、ハイフン、アンダースコア、ドットのみ使用できます',
    });
  });

  it('ページ番号が数字でない場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryParams).mockReturnValue({
      message: 'ページは数字で入力してください',
    });
    const invalidParams = Promise.resolve({ q: 'react', page: 'a' });
    const { q, page } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.SEARCH_REPOSITORIES}/${q}/${page}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッセージと一致することを確認
    expect(data).toEqual({ message: 'ページは数字で入力してください' });
  });
});
