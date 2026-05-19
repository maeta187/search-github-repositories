import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRepositoryDetail } from './service';

const mockFetch = vi.fn();

const mockArgs = { owner: 'facebook', repo: 'react' };

const mockResponseItem = {
  id: 1,
  name: 'React',
  full_name: 'facebook/react',
  owner: { avatar_url: 'https://avatars.example/u/1' },
  language: 'TypeScript',
  stargazers_count: 10,
  watchers_count: 20,
  forks_count: 30,
  open_issues_count: 5,
};

describe('fetchRepositoryDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('リポジトリーの取得に成功する', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponseItem),
    });

    const { owner, repo } = mockArgs;
    const response = await fetchRepositoryDetail({ owner, repo });
    // resultがundefinedでないことを確認
    expect(response).toBeDefined();
    // result.idが1であることを確認
    expect(response.id).toEqual(1);
    // result.nameがReactであることを確認
    expect(response.name).toEqual('React');
    // result.fullNameがfacebook/reactであることを確認
    expect(response.fullName).toEqual('facebook/react');
    // result.owner.avatarUrlがhttps://avatars.example/u/1であることを確認
    expect(response.avatarUrl).toEqual('https://avatars.example/u/1');
    // result.languageがTypeScriptであることを確認
    expect(response.language).toEqual('TypeScript');
    // result.stargazersCountが10であることを確認
    expect(response.stargazersCount).toEqual(10);
    // result.watchersCountが20であることを確認
    expect(response.watchersCount).toEqual(20);
    // result.forksCountが30であることを確認
    expect(response.forksCount).toEqual(30);
    // result.openIssuesCountが5であることを確認
    expect(response.openIssuesCount).toEqual(5);
  });

  it('リポジトリーの取得に失敗する', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        message: 'APIリクエスト中にエラーが発生しました。',
      }),
    });
    const { owner, repo } = mockArgs;
    const response = fetchRepositoryDetail({ owner, repo });
    // resultがundefinedでないことを確認
    await expect(response).rejects.toThrow(
      'APIリクエスト中にエラーが発生しました。',
    );
  });
});
