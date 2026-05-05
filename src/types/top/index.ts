export interface FetchRepositoriesDto {
  q: string;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
  perPage?: number;
  page: number;
}

export type RepositoryEntity = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    avatar_url: string;
  };
};

export type RepositoryResponseEntity = {
  items: RepositoryEntity[];
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

export type RepositoryResponse = {
  items: Repository[];
  totalCount: number;
  incompleteResults: boolean;
};
