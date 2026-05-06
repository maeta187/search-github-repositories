import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const mockFetch = vi.fn();

describe('GET /api/detail', () => {
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
    const mockData = { id: 1, name: 'react', full_name: 'facebook/react' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const request = new Request(
      'http://localhost/api/detail?fullName=facebook/react',
    );
    const response = await GET(request);
    // responseが200であることを確認
    expect(response.status).toBe(200);
    // responseがokがtrueであることを確認
    expect(response.ok).toBeTruthy();
    const data = await response.json();
    // responseのdataがmockDataと一致することを確認
    expect(data).toEqual(mockData);
  });

  it('リポジトリーの取得に失敗する', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    const request = new Request(
      'http://localhost/api/detail?fullName=facebook/react',
    );
    const response = await GET(request);

    // responseが404であることを確認
    expect(response.status).toBe(404);
    // responseがokがfalseであることを確認
    expect(response.ok).toBe(false);
    const errorData = await response.json();
    expect(errorData).toEqual({ error: 'リポジトリーの取得に失敗しました' });
  });

  it('fullNameが null の場合は400でエラーを返す', async () => {
    const request = new Request('http://localhost/api/detail');
    const response = await GET(request);
    // responseが400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBe(false);
    const errorData = await response.json();
    expect(errorData).toEqual({ error: 'fullName が必要です' });
  });
});
