import { describe, expect, it } from 'vitest';
import { counted, matches, plural, toHex } from '../apps/storybook/stories/_lib';

describe('search', () => {
  it('matches terms across a hyphenated name', () => {
    // The query nobody can type as a substring: names are `alt-arrow-up`.
    expect(matches('arrow up', 'alt-arrow-up')).toBe(true);
    expect(matches('up arrow', 'alt-arrow-up')).toBe(true);
    expect(matches('arrow-up', 'alt-arrow-up')).toBe(true);
  });

  it('requires every term', () => {
    expect(matches('arrow up', 'arrow-down')).toBe(false);
    expect(matches('shield check', 'shield-minus')).toBe(false);
  });

  it('searches the other fields too', () => {
    expect(matches('messages', 'chat-round', 'Messages, Conversation')).toBe(true);
    expect(matches('btc', 'Bitcoin', 'bitcoin-btc', 'BTC')).toBe(true);
  });

  it('treats slashes in token paths as separators', () => {
    expect(matches('background primary', 'background/base/primary')).toBe(true);
    expect(matches('base/primary', 'background/base/primary')).toBe(true);
  });

  it('lets an empty query through', () => {
    expect(matches('', 'anything')).toBe(true);
    expect(matches('   ', 'anything')).toBe(true);
  });

  it('ignores empty fields', () => {
    expect(matches('bitcoin', 'Bitcoin', null, undefined)).toBe(true);
  });
});

describe('colour readout', () => {
  it('renders both rgb spellings as hex', () => {
    expect(toHex('rgb(59, 130, 246)')).toBe('#3b82f6');
    expect(toHex('rgb(59 130 246)')).toBe('#3b82f6');
  });

  it('keeps alpha, and drops it when opaque', () => {
    expect(toHex('rgba(59, 130, 246, 0.4)')).toBe('#3b82f666');
    expect(toHex('rgba(59, 130, 246, 1)')).toBe('#3b82f6');
  });

  it('passes anything it cannot read straight through', () => {
    expect(toHex('')).toBe('');
    expect(toHex('none')).toBe('none');
  });
});

describe('склонение числительных', () => {
  it('согласует форму с числом', () => {
    const forms: [string, string, string] = ['иконка', 'иконки', 'иконок'];
    expect(plural(1, forms)).toBe('иконка');
    expect(plural(1301, forms)).toBe('иконка');
    expect(plural(2, forms)).toBe('иконки');
    expect(plural(24, forms)).toBe('иконки');
    expect(plural(5, forms)).toBe('иконок');
    expect(plural(197, forms)).toBe('иконок');
    expect(plural(0, forms)).toBe('иконок');
  });

  it('не спотыкается на подростковых числах', () => {
    const forms: [string, string, string] = ['токен', 'токена', 'токенов'];
    expect(plural(11, forms)).toBe('токенов');
    expect(plural(12, forms)).toBe('токенов');
    expect(plural(14, forms)).toBe('токенов');
    expect(plural(111, forms)).toBe('токенов');
    expect(plural(112, forms)).toBe('токенов');
  });

  it('склеивает число с формой', () => {
    expect(counted(675, ['запись', 'записи', 'записей'])).toBe('675 записей');
    expect(counted(21, ['запись', 'записи', 'записей'])).toBe('21 запись');
  });
});
