const BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export const FIND_ONE_REPOSITORY_ENDPOINT = 'https://api.github.com/repos';

export const API_ROUTES = {
  REPOSITORY_DETAIL: `${BASE_URL}/api/detail`,
} as const;
