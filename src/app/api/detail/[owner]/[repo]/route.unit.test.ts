import { FIND_ONE_REPOSITORY_ENDPOINT } from '@/constant/endpoint';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const mockFetch = vi.fn();

const detailParams = Promise.resolve({ owner: 'facebook', repo: 'react' });

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

  it('リポジトリーの取得に成功する', async () => {
    const mockEntity = {
      id: 1,
      name: 'react',
      full_name: 'facebook/react',
      owner: { avatar_url: 'https://avatars.example/u/1' },
      language: 'TypeScript',
      stargazers_count: 10,
      watchers_count: 20,
      forks_count: 30,
      open_issues_count: 5,
    };
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockEntity),
    });

    const request = new Request(
      `${FIND_ONE_REPOSITORY_ENDPOINT}/facebook/react`,
    );
    const response = await GET(request, { params: detailParams });
    // responseが200であることを確認
    expect(response.status).toBe(200);
    // responseがokがtrueであることを確認
    expect(response.ok).toBeTruthy();
    const data = await response.json();
    // dataがキャメルケースのオブジェクトであることを確認
    expect(data).toEqual({
      id: 1,
      name: 'react',
      fullName: 'facebook/react',
      avatarUrl: 'https://avatars.example/u/1',
      language: 'TypeScript',
      stargazersCount: 10,
      watchersCount: 20,
      forksCount: 30,
      openIssuesCount: 5,
    });
  });

  it('リポジトリーの取得に失敗する', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    const request = new Request(
      `${FIND_ONE_REPOSITORY_ENDPOINT}/facebook/react`,
    );
    const response = await GET(request, { params: detailParams });

    // responseが404であることを確認
    expect(response.status).toBe(404);
    // responseがokがfalseであることを確認
    expect(response.ok).toBe(false);
    const errorData = await response.json();
    expect(errorData).toEqual({ error: 'リポジトリーの取得に失敗しました' });
  });
});
