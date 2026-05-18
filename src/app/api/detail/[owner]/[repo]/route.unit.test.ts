import { API_ROUTES } from '@/constant/endpoint';
import { fetchRepositoryDetail } from '@/features/detail/service';
import {
  validateRepositoryDetailOwnerParams,
  validateRepositoryDetailRepoParams,
} from '@/features/detail/validation';
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

vi.mock('@/features/detail/validation', () => ({
  validateRepositoryDetailOwnerParams: vi.fn(),
  validateRepositoryDetailRepoParams: vi.fn(),
}));

describe('GET /api/detail/[owner]/[repo]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 毎テスト開始時にmockFetchを設定
    vi.stubGlobal('fetch', mockFetch);
    // 毎テスト開始時にバリデーションの結果をtrueに設定
    vi.mocked(validateRepositoryDetailOwnerParams).mockReturnValue(true);
    vi.mocked(validateRepositoryDetailRepoParams).mockReturnValue(true);
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

  it('オーナーが未入力の場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryDetailOwnerParams).mockReturnValue({
      message: 'オーナーは必須です',
    });
    const invalidParams = Promise.resolve({ owner: '', repo: 'react' });
    const { owner, repo } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッセージと一致することを確認
    expect(data).toEqual({ error: 'オーナーは必須です' });
  });

  it('オーナーが39文字を超える場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryDetailOwnerParams).mockReturnValue({
      message: 'オーナーは39文字以内で入力してください',
    });
    const invalidParams = Promise.resolve({
      owner: 'a'.repeat(40),
      repo: 'react',
    });
    const { owner, repo } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッセージと一致することを確認
    expect(data).toEqual({ error: 'オーナーは39文字以内で入力してください' });
  });

  it('オーナーに特殊文字が含まれる場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryDetailOwnerParams).mockReturnValue({
      message: 'オーナーには英字、数字、ハイフンのみ使用できます',
    });
    const invalidParams = Promise.resolve({ owner: 'react@', repo: 'react' });
    const { owner, repo } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッジと一致することを確認
    expect(data).toEqual({
      error: 'オーナーには英字、数字、ハイフンのみ使用できます',
    });
  });

  it('オーナーがハイフンで始まるまたはハイフンで終わる場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryDetailOwnerParams).mockReturnValue({
      message:
        'オーナーはハイフンで始まるまたはハイフンで終わることはできません',
    });
    const invalidParams = Promise.resolve({ owner: '-react', repo: 'react' });
    const { owner, repo } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッジと一致することを確認
    expect(data).toEqual({
      error: 'オーナーはハイフンで始まるまたはハイフンで終わることはできません',
    });
  });

  it('リポジトリー名が未入力の場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryDetailRepoParams).mockReturnValue({
      message: 'リポジトリー名は必須です',
    });
    const invalidParams = Promise.resolve({ owner: 'facebook', repo: '' });
    const { owner, repo } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッジと一致することを確認
    expect(data).toEqual({ error: 'リポジトリー名は必須です' });
  });

  it('リポジトリー名が100文字を超える場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryDetailRepoParams).mockReturnValue({
      message: 'リポジトリー名は100文字以内で入力してください',
    });
    const invalidParams = Promise.resolve({
      owner: 'facebook',
      repo: 'a'.repeat(101),
    });
    const { owner, repo } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッジと一致することを確認
    expect(data).toEqual({
      error: 'リポジトリー名は100文字以内で入力してください',
    });
  });

  it('リポジトリー名に特殊文字が含まれる場合400エラーを返す', async () => {
    vi.mocked(validateRepositoryDetailRepoParams).mockReturnValue({
      message:
        'リポジトリー名には英字、数字、ハイフン、アンダースコア、ドットのみ使用できます',
    });
    const invalidParams = Promise.resolve({
      owner: 'facebook',
      repo: 'react@',
    });
    const { owner, repo } = await invalidParams;
    const request = new Request(
      `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
    );
    const response = await GET(request, { params: invalidParams });
    // ステータス番号が400であることを確認
    expect(response.status).toBe(400);
    // responseがokがfalseであることを確認
    expect(response.ok).toBeFalsy();
    const data = await response.json();
    // dataがmock化したエラーメッジと一致することを確認
    expect(data).toEqual({
      error:
        'リポジトリー名には英字、数字、ハイフン、アンダースコア、ドットのみ使用できます',
    });
  });
});
