'use client';
import {
  Avatar,
  ClientOnly,
  Flex,
  Grid,
  GridItem,
  Icon,
  SkeletonCircle,
  Tag,
  Text,
  VStack,
} from '@/components/ui';
import type { RepositoryDetail, RepositoryDetailItem } from '@/types/detail';
import { CircleDot, Eye, GitFork, Star } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface RepositoryDetailProps {
  data: RepositoryDetail;
}

/**
 * リポジトリー詳細ヘッダーコンポーネント
 * アバター、リポジトリー名、言語を表示する
 */
export const RepositoryDetailHeader = ({ data }: RepositoryDetailProps) => {
  const repositoryNameRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    repositoryNameRef.current?.focus();
  }, []);

  return (
    <Flex gap="xl" alignItems="center">
      <ClientOnly fallback={<SkeletonCircle boxSize="4xs" rounded="l2" />}>
        <Avatar
          w="4xs"
          h="4xs"
          name={data.name}
          src={data.avatarUrl}
          alt={data.name}
          aria-hidden="true"
        />
      </ClientOnly>
      <VStack>
        <Text
          as="p"
          fontSize="2xl"
          fontWeight="bold"
          textTransform={'capitalize'}
          w="fit-content"
          tabIndex={0}
          wordBreak={'break-all'}
          aria-label={`リポジトリー名: ${data.name}`}
          ref={repositoryNameRef}
        >
          {data.name}
        </Text>
        <Tag
          w={'fit-content'}
          variant="solid"
          tabIndex={0}
          aria-label={`言語: ${data.language}`}
        >
          {data.language}
        </Tag>
      </VStack>
    </Flex>
  );
};

/**
 * リポジトリー詳細アイテムエリアコンポーネント
 * スター数、ウォッチャー数、フォーク数、イシュー数を表示する
 * 要素が増えてもレイアウトが崩れないようにGridを使用している
 */
export const RepositoryDetailItemArea = ({ data }: RepositoryDetailProps) => {
  const items: RepositoryDetailItem[] = [
    {
      label: 'Star数',
      icon: Star,
      value: data.stargazersCount,
      ariaLabel: `スターすう: ${data.stargazersCount}`,
    },
    {
      label: 'Watcher数',
      icon: Eye,
      value: data.watchersCount,
      ariaLabel: `ウォッチャーすう: ${data.watchersCount}`,
    },
    {
      label: 'Fork数',
      icon: GitFork,
      value: data.forksCount,
      ariaLabel: `フォークすう: ${data.forksCount}`,
    },
    {
      label: 'Issue数',
      icon: CircleDot,
      value: data.openIssuesCount,
      ariaLabel: `イシューすう: ${data.openIssuesCount}`,
    },
  ];

  return (
    <Grid
      as="ul"
      templateColumns={{ base: 'repeat(6, 1fr)', md: 'repeat(2, 1fr)' }}
      wordBreak="auto-phrase"
      gap="md"
    >
      {items.map((item) => (
        <GridItem key={item.label} as="li" alignItems="center">
          <VStack
            alignItems="center"
            gap="sm"
            tabIndex={0}
            aria-label={item.ariaLabel}
          >
            <Flex alignItems="center" gap="xs">
              <Icon as={item.icon} fontSize="sm" aria-hidden />
              <Text fontSize="sm" as="p" aria-hidden>
                {item.label}
              </Text>
            </Flex>
            <Text as="p" aria-hidden>
              {item.value}
            </Text>
          </VStack>
        </GridItem>
      ))}
    </Grid>
  );
};
