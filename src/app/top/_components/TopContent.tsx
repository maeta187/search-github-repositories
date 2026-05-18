'use client';

import { ErrorText } from '@/app/top/_components/ErrorText';
import {
  Avatar,
  Card,
  ClientOnly,
  Field,
  Form,
  Input,
  List,
  Loading,
  Pagination,
  Skeleton,
  Text,
  VisuallyHidden,
  VStack,
} from '@/components/ui';
import { API_ROUTES } from '@/constant/endpoint';
import { NAV_LINKS } from '@/constant/nav-link';

import { Repository } from '@/types/top';
import { validateSpecialCharactersRepository } from '@/utils/validation';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
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

/**
 * トップコンテンツコンポーネント
 * 検索フォーム、検索結果、ページネーションを表示する
 * フォームの状態管理、検索処理、ページネーションの状態管理を行なっている
 */
export const TopContent = () => {
  const [repositories, setRepositories] = useState<Repository[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(INIT_TOTAL_COUNT);
  const [page, setPage] = useState(INIT_PAGE);
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();

  const form = useForm<Inputs>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
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
    <VStack w="full" flex="1" minH="0" overflow="hidden">
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
    </VStack>
  );
};

/** リポジトリー検索フォームコンポーネント　　*/
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
      required={{ repositoryName: true }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Form.Body
        display="flex"
        flexDirection="row"
        gap="xl"
        justifyContent="center"
        alignItems={{ base: 'baseline', sm: 'anchor-center' }}
      >
        <Form.Group w={{ base: '4/12', md: '5/12', sm: 'full' }}>
          <Field.Root
            name="repositoryName"
            label=""
            invalid={!!errors.repositoryName}
            errorMessage={errors.repositoryName?.message}
          >
            <ClientOnly fallback={<Skeleton />}>
              <Input
                placeholder="Repository Name"
                {...register('repositoryName', {
                  required: { message: 'リポジトリ名は必須です', value: true },
                  validate: {
                    specialCharacters: (value) => {
                      const isValid = validateSpecialCharactersRepository(
                        value,
                        'リポジトリ名',
                      );
                      if (isValid instanceof Object && 'message' in isValid) {
                        return isValid.message;
                      }
                      return isValid;
                    },
                  },
                  maxLength: {
                    message: 'リポジトリ名は256文字以内で入力してください',
                    value: 256,
                  },
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

/** 検索結果コンポーネント　*/
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
    <VStack w="full" flex="1" minH="0" alignItems="center">
      {isPending ? (
        <VStack w="full" alignItems="center" marginTop="xl">
          <Loading.Circles color="cyan.500" fontSize="6xl" />
        </VStack>
      ) : (
        repositories.length > 0 && (
          <List.Root
            w={{ base: '7/12', md: 'full' }}
            flex="1"
            minH="0"
            gap="xl"
            paddingY="sm"
            alignItems="center"
            overflowY="auto"
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
                  paddingY={{ base: 'md', sm: 'sm' }}
                  paddingX={{ base: 'xl', sm: 'md' }}
                  borderRadius="2xl"
                >
                  <Card.Body
                    display="flex"
                    flexDirection="row"
                    gap={{ base: 'xl', md: 'md' }}
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

/** ページングコンポーネント */
export const RepositoryListPagination = ({
  totalCount,
  page,
  isPending,
  onPageChange,
}: RepositoryListPageNationProps) => {
  return (
    <VStack w="full" alignItems="center" overflowX="auto">
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
