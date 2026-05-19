'use client';

import { HStack, Icon, Text, VStack } from '@/components/ui';
import { AlertCircle, TriangleAlert } from 'lucide-react';

interface ErrorTextProps {
  repositoryNotFound: boolean;
  errorMessage?: string;
}

export const ErrorText = ({
  repositoryNotFound,
  errorMessage = 'エラーが発生しました。',
}: ErrorTextProps) => {
  const message = repositoryNotFound
    ? 'リポジトリーが見つかりません。再度検索を行ってください。'
    : errorMessage;

  return (
    <VStack
      w="full"
      flex="1"
      alignItems="center"
      justifyContent="center"
      gap="md"
    >
      <HStack alignItems="center" justifyContent="center">
        <Icon
          as={repositoryNotFound ? TriangleAlert : AlertCircle}
          color={repositoryNotFound ? 'yellow' : 'red'}
          aria-hidden
        />
        <Text
          as="p"
          fontSize={{ base: 'md', md: 'sm' }}
          role="alert"
          aria-atomic="true"
        >
          {message}
        </Text>
      </HStack>
    </VStack>
  );
};
