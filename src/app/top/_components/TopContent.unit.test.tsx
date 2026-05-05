import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { forwardRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RepositorySearchForm } from './TopContent';

// userEventを使用するためのセットアップ
const user = userEvent.setup();

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
