import { RepositoryDetailContent } from '@/app/detail/[owner]/[repo]/_components/RepositoryDetailContent';
import { Loading, VStack } from '@/components/ui';
import { RepositoryDetailParams } from '@/types/detail';
import { Suspense } from 'react';

interface PageProps {
  params: RepositoryDetailParams;
}

export default async function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <VStack w="full" alignItems="center" justifyContent="center">
          <Loading.Circles color="cyan.500" fontSize="6xl" />
        </VStack>
      }
    >
      <RepositoryDetailContent params={params} />
    </Suspense>
  );
}
