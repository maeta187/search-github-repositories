import type { ComponentType, SVGProps } from 'react';

export interface FetchRepositoryDetailParams {
  owner: string;
  repo: string;
}

export type RepositoryDetailParams = Promise<FetchRepositoryDetailParams>;

export type OwnerResponse = {
  avatar_url: string;
};

export type RepositoryDetailResponse = {
  id: number;
  name: string;
  full_name: string;
  owner: OwnerResponse;
  language: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
};

export type RepositoryDetail = {
  id: number;
  name: string;
  fullName: string;
  avatarUrl: string;
  language: string;
  stargazersCount: number;
  watchersCount: number;
  forksCount: number;
  openIssuesCount: number;
};

export type RepositoryDetailItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  value: number;
  ariaLabel: string;
};
