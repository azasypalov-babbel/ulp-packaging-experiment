import sanitizeReturnUrl from '../../src/lib/sanitizeReturnUrl';

describe('sanitizeReturnUrl', () => {
  describe('when it is babbel domain', () => {
    test('url does not change', () => {
      const url = sanitizeReturnUrl('https://my.babbel.com/meow');
      expect(url).toEqual('https://my.babbel.com/meow');
    });
  });

  describe('when it is localhost', () => {
    test('url does not change', () => {
      const url = sanitizeReturnUrl('https://localhost:3000/meow');
      expect(url).toEqual('https://localhost:3000/meow');
    });
  });

  describe('when it is something weird', () => {
    test('url equals null', () => {
      const url = sanitizeReturnUrl('https://cat-gifs.com/meow');
      expect(url).toEqual(null);
    });
  });
});
