'use client';

import { ErrorText } from '@/app/top/_components/ErrorText';
import {
  Avatar,
  Card,
  ClientOnly,
  extractObject,
  Field,
  Form,
  Input,
  List,
  Loading,
  Pagination,
  Skeleton,
  Text,
  VStack,
} from '@/components/ui';
import { API_ROUTES } from '@/constant/endpoint';
import { NAV_LINKS } from '@/constant/nav-link';

import { Repository } from '@/types/top';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';

interface RepositorySearchFormProps {
  isPending: boolean;
  onSubmit: SubmitHandler<Inputs>;
}

interface RepositorySearchResultProps {
  isPending: boolean;
  repositories: Repository[];
  onNavigateDetail: (repository: Repository) => void;
}

interface RepositoryListPageNationProps {
  totalCount: number;
  page: number;
  isPending: boolean;
  onPageChange: (page: number) => void;
}

type Inputs = {
  repositoryName: string;
};

const INIT_TOTAL_COUNT = 0;
const INIT_PAGE = 1;

export const TopContent = () => {
  const [repositories, setRepositories] = useState<Repository[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(INIT_TOTAL_COUNT);
  const [page, setPage] = useState(INIT_PAGE);
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();

  const form = useForm<Inputs>();
  const repositoryName = useWatch({
    control: form.control,
    name: 'repositoryName',
    defaultValue: '',
  });

  const search = async (name: string, pageNum: number) => {
    startTransition(async () => {
      try {
        const response = await fetch(
          `${API_ROUTES.SEARCH_REPOSITORIES}/${name}/${pageNum}`,
        );
        if (!response.ok) {
          const error: { error: string } = await response.json();
          throw new Error(error.error);
        }
        const result = await response.json();
        setRepositories(result.items);
        setTotalCount(result.totalCount);
        setErrorFlag(false);
      } catch (error) {
        console.error(error);
        setErrorFlag(true);
      }
    });
  };

  const handleNavigateDetail = ({ fullName, id }: Repository) => {
    sessionStorage.setItem('lastClickedRepoId', id.toString());
    push(`${NAV_LINKS.DETAIL}/${fullName}`);
  };

  const handleSubmit: SubmitHandler<Inputs> = async (data) => {
    setPage(INIT_PAGE);
    await search(data.repositoryName, INIT_PAGE);
  };

  const handlePageChange = async (value: number) => {
    setPage(value);
    await search(repositoryName, value);
  };

  return (
    <>
      <FormProvider {...form}>
        <RepositorySearchForm isPending={isPending} onSubmit={handleSubmit} />
      </FormProvider>
      {errorFlag ? (
        <ErrorText repositoryNotFound={false} />
      ) : repositories !== null && repositories.length === 0 ? (
        <ErrorText repositoryNotFound={true} />
      ) : (
        repositories !== null && (
          <>
            <RepositorySearchResult
              isPending={isPending}
              repositories={repositories}
              onNavigateDetail={handleNavigateDetail}
            />
            <RepositoryListPagination
              totalCount={totalCount}
              page={page}
              isPending={isPending}
              onPageChange={handlePageChange}
            />
          </>
        )
      )}
    </>
  );
};

export const RepositorySearchForm = ({
  isPending,
  onSubmit,
}: RepositorySearchFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<Inputs>();
  return (
    <Form.Root
      errorMessage={extractObject(errors, (value) => value?.message)}
      invalid={extractObject(errors, (value) => !!value)}
      required={{ repositoryName: true }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Form.Body
        display="flex"
        flexDirection={{ base: 'row', sm: 'column' }}
        gap="xl"
        justifyContent="center"
        alignItems={{ base: 'baseline', sm: 'anchor-center' }}
      >
        <Form.Group w={{ base: '4/12', md: '5/12', sm: 'full' }}>
          <Field.Root name="repositoryName" label="">
            <ClientOnly fallback={<Skeleton />}>
              <Input
                placeholder="Repository Name"
                {...register('repositoryName', {
                  required: { message: 'リポジトリ名は必須です', value: true },
                })}
              />
            </ClientOnly>
          </Field.Root>
        </Form.Group>
        <ClientOnly
          fallback={<Skeleton w={{ base: '1/12', md: '2/12', sm: '5/12' }} />}
        >
          <Form.SubmitButton
            w={{ base: '1/12', md: '2/12', sm: '5/12' }}
            disabled={isPending}
          >
            検索
          </Form.SubmitButton>
        </ClientOnly>
      </Form.Body>
    </Form.Root>
  );
};

export const RepositorySearchResult = ({
  isPending,
  repositories,
  onNavigateDetail,
}: RepositorySearchResultProps) => {
  const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  // 詳細ページから戻ってきた時にフォーカスを戻す
  useEffect(() => {
    // セッションストレージから最後にクリックしたリポジトリーのIDを取得
    const savedId = sessionStorage.getItem('lastClickedRepoId');
    if (!savedId) return;

    const focusElement = itemRefs.current.get(Number(savedId));

    if (focusElement) {
      focusElement.focus();
      // セッションストレージから最後にクリックしたリポジトリーのIDを削除
      sessionStorage.removeItem('lastClickedRepoId');
    }
  }, []);

  return (
    <VStack w="full" alignItems="center" marginTop="xl">
      {isPending ? (
        <VStack w="full" alignItems="center" marginTop="xl">
          <Loading.Circles color="cyan.500" fontSize="6xl" />
        </VStack>
      ) : (
        repositories.length > 0 && (
          <List.Root
            w={{ base: '7/12', md: 'full' }}
            gap="xl"
            paddingY="sm"
            overflowY="auto"
            maxHeight="60vh"
            alignItems="center"
          >
            {repositories.map((repository) => (
              <List.Item
                key={repository.id}
                w="11/12"
                cursor="pointer"
                tabIndex={0}
                aria-labelledby={repository.id.toString()}
                onClick={() => onNavigateDetail(repository)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onNavigateDetail(repository);
                  }
                }}
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(repository.id, el);
                  } else {
                    itemRefs.current.delete(repository.id);
                  }
                }}
              >
                <Card.Root
                  variant="subtle"
                  paddingY="md"
                  paddingX="xl"
                  borderRadius="2xl"
                >
                  <Card.Body
                    display="flex"
                    flexDirection="row"
                    gap={{ base: 'sxl', md: 'md' }}
                    alignItems="center"
                  >
                    <Avatar
                      size="lg"
                      name={repository.fullName}
                      src={repository.owner.avatarUrl}
                      alt={repository.fullName}
                      aria-hidden="true"
                    />
                    <Text
                      as="p"
                      fontSize={{ base: '2xl', md: 'md' }}
                      fontWeight="bold"
                    >
                      {repository.name}
                    </Text>
                  </Card.Body>
                </Card.Root>
                <VisuallyHidden>
                  <Text
                    as="p"
                    fontSize="sm"
                    id={repository.id.toString()}
                    aria-hidden="true"
                  >
                    {`${repository.name}の詳細ページへ遷移する`}
                  </Text>
                </VisuallyHidden>
              </List.Item>
            ))}
          </List.Root>
        )
      )}
    </VStack>
  );
};

export const RepositoryListPagination = ({
  totalCount,
  page,
  isPending,
  onPageChange,
}: RepositoryListPageNationProps) => {
  return (
    <VStack w="full" alignItems="center" marginTop="xl" overflowX="auto">
      {totalCount > 1 && !isPending && (
        <Pagination.Root
          total={totalCount}
          page={page}
          onChange={onPageChange}
          withEdges
        />
      )}
    </VStack>
  );
};
