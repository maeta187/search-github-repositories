'use client';

import { ChangeColorIcon } from '@/app/_components/ChangeColorIcon';
import { Container, Flex, Heading, Link } from '@/components/ui';
import { NAV_LINKS } from '@/constant/nav-link';
import { useEffect, useRef } from 'react';

export const Header = () => {
  const headingRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Container.Header paddingY={'lg'} paddingX={'lg'} borderBottom={'sm'}>
      <Flex w="full" justifyContent={'space-between'} alignItems={'center'}>
        <Link
          href={NAV_LINKS.TOP}
          colorScheme={'primary'}
          textTransform={'capitalize'}
          ref={headingRef}
        >
          <Heading as="h1" size="lg" tabIndex={-1}>
            search-github-repositories
          </Heading>
        </Link>
        <ChangeColorIcon />
      </Flex>
    </Container.Header>
  );
};
