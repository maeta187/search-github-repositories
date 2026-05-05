import type { FetchRepositoriesQuery, RepositoryResponse } from '@/types/top';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRepositories } from './actions';

// cacheLifeでエラーが起きるのでモック化
vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
}));

const mockFetch = vi.fn();

const baseQuery: FetchRepositoriesQuery = {
  q: 'foo',
  page: 1,
};

describe('fetchRepositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 毎テスト開始時にmockFetchを設定
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    // 毎テスト終了時にmockFetchを解除
    vi.unstubAllGlobals();
  });

  it('fetchRepositoriesを実行して検索結果が取得できること', async () => {
    // mockFetchの変え値を設定
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            name: 'foo',
            full_name: 'foo/bar',
            owner: { avatar_url: 'https://example.com/avatar.png' },
          },
        ],
        total_count: 1,
        incomplete_results: false,
      }),
    });
    const result: RepositoryResponse = await fetchRepositories(baseQuery);
    // resultがundefinedでないことを確認
    expect(result).toBeDefined();
    // result.itemsがundefinedでないことを確認
    expect(result.items).toBeDefined();
    // result.total_countが1であることを確認
    expect(result.total_count).toEqual(1);
    // result.incomplete_resultsがfalseであることを確認
    expect(result.incomplete_results).toBeFalsy();
    // result.items.lengthが1であることを確認
    expect(result.items.length).toEqual(1);
    // result.items[0].idが1であることを確認
    expect(result.items[0].id).toEqual(1);
    // result.items[0].nameがfooであることを確認
    expect(result.items[0].name).toEqual('foo');
    // result.items[0].full_nameがfoo/barであることを確認
    expect(result.items[0].full_name).toEqual('foo/bar');
    // result.items[0].owner.avatar_urlがhttps://example.com/avatar.pngであることを確認
    expect(result.items[0].owner.avatar_url).toEqual(
      'https://example.com/avatar.png',
    );
  });

  it('レスポンスが ok でないときはエラーを投げる', async () => {
    // mockFetchの変え値を設定
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    // 例外が発生することを確認
    await expect(fetchRepositories(baseQuery)).rejects.toThrow(
      'リポジトリーの一覧取得に失敗しました',
    );
  });
});
