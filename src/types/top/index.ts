export interface FetchRepositoriesQuery {
  q: string;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page: number;
}

export type Repository = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    avatar_url: string;
  };
};

export type RepositoryResponse = {
  items: Repository[];
  total_count: number;
  incomplete_results: boolean;
};
