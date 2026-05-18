import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRepositories } from './service';

const mockFetch = vi.fn();

const mockArgs = { q: 'React', page: '1' };

const mockResponseItem = {
  id: 1,
  name: 'React',
  full_name: 'facebook/react',
  owner: { avatar_url: 'https://avatars.example/u/1' },
};

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
}));

describe('fetchRepositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('リポジトリーの一覧取得に成功する', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        items: [mockResponseItem],
        total_count: 1,
        incomplete_results: false,
      }),
    });
    const { q, page } = mockArgs;
    const response = await fetchRepositories({ q, page });
    // resultがundefinedでないことを確認
    expect(response).toBeDefined();
    // result.itemsがundefinedでないことを確認
    expect(response.items).toBeDefined();
    // result.totalCountが1であることを確認
    expect(response.totalCount).toEqual(1);
    // result.incompleteResultsがfalseであることを確認
    expect(response.incompleteResults).toBeFalsy();
    // result.items.lengthが1であることを確認
    expect(response.items.length).toEqual(1);
    // result.items[0].idが1であることを確認
    expect(response.items[0].id).toEqual(1);
    // result.items[0].nameがfooであることを確認
    expect(response.items[0].name).toEqual('React');
    // result.items[0].fullNameがfoo/barであることを確認
    expect(response.items[0].fullName).toEqual('facebook/react');
    // result.items[0].owner.avatarUrlがhttps://example.com/avatar.pngであることを確認
    expect(response.items[0].owner.avatarUrl).toEqual(
      'https://avatars.example/u/1',
    );
  });

  it('リポジトリーの一覧取得に失敗する', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        message: 'リポジトリーの一覧取得に失敗しました',
      }),
    });
    const { q, page } = mockArgs;
    const response = fetchRepositories({ q, page });
    // throw new Errorが呼ばれることを確認
    await expect(response).rejects.toThrow(
      'リポジトリーの一覧取得に失敗しました',
    );
  });
});
