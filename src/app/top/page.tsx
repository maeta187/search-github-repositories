import { TopContent } from '@/app/top/_components/TopContent';
import { Loading, VStack } from '@/components/ui';
import { Suspense } from 'react';

export default function TopPage() {
  return (
    <Suspense
      fallback={
        <VStack w="full" alignItems="center" justifyContent="center">
          <Loading.Circles color="cyan.500" fontSize="6xl" />
        </VStack>
      }
    >
      <TopContent />
    </Suspense>
  );
}
