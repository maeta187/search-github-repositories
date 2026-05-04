import { ChangeColorIcon } from '@/app/_components/ChangeColorIcon';
import { NAV_LINKS } from '@/app/constant/nav-link';
import { Container, Flex, Heading, Link } from '@/components/ui';

export const Header = () => {
  return (
    <Container.Header paddingY={'lg'} paddingX={'lg'} borderBottom={'sm'}>
      <Flex w="full" justifyContent={'space-between'} alignItems={'center'}>
        <Link
          href={NAV_LINKS.TOP}
          colorScheme={'primary'}
          textTransform={'capitalize'}
        >
          <Heading as="h1" size="lg">
            search-github-repositories
          </Heading>
        </Link>
        <ChangeColorIcon />
      </Flex>
    </Container.Header>
  );
};
