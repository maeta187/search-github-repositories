import { ErrorText } from '@/app/_components/ErrorText';
import {
  RepositoryDetailHeader,
  RepositoryDetailItemArea,
} from '@/app/detail/[owner]/[repo]/_components/RepositoryDetailItem';
import { Box, Card } from '@/components/ui';
import { API_ROUTES } from '@/constant/endpoint';
import type { RepositoryDetail, RepositoryDetailParams } from '@/types/detail';
import { cacheLife } from 'next/cache';

interface RepositoryDetailContentProps {
  params: RepositoryDetailParams;
}

export const RepositoryDetailContent = async ({
  params,
}: RepositoryDetailContentProps) => {
  'use cache';
  cacheLife({ stale: 300, revalidate: 600, expire: 1800 });
  const { owner, repo } = await params;
  const response = await fetch(
    `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
  );
  if (!response.ok) {
    return <ErrorText />;
  }
  const data: RepositoryDetail = await response.json();
  return (
    <Box w="full" display="flex" justifyContent="center">
      <Card.Root
        w={{ base: '8/12', lg: 'full' }}
        variant="subtle"
        paddingY="md"
        paddingX={{ base: 'md', sm: 'sm' }}
        borderRadius="2xl"
        gap="xl"
        alignItems={{ base: 'start', md: 'center' }}
      >
        <Card.Header>
          <RepositoryDetailHeader data={data} />
        </Card.Header>
        <Card.Body>
          <RepositoryDetailItemArea data={data} />
        </Card.Body>
      </Card.Root>
    </Box>
  );
};
