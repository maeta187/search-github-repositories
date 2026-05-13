export interface FetchRepositoriesParams {
  q: string;
  page: string;
}

export type RepositoriesParams = Promise<FetchRepositoriesParams>;

export type RepositoryResponse = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    avatar_url: string;
  };
};

export type RepositoryListResponse = {
  items: RepositoryResponse[];
  total_count: number;
  incomplete_results: boolean;
};

export type Repository = {
  id: number;
  name: string;
  fullName: string;
  owner: {
    avatarUrl: string;
  };
};

export type RepositoryList = {
  items: Repository[];
  totalCount: number;
  incompleteResults: boolean;
};
