import { describe, expect, it } from 'vitest';
import {
  validateHyphenStartEnd,
  validateMaxLength,
  validatePage,
  validateRequired,
  validateSpecialCharactersOwner,
  validateSpecialCharactersRepository,
} from './validation';

describe('utils/validation', () => {
  it('必須項目が入力されている場合trueを返す', () => {
    const result = validateRequired('react', 'label名');
    expect(result).toBeTruthy();
  });

  it('必須項目が未入力の場合400エラーを返す', () => {
    const result = validateRequired('', 'label名');
    expect(result).toEqual({ message: 'label名は必須です' });
  });

  it('最大文字数を超えていない場合trueを返す', () => {
    const result = validateMaxLength('a'.repeat(10), 'label名', 10);
    expect(result).toBeTruthy();
  });

  it('最大文字数を超えている場合400エラーを返す', () => {
    const result = validateMaxLength('a'.repeat(257), 'label名', 10);
    expect(result).toEqual({
      message: 'label名は10文字以内で入力してください',
    });
  });

  it('特殊文字が含まれていない場合trueを返す', () => {
    const result = validateSpecialCharactersRepository('react', 'label名');
    expect(result).toBeTruthy();
  });

  it('特殊文字が含まれている場合400エラーを返す', () => {
    const result = validateSpecialCharactersRepository('react@', 'label名');
    expect(result).toEqual({
      message:
        'label名には英字、数字、ハイフン、アンダースコア、ドットのみ使用できます',
    });
  });

  it('ハイフンを除く特殊文字が含まれていない場合trueを返す', () => {
    const result = validateSpecialCharactersOwner('react-facebook', 'label名');
    expect(result).toBeTruthy();
  });

  it('ハイフンを除く特殊文字が含まれている場合400エラーを返す', () => {
    const result = validateSpecialCharactersOwner('react@', 'label名');
    expect(result).toEqual({
      message: 'label名には英字、数字、ハイフンのみ使用できます',
    });
  });

  it('ハイフンで始まっていないまたはハイフンで終わっていない場合trueを返す', () => {
    const result = validateHyphenStartEnd('react-facebook', 'label名');
    expect(result).toBeTruthy();
  });

  it('ハイフンで始まるまたはハイフンで終わる場合400エラーを返す', () => {
    const result = validateHyphenStartEnd('react-', 'label名');
    expect(result).toEqual({
      message:
        'label名はハイフンで始まるまたはハイフンで終わることはできません',
    });
  });

  it('ページが数字で入力されている場合trueを返す', () => {
    const result = validatePage('1');
    expect(result).toBeTruthy();
  });

  it('ページが数字で入力されていない場合400エラーを返す', () => {
    const result = validatePage('a');
    expect(result).toEqual({
      message: 'ページは数字で入力してください',
    });
  });
});
