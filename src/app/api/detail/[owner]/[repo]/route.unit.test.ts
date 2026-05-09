import { API_ROUTES } from '@/constant/endpoint';
import { fetchRepositoryDetail } from '@/features/detail/service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const mockFetch = vi.fn();

const mockParams = Promise.resolve({ owner: 'facebook', repo: 'react' });

const mockResponse = {
  id: 1,
  name: 'react',
  fullName: 'facebook/react',
  avatarUrl: 'https://avatars.example/u/1',
  language: 'TypeScript',
  stargazersCount: 10,
  watchersCount: 20,
  forksCount: 30,
  openIssuesCount: 5,
};

vi.mock('@/features/detail/service', () => ({
  fetchRepositoryDetail: vi.fn(),
}));

describe('GET /api/detail/[owner]/[repo]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 毎テスト開始時にmockFetchを設定
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    // 毎テスト終了時にmockFetchを解除
    vi.unstubAllGlobals();
  });

  it('リポジトリーの詳細取得に成功する', async () => {
    vi.mocked(fetchRepositoryDetail).mockResolvedValue(mockResponse);
    const { owner, repo } = await mockParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: mockParams });
    // responseが200であることを確認
    expect(response.status).toBe(200);
    // responseがokがtrueであることを確認
    expect(response.ok).toBeTruthy();
    const data = await response.json();
    // dataがmockResponseと一致することを確認
    expect(data).toEqual(mockResponse);
  });

  it('リポジトリーの詳細取得に失敗する', async () => {
    vi.mocked(fetchRepositoryDetail).mockRejectedValue(
      new Error('リポジトリーの詳細取得に失敗しました'),
    );

    const { owner, repo } = await mockParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: mockParams });
    // responseが500であることを確認
    expect(response.status).toBe(500);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッセージと一致することを確認
    expect(data).toEqual({ error: 'リポジトリーの詳細取得に失敗しました' });
  });
});
