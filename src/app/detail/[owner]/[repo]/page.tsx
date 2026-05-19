import { RepositoryDetailContent } from '@/app/detail/[owner]/[repo]/_components/RepositoryDetailContent';

import { RepositoryDetailParams } from '@/types/detail';

interface PageProps {
  params: RepositoryDetailParams;
}

export default async function Page({ params }: PageProps) {
  return <RepositoryDetailContent params={params} />;
}
