import { BackButton } from '@/app/detail/[owner]/[repo]/_components/BackButton';
import {
  RepositoryDetailHeader,
  RepositoryDetailItemArea,
} from '@/app/detail/[owner]/[repo]/_components/RepositoryDetailItem';
import { Box, Card, VStack } from '@/components/ui';
import { API_ROUTES } from '@/constant/endpoint';
import type { RepositoryDetail, RepositoryDetailParams } from '@/types/detail';
import { cacheLife } from 'next/cache';

interface RepositoryDetailContentProps {
  params: RepositoryDetailParams;
}

/**
 * リポジトリー詳細コンポーネント
 * API処理を行なって結果を子コンポーネントに渡す
 */
export const RepositoryDetailContent = async ({
  params,
}: RepositoryDetailContentProps) => {
  'use cache';
  cacheLife('api');
  const { owner, repo } = await params;
  const response = await fetch(
    `${API_ROUTES.REPOSITORY_DETAIL}/${owner}/${repo}`,
  );
  if (!response.ok) {
    const error: { message: string } = await response.json();
    throw new Error(error.message);
  }
  const data: RepositoryDetail = await response.json();
  return (
    <VStack w="full" justifyContent="center" alignItems="center">
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
      <Box
        w={{ base: '8/12', lg: 'full' }}
        display="flex"
        justifyContent="flex-end"
      >
        <BackButton />
      </Box>
    </VStack>
  );
};
