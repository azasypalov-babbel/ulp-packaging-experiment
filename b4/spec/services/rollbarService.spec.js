import { isWebview } from '../../src/lib/features';
import * as rollbarService from '../../src/services/rollbarService';

jest.mock('../../src/lib/features');
jest.mock('rollbar', () => ({
  init: jest.fn()
}));

describe('Rollbar Service', () => {
  describe('rollbar token', () => {
    describe('when not in webview', () => {
      beforeEach(() => {
        isWebview.mockImplementation(() => false);
      });

      it('reads the token from MyEnv', () => {
        expect(rollbarService.getDefaultConfig().accessToken).toEqual('FOOBARBAZ');
      });
    });

    describe('when in webview', () => {
      beforeEach(() => {
        isWebview.mockImplementation(() => true);
        process.env = {
          ROLLBAR_CLIENT_ACCESS_TOKEN: 'IOSTOKEN'
        };
      });

      it('reads the token from env', () => {
        expect(rollbarService.getDefaultConfig().accessToken).toEqual('IOSTOKEN');
      });
    });
  });
});
