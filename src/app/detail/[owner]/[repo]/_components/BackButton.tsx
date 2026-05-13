'use client';

import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const { back } = useRouter();
  return (
    <Button w="fit-content" onClick={back}>
      戻る
    </Button>
  );
};
