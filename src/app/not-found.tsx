'use client';

import { HStack, Icon, Text, VStack } from '@/components/ui';
import { Ban } from 'lucide-react';

export default function NotFound() {
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
        <Text as="p" textAlign="center" fontWeight="bold">
          404
          <br /> お探しのページは存在しません。
        </Text>
      </HStack>
    </VStack>
  );
}
