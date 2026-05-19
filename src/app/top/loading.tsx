import { Loading as LoadingComponent, VStack } from '@/components/ui';

export default function Loading() {
  return (
    <VStack w="full" alignItems="center" justifyContent="center">
      <LoadingComponent.Circles color="cyan.500" fontSize="6xl" />
    </VStack>
  );
}
