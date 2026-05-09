const BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export const GITHUB_API_ENDPOINT = 'https://api.github.com';

export const SEARCH_REPOSITORIES_ENDPOINT = `${GITHUB_API_ENDPOINT}/search/repositories`;

export const FIND_ONE_REPOSITORY_ENDPOINT = `${GITHUB_API_ENDPOINT}/repos`;

export const API_ROUTES = {
  REPOSITORY_DETAIL: `${BASE_URL}/api/detail`,
  SEARCH_REPOSITORIES: `${BASE_URL}/api/top`,
} as const;
