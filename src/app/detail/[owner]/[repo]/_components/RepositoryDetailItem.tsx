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

interface RepositoryDetailProps {
  data: RepositoryDetail;
}

export const RepositoryDetailHeader = ({ data }: RepositoryDetailProps) => {
  return (
    <Flex gap="xl" alignItems="center">
      <ClientOnly fallback={<SkeletonCircle boxSize="4xs" rounded="l2" />}>
        <Avatar
          w="4xs"
          h="4xs"
          name={data.name}
          src={data.avatarUrl}
          alt={data.name}
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
        >
          {data.name}
        </Text>
        <Tag w={'fit-content'} variant="solid" tabIndex={0}>
          {data.language}
        </Tag>
      </VStack>
    </Flex>
  );
};

export const RepositoryDetailItemArea = ({ data }: RepositoryDetailProps) => {
  const items: RepositoryDetailItem[] = [
    {
      label: 'Star数',
      icon: Star,
      value: data.stargazersCount,
    },
    {
      label: 'Watcher数',
      icon: Eye,
      value: data.watchersCount,
    },
    {
      label: 'Fork数',
      icon: GitFork,
      value: data.forksCount,
    },
    {
      label: 'Issue数',
      icon: CircleDot,
      value: data.openIssuesCount,
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
          <VStack alignItems="center" gap="sm">
            <Flex
              alignItems="center"
              gap="xs"
              tabIndex={0}
              aria-label={item.label}
            >
              <Icon as={item.icon} fontSize="sm" aria-hidden />
              <Text fontSize="sm" as="p" aria-hidden>
                {item.label}
              </Text>
            </Flex>
            <Text as="p" tabIndex={0}>
              {item.value}
            </Text>
          </VStack>
        </GridItem>
      ))}
    </Grid>
  );
};
