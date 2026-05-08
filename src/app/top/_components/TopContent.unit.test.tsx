import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { forwardRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RepositorySearchForm, RepositorySearchResult } from './TopContent';

// userEventを使用するためのセットアップ
const user = userEvent.setup();

const mockOnNavigateDetail = vi.fn();
const mockRepositories = [
  {
    id: 1,
    name: 'foo',
    fullName: 'foo/bar',
    owner: { avatarUrl: 'https://example.com/avatar.png' },
  },
];

// YamadaUIのコンポーネント、フックをモック化する
vi.mock('@/components/ui', () => ({
  extractObject: vi.fn((errors, fn) => {
    const result: Record<string, unknown> = {};
    Object.keys(errors).forEach((key) => {
      result[key] = fn(errors[key]);
    });
    return result;
  }),
  Form: {
    Root: ({
      children,
      onSubmit,
      errorMessage,
    }: {
      children: React.ReactNode;
      onSubmit: React.FormEventHandler;
      errorMessage: Record<string, string>;
    }) => (
      <form onSubmit={onSubmit}>
        {children}
        {errorMessage &&
          Object.values(errorMessage).map(
            (msg, i) => msg && <span key={i}>{msg}</span>,
          )}
      </form>
    ),
    Body: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Group: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SubmitButton: ({
      children,
      disabled,
    }: {
      children: React.ReactNode;
      disabled: boolean;
    }) => (
      <button type="submit" disabled={disabled}>
        {children}
      </button>
    ),
  },
  Field: {
    Root: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
  Input: forwardRef(
    (
      props: React.InputHTMLAttributes<HTMLInputElement>,
      ref: React.Ref<HTMLInputElement>,
    ) => <input ref={ref} {...props} />,
  ),
  VStack: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Loading: {
    Circles: ({ color, fontSize }: { color: string; fontSize: string }) => (
      <div>
        <span style={{ color, fontSize }}>Loading...</span>
      </div>
    ),
  },
  List: {
    Root: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
    Item: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick: () => void;
    }) => (
      <li>
        <button type="button" onClick={onClick} data-testid="list-item">
          {children}
        </button>
      </li>
    ),
  },
  Card: {
    Root: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Body: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
  Avatar: ({ name, src }: { name: string; src: string }) => (
    <img src={src} alt={name} />
  ),
  Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

// FormProvider でラップするヘルパー
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const form = useForm();
  return <FormProvider {...form}>{children}</FormProvider>;
};

describe('RepositorySearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('空のまま送信するとバリデーションエラーが表示される', async () => {
    const onSubmit = vi.fn();
    // RepositorySearchFormコンポーネントをレンダリングする
    render(
      <Wrapper>
        <RepositorySearchForm isPending={false} onSubmit={onSubmit} />
      </Wrapper>,
    );
    // 未入力の状態で検索ボタンをクリックする
    await user.click(screen.getByRole('button', { name: '検索' }));
    // バリデーションエラーが表示されることを確認する
    expect(
      await screen.findByText('リポジトリ名は必須です'),
    ).toBeInTheDocument();
    // onSubmitが呼ばれないことを確認する
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('値を入力して送信すると onSubmit が呼ばれる', async () => {
    const onSubmit = vi.fn();
    // RepositorySearchFormコンポーネントをレンダリングする
    render(
      <Wrapper>
        <RepositorySearchForm isPending={false} onSubmit={onSubmit} />
      </Wrapper>,
    );
    // リポジトリ名を入力する
    await user.type(screen.getByPlaceholderText('Repository Name'), 'react');
    // 検索ボタンをクリックする
    await user.click(screen.getByRole('button', { name: '検索' }));
    // onSubmitが1回呼ばれることを確認する
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('isPending=true のとき検索ボタンが disabled になる', () => {
    // RepositorySearchFormコンポーネントをレンダリングする
    render(
      <Wrapper>
        <RepositorySearchForm isPending={true} onSubmit={vi.fn()} />
      </Wrapper>,
    );
    // 検索ボタンが disabled になることを確認する
    expect(screen.getByRole('button', { name: '検索' })).toBeDisabled();
  });
});

describe('RepositorySearchResult', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('isPending=true のときローディングアニメーションが表示される', () => {
    render(
      <RepositorySearchResult
        isPending={true}
        repositories={[]}
        onNavigateDetail={vi.fn()}
      />,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('isPending=false のときローディングアニメーションが表示されない', () => {
    render(
      <RepositorySearchResult
        isPending={false}
        repositories={[]}
        onNavigateDetail={vi.fn()}
      />,
    );
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('リストをクリックすると onNavigateDetail が呼ばれる', async () => {
    render(
      <RepositorySearchResult
        isPending={false}
        repositories={mockRepositories}
        onNavigateDetail={mockOnNavigateDetail}
      />,
    );
    // data-testid="list-item" をクリックする
    await user.click(screen.getByTestId('list-item'));
    // onNavigateDetail が1回呼ばれることを確認する
    expect(mockOnNavigateDetail).toHaveBeenCalledTimes(1);
  });
});
