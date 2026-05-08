import type { ComponentType, SVGProps } from 'react';

export type RepositoryDetailParams = Promise<{ owner: string; repo: string }>;

export type OwnerEntity = {
  avatar_url: string;
};

export type Owner = {
  avatarUrl: string;
};

export type RepositoryDetailEntity = {
  id: number;
  name: string;
  full_name: string;
  owner: OwnerEntity;
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
};
