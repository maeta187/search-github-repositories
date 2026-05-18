/**
 * 必須バリデーション
 * @param name バリデーション対象の値
 * @param label バリデーション対象のラベル
 * @returns バリデーション結果
 */
export function validateRequired(
  name: string,
  label: string,
): boolean | { message: string } {
  if (name.length === 0) {
    return {
      message: `${label}は必須です`,
    };
  }
  return true;
}

/**
 * 最大文字数バリデーション
 * @param name バリデーション対象の値
 * @param label バリデーション対象のラベル
 * @param maxLength 最大文字数
 * @returns バリデーション結果
 */
export function validateMaxLength(
  name: string,
  label: string,
  maxLength: number,
): boolean | { message: string } {
  if (name.length > maxLength) {
    return {
      message: `${label}は${maxLength}文字以内で入力してください`,
    };
  }
  return true;
}

/**
 * 特殊文字バリデーション
 * - 英字、数字、ハイフン、アンダースコア、ドットのみ使用できます
 * @param name バリデーション対象の値
 * @param label バリデーション対象のラベル
 * @returns バリデーション結果
 */
export function validateSpecialCharactersRepository(
  name: string,
  label: string,
): boolean | { message: string } {
  const isSpecialCharacters = /[^a-zA-Z0-9_.-]/.test(name);
  if (isSpecialCharacters) {
    return {
      message: `${label}には英字、数字、ハイフン、アンダースコア、ドットのみ使用できます`,
    };
  }
  return true;
}

/**
 * オーナー名の特殊文字バリデーション
 * - 英字、数字、ハイフンのみ使用できます
 * @param name バリデーション対象の値
 * @param label バリデーション対象のラベル
 * @returns バリデーション結果
 */
export function validateSpecialCharactersOwner(
  name: string,
  label: string,
): boolean | { message: string } {
  const isSpecialCharacters = /[^a-zA-Z0-9-]/.test(name);
  if (isSpecialCharacters) {
    return {
      message: `${label}には英字、数字、ハイフンのみ使用できます`,
    };
  }
  return true;
}

/**
 * ハイフンで始まっているまたはハイフンで終わるいるかのバリデーション
 * @param name バリデーション対象の値
 * @param label バリデーション対象のラベル
 * @returns バリデーション結果
 */
export function validateHyphenStartEnd(
  name: string,
  label: string,
): boolean | { message: string } {
  if (name.startsWith('-') || name.endsWith('-')) {
    return {
      message: `${label}はハイフンで始まるまたはハイフンで終わることはできません`,
    };
  }
  return true;
}

/**
 * ページが数字で入力されているかのバリデーション
 * @param page バリデーション対象の値
 * @returns バリデーション結果
 */
export function validatePage(page: string): boolean | { message: string } {
  const pageNumber = parseInt(page);
  if (isNaN(pageNumber)) {
    return {
      message: 'ページは数字で入力してください',
    };
  }
  return true;
}
