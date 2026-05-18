import {
  validateMaxLength,
  validatePage,
  validateRequired,
  validateSpecialCharactersRepository,
} from '@/utils/validation';

const LABEL = 'リポジトリ名';
const MAX_LENGTH = 256;

export function validateRepositoryParams(
  q: string,
  page: string,
): boolean | { message: string } {
  const requiredResult = validateRequired(q, LABEL);
  if (requiredResult instanceof Object && 'message' in requiredResult) {
    return requiredResult;
  }

  const maxLengthResult = validateMaxLength(q, LABEL, MAX_LENGTH);
  if (maxLengthResult instanceof Object && 'message' in maxLengthResult) {
    return maxLengthResult;
  }

  const specialCharResult = validateSpecialCharactersRepository(q, LABEL);
  if (specialCharResult instanceof Object && 'message' in specialCharResult) {
    return specialCharResult;
  }

  const pageResult = validatePage(page);
  if (pageResult instanceof Object && 'message' in pageResult) {
    return pageResult;
  }
  return true;
}
