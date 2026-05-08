'use client';

import { HStack, Icon, Link, Text, VStack } from '@/components/ui';
import { NAV_LINKS } from '@/constant/nav-link';
import { AlertCircle } from 'lucide-react';

export const ErrorText = () => {
  return (
    <VStack
      w="full"
      flex="1"
      alignItems="center"
      justifyContent="center"
      gap="md"
    >
      <HStack alignItems="center" justifyContent="center">
        <Icon as={AlertCircle} aria-hidden />
        <Text as="p">
          エラーが発生しました。
          <br />
          検索画面から再度検索を行ってください。
        </Text>
      </HStack>
      <Link
        href={NAV_LINKS.TOP}
        w="fit-content"
        p="md"
        bg={['gray.900', 'gray.50']}
        color={['white', 'black']}
        rounded="lg"
      >
        検索画面に戻る
      </Link>
    </VStack>
  );
};
