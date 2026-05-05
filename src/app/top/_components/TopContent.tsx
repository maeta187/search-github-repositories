'use client';

import {
  Avatar,
  Card,
  extractObject,
  Field,
  Form,
  Input,
  List,
  Loading,
  Pagination,
  Text,
  VStack,
} from '@/components/ui';

import { fetchRepositories } from '@/features/top/actions';
import { Repository } from '@/types/top';
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
  onTransitionDetail: (repository: Repository) => void;
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

export const TopContent = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const form = useForm<Inputs>();
  const repositoryName = useWatch({
    control: form.control,
    name: 'repositoryName',
    defaultValue: '',
  });

  const search = async (name: string, pageNum: number) => {
    startTransition(async () => {
      try {
        const result = await fetchRepositories({ q: name, page: pageNum });
        setRepositories(result.items);
        setTotalCount(result.totalCount);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message, { cause: error.cause });
        } else {
          console.error(error);
        }
      }
    });
  };

  // TODO: 詳細画面作成時に実装
  const handleTransitionDetail = () => {};

  const handleSubmit: SubmitHandler<Inputs> = async (data) => {
    await search(data.repositoryName, page);
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
      <RepositorySearchResult
        isPending={isPending}
        repositories={repositories}
        onTransitionDetail={handleTransitionDetail}
      />
      <RepositoryListPagination
        totalCount={totalCount}
        page={page}
        isPending={isPending}
        onPageChange={handlePageChange}
      />
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
        flexDirection="row"
        gap="xl"
        justifyContent="center"
        alignItems={'baseline'}
      >
        <Form.Group w="4/12">
          <Field.Root name="repositoryName" label="">
            <Input
              placeholder="Repository Name"
              {...register('repositoryName', {
                required: { message: 'リポジトリ名は必須です', value: true },
              })}
            />
          </Field.Root>
        </Form.Group>
        <Form.SubmitButton w={'1/12'} disabled={isPending}>
          検索
        </Form.SubmitButton>
      </Form.Body>
    </Form.Root>
  );
};

export const RepositorySearchResult = ({
  isPending,
  repositories,
  onTransitionDetail,
}: RepositorySearchResultProps) => {
  return (
    <VStack w="full" alignItems="center" marginTop="xl">
      {isPending ? (
        <VStack w="full" alignItems="center" marginTop="xl">
          <Loading.Circles color="cyan.500" fontSize="6xl" />
        </VStack>
      ) : (
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
              onClick={() => onTransitionDetail(repository)}
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
            </List.Item>
          ))}
        </List.Root>
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
