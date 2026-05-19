import type { RepositoryDetail } from '@/types/detail';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RepositoryDetailContent } from './RepositoryDetailContent';

const mockFetch = vi.fn();

const detailParams = Promise.resolve({ owner: 'facebook', repo: 'react' });

const mockRepositoryDetail = {
  id: 1,
  name: 'react',
  fullName: 'facebook/react',
  avatarUrl: 'https://avatars.example/u/1',
  language: 'JavaScript',
  stargazersCount: 10,
  watchersCount: 20,
  forksCount: 30,
  openIssuesCount: 5,
};

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
}));

vi.mock('@/components/ui', () => ({
  VStack: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Card: {
    Root: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Header: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Body: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
}));

// RepositoryDetailItemコンポーネントをモック化する
vi.mock('@/app/detail/[owner]/[repo]/_components/RepositoryDetailItem', () => ({
  RepositoryDetailHeader: ({ data }: { data: RepositoryDetail }) => (
    <div>{data.name}</div>
  ),
  RepositoryDetailItemArea: ({ data }: { data: RepositoryDetail }) => (
    <div>{data.stargazersCount}</div>
  ),
}));

// ErrorTextコンポーネントをモック化する
vi.mock('@/app/detail/[owner]/[repo]/_components/ErrorText', () => ({
  ErrorText: () => <div>Error</div>,
}));

// BackButtonコンポーネントをモック化する
vi.mock('@/app/detail/[owner]/[repo]/_components/BackButton', () => ({
  BackButton: () => <div>Back</div>,
}));

describe('RepositoryDetailContent', () => {
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
      json: vi.fn().mockResolvedValue(mockRepositoryDetail),
    });
    // RepositoryDetailContentコンポーネントをレンダリングする
    render(await RepositoryDetailContent({ params: detailParams }));
    // RepositoryDetailHeader に渡した data.name が表示されていることを確認する
    expect(screen.getByText('react')).toBeInTheDocument();
    // RepositoryDetailItemArea に渡した data.stargazersCount が表示されていることを確認する
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('リポジトリーの取得に失敗する', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        message:
          'APIリクエスト中にエラーが発生しました。再度検索を行ってください。',
      }),
    });
    // RepositoryDetailContentコンポーネントをレンダリングする
    await expect(
      RepositoryDetailContent({ params: detailParams }),
    ).rejects.toThrow(
      'APIリクエスト中にエラーが発生しました。再度検索を行ってください。',
    );
  });
});
