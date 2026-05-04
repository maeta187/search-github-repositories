'use client';

import {
  ClientOnly,
  IconButton,
  SkeletonCircle,
  useColorMode,
} from '@/components/ui';
import { Moon, Sun } from 'lucide-react';

/**
 * ライトモードとダークモードを切り替えるアイコンボタン
 * SSRでレンダリングするとテームの切り替えの兼ね合いでHydration Errorが発生するため、ClientOnlyでラップしている
 */
export const ChangeColorIcon = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <ClientOnly fallback={<SkeletonCircle boxSize="9" rounded="l2" />}>
      {colorMode === 'light' ? (
        <IconButton
          as={Moon}
          onClick={toggleColorMode}
          variant="ghost"
          fullRounded
          size="sm"
          aria-label="ダークモード"
        />
      ) : (
        <IconButton
          as={Sun}
          onClick={toggleColorMode}
          variant="ghost"
          fullRounded
          size="sm"
          aria-label="ライトモード"
        />
      )}
    </ClientOnly>
  );
};
