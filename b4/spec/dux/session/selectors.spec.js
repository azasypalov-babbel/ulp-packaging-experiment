import {
  isChrome,
  isMicEnabled,
  isUnsupportedBrowser,
  isStaging
} from '../../../src/dux/session/selectors';

describe('selectors', () => {
  describe('unsupported browser detection', () => {
    describe('when browser is IE11', () => {
      describe('when using browserName and browserVersion', () => {
        const session = {
          client: {
            browserName: 'Internet Explorer',
            browserVersion: '11.0'
          }
        };

        it('returns true', () => {
          expect(isUnsupportedBrowser(session)).toBe(true);
        });
      });

      describe('when using userAgent', () => {
        const session = {
          client: {
            userAgent: 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv 11.0) like Gecko'
          }
        };

        it('returns true', () => {
          expect(isUnsupportedBrowser(session)).toBe(true);
        });
      });
    });

    describe('when browser is not IE11', () => {
      describe('when using browserName and browserVersion', () => {
        const session = {
          client: {
            browserName: 'Internet Explorer',
            browserVersion: '10.0'
          }
        };

        it('returns false', () => {
          expect(isUnsupportedBrowser(session)).toBe(false);
        });
      });

      describe('when using userAgent', () => {
        const session = {
          client: {
            userAgent: 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
          }
        };

        it('returns false', () => {
          expect(isUnsupportedBrowser(session)).toBe(false);
        });
      });
    });
  });

  describe('chrome detection', () => {
    describe('browserName is provided', () => {
      it('should be true for chrome', () => {
        expect(isChrome({
          client: {
            browserName: 'Chrome'
          }
        })).toBe(true);
      });
      it('should be false for Firefox', () => {
        expect(isChrome({
          client: {
            browserName: 'Firefox'
          }
        })).toBe(false);
      });
    });
    describe('browserName is not provided', () => {
      it('should be true for chrome userAgent', () => {
        expect(isChrome({
          client: {
            userAgent: 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
          }
        })).toBe(true);
      });
      it('should be false for Firefox userAgent', () => {
        expect(isChrome({
          client: {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:67.0) Gecko/20100101 Firefox/67.0'
          }
        })).toBe(false);
      });
    });
  });

  describe('mic enabled', () => {
    describe('mic is enabled', () => {
      const mockedState = {
        micSettings: {
          isMicEnabled: true
        }
      };

      it('should return true for isMicEnabled', () => {
        const expected = mockedState.micSettings.isMicEnabled;
        const received = isMicEnabled(mockedState);
        expect(received).toBe(expected);
      });
    });

    describe('mic is disabled', () => {
      const mockedState = {
        micSettings: {
          isMicEnabled: false
        }
      };

      it('should return false for isMicEnabled', () => {
        const expected = mockedState.micSettings.isMicEnabled;
        const received = isMicEnabled(mockedState);
        expect(received).toBe(expected);
      });
    });
  });

  describe('#isStaging', () => {
    describe('when it is a staging session', () => {
      const mockedState = {
        returnUrl: 'http://foo.babbel.cn'
      };

      it('should return true for isStaging', () => {
        const received = isStaging(mockedState);
        expect(received).toBeTruthy();
      });
    });

    describe('when it is a localhost session', () => {
      const mockedState = {
        returnUrl: 'http://localhost:4000/foo'
      };

      it('should return true for isStaging', () => {
        const received = isStaging(mockedState);
        expect(received).toBeTruthy();
      });
    });

    describe('when it is a production session', () => {
      const mockedState = {
        returnUrl: 'http://foo.babbel.com'
      };

      it('should return false for isStaging', () => {
        const received = isStaging(mockedState);
        expect(received).toBeFalsy();
      });
    });
  });
});
