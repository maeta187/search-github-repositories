'use client';

import { HStack, Icon, Text, VStack } from '@/components/ui';
import { AlertCircle, TriangleAlert } from 'lucide-react';

interface ErrorTextProps {
  repositoryNotFound: boolean;
}

export const ErrorText = ({ repositoryNotFound }: ErrorTextProps) => {
  const message = repositoryNotFound
    ? 'リポジトリーが見つかりません。'
    : 'エラーが発生しました。';
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
        <Text as="p">
          {message}
          <br />
          再度検索を行ってください。
        </Text>
      </HStack>
    </VStack>
  );
};
