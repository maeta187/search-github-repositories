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

export function validatePage(page: string): boolean | { message: string } {
  const pageNumber = parseInt(page);
  if (isNaN(pageNumber)) {
    return {
      message: 'ページは数字で入力してください',
    };
  }
  return true;
}
