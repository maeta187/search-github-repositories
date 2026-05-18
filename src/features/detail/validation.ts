import {
  validateHyphenStartEnd,
  validateMaxLength,
  validateRequired,
  validateSpecialCharactersOwner,
  validateSpecialCharactersRepository,
} from '@/utils/validation';

const OWNER_LABEL = 'オーナー名';
const OWNER_MAX_LENGTH = 39;
const REPO_LABEL = 'リポジトリ名';
const REPO_MAX_LENGTH = 100;

/**
 * オーナーのバリデーション
 * - 必須
 * - 最大文字数: 39文字
 * - 英字、数字、ハイフンのみ使用できます
 * - ハイフンで始まるまたはハイフンで終わることはできません
 */
export function validateRepositoryDetailOwnerParams(
  owner: string,
): boolean | { message: string } {
  const requiredResult = validateRequired(owner, OWNER_LABEL);
  if (requiredResult instanceof Object && 'message' in requiredResult) {
    return requiredResult;
  }
  const maxLengthResult = validateMaxLength(
    owner,
    OWNER_LABEL,
    OWNER_MAX_LENGTH,
  );

  if (maxLengthResult instanceof Object && 'message' in maxLengthResult) {
    return maxLengthResult;
  }

  const specialCharResult = validateSpecialCharactersOwner(owner, OWNER_LABEL);
  if (specialCharResult instanceof Object && 'message' in specialCharResult) {
    return specialCharResult;
  }

  const hyphenStartEndResult = validateHyphenStartEnd(owner, OWNER_LABEL);
  if (
    hyphenStartEndResult instanceof Object &&
    'message' in hyphenStartEndResult
  ) {
    return hyphenStartEndResult;
  }
  return true;
}

/**
 * リポジトリー名のバリデーション
 * - 必須
 * - 最大文字数: 100文字
 * - 英字、数字、ハイフン、アンダースコア、ドットのみ使用できます
 */
export function validateRepositoryDetailRepoParams(
  repo: string,
): boolean | { message: string } {
  const requiredResult = validateRequired(repo, REPO_LABEL);
  if (requiredResult instanceof Object && 'message' in requiredResult) {
    return requiredResult;
  }

  const maxLengthResult = validateMaxLength(repo, REPO_LABEL, REPO_MAX_LENGTH);
  if (maxLengthResult instanceof Object && 'message' in maxLengthResult) {
    return maxLengthResult;
  }

  const specialCharResult = validateSpecialCharactersRepository(
    repo,
    REPO_LABEL,
  );
  if (specialCharResult instanceof Object && 'message' in specialCharResult) {
    return specialCharResult;
  }

  return true;
}
