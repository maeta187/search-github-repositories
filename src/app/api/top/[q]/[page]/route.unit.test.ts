import { API_ROUTES } from '@/constant/endpoint';
import { fetchRepositories } from '@/features/top/service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const mockFetch = vi.fn();

const mockParams = Promise.resolve({ q: 'React', page: 1 });

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

describe('GET /api/top/[q]/[page]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 毎テスト開始時にmockFetchを設定
    vi.stubGlobal('fetch', mockFetch);
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
    expect(data).toEqual({ error: 'リポジトリーの一覧取得に失敗しました' });
  });
});
