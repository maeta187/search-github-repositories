'use client';

import { HStack, Icon, Text, VStack } from '@/components/ui';
import { Ban } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function NotFound() {
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
      gap="md"
    >
      <HStack alignItems="center" justifyContent="center">
        <Icon as={Ban} color="red" aria-hidden />
        <Text as="p" textAlign="center" fontWeight="bold" ref={errorMessageRef}>
          404
          <br /> お探しのページは存在しません。
        </Text>
      </HStack>
    </VStack>
  );
}
