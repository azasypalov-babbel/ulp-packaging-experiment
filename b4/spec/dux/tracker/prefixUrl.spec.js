import { isWebview } from '../../../src/lib/features';
jest.mock('../../../src/lib/features');

import prefixTrackerUrl from '../../../src/dux/tracker/prefixUrl';


describe('#prefixUrl', () => {
  describe('is_webview == true', () => {
    beforeEach(() => {
      isWebview.mockImplementationOnce(() => {
        return true;
      });
    });

    it('prefixes http://', () => {
      expect(prefixTrackerUrl('http://babbel.com/v1/events'))
        .toEqual('babbel-local://app/tracker/babbel.com/v1/events');
    });

    it('prefixes https://', () => {
      expect(prefixTrackerUrl('https://babbel.com/v1/events'))
        .toEqual('babbel-local://app/tracker/babbel.com/v1/events');
    });

    it('prefixes //', () => {
      expect(prefixTrackerUrl('//babbel.com/v1/events'))
        .toEqual('babbel-local://app/tracker/babbel.com/v1/events');
    });
  });

  describe('is_webview == false', () => {
    beforeEach(() => {
      isWebview.mockImplementationOnce(() => {
        return false;
      });
    });

    it('does not prefix url', () => {
      expect(prefixTrackerUrl('http://babbel.com/v1/events')).toEqual('http://babbel.com/v1/events');
      expect(prefixTrackerUrl('https://babbel.com/v1/events')).toEqual('https://babbel.com/v1/events');
    });
  });
})
;
