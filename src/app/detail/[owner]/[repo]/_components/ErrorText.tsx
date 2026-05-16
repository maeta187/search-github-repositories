'use client';

import { HStack, Icon, Link, Text, VStack } from '@/components/ui';
import { NAV_LINKS } from '@/constant/nav-link';
import { AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const ErrorText = () => {
  const errorMessageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      errorMessageRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <VStack
      w="full"
      flex="1"
      alignItems="center"
      justifyContent="center"
      gap="ld"
    >
      <HStack alignItems="center" justifyContent="center">
        <Icon as={AlertCircle} color="red" aria-hidden />
        <Text
          as="p"
          fontSize={{ base: 'md', md: 'sm' }}
          ref={errorMessageRef}
          tabIndex={0}
        >
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
