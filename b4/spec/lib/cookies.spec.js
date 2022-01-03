import cookies from '../../src/lib/cookies';

describe('cookies', function() {
  beforeEach(function() {
    jest.spyOn(document, 'cookie', 'get').mockReturnValue('');
  });

  describe('#getCookies', function() {
    test('returns cookies as an object', function() {
      jest.spyOn(document, 'cookie', 'get').mockReturnValue('key1=val1;key2=val2');

      expect(cookies.getCookies()).toEqual({
        key1: 'val1',
        key2: 'val2'
      });
    });
  });

  describe('#getCookie', function() {
    test('returns cookie value passed as param', function() {
      jest.spyOn(document, 'cookie', 'get').mockReturnValue('key1=val1;key2=val2');

      expect(cookies.getCookie('key1')).toEqual('val1');
    });
  });

  describe('#setCookie', function() {
    test('sets data to cookie with expiration date', function() {
      const cookieSetter = jest.spyOn(document, 'cookie', 'set').mockImplementation();
      const expiryDate = new Date('1961-04-12T06:07:00Z');

      cookies.setCookie('space', 'invader', expiryDate);

      expect(cookieSetter).toHaveBeenCalledWith('space=invader;expires=Wed, 12 Apr 1961 06:07:00 GMT;path=/');
    });
  });
});
