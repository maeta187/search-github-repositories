import { useColorMode } from '@/components/ui';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChangeColorIcon } from './ChangeColorIcon';

// userEventを使用するためのセットアップ
const user = userEvent.setup();

// YamadaUIのコンポーネント、フックをモック化する
vi.mock('@/components/ui', () => ({
  ClientOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SkeletonCircle: () => <div>SkeletonCircle</div>,
  IconButton: ({
    onClick,
    'aria-label': ariaLabel,
  }: {
    onClick: () => void;
    'aria-label': string;
  }) => <button onClick={onClick} aria-label={ariaLabel} />,
  useColorMode: vi.fn(),
}));

describe('ChangeColorIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('ライトモードではダークモード切替ボタン（Moon）を表示する', () => {
    // useColorModeをモック化する
    vi.mocked(useColorMode).mockReturnValue({
      colorMode: 'light',
      internalColorMode: 'light',
      toggleColorMode: vi.fn(),
      changeColorMode: vi.fn(),
    });
    // ChangeColorIconコンポーネントをレンダリングする
    render(<ChangeColorIcon />);
    // ダークモード切替ボタンが表示されていることを確認する
    expect(
      screen.getByRole('button', { name: 'ダークモード' }),
    ).toBeInTheDocument();
  });

  it('ダークモードではライトモード切替ボタン（Sun）を表示する', () => {
    // useColorModeをモック化する
    vi.mocked(useColorMode).mockReturnValue({
      colorMode: 'dark',
      internalColorMode: 'dark',
      toggleColorMode: vi.fn(),
      changeColorMode: vi.fn(),
    });
    // ChangeColorIconコンポーネントをレンダリングする
    render(<ChangeColorIcon />);
    // ダークモード切替ボタンが表示されていることを確認する
    expect(
      screen.getByRole('button', { name: 'ライトモード' }),
    ).toBeInTheDocument();
  });

  it('ボタンを押すと toggleColorMode が1回呼ばれる', async () => {
    // useColorModeをモック化する
    vi.mocked(useColorMode).mockReturnValue({
      colorMode: 'light',
      internalColorMode: 'light',
      toggleColorMode: vi.fn(),
      changeColorMode: vi.fn(),
    });
    // ChangeColorIconコンポーネントをレンダリングする
    render(<ChangeColorIcon />);
    const { toggleColorMode } = useColorMode();
    // 実行前にtoggleColorModeが0回呼ばれていることを確認する
    expect(toggleColorMode).toHaveBeenCalledTimes(0);
    const button = screen.getByRole('button', { name: 'ダークモード' });
    // ダークモード/ライトモード切替ボタンをクリックする
    await user.click(button);
    // toggleColorModeが1回呼ばれていることを確認する
    expect(toggleColorMode).toHaveBeenCalledTimes(1);
  });
});
