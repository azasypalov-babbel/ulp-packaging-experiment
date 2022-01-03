import nativeAccountService from '../../src/services/nativeAccountService';

describe('NativeAccountService bridge', () => {
  const name = 'account';

  describe('the bridge', () => {
    it(`is called '${name}'`, () => {
      expect(nativeAccountService.name).toEqual(name);
    });
  });

  describe('methods that fetch static data from native', () => {
    beforeEach(() => {
      jest.spyOn(document, 'querySelector');
      document.querySelector.mockReturnValue({ text: '{ "account": { "email": "test@test.com" } }' });
    });

    afterEach(() => {
      document.querySelector.mockRestore();
    });

    describe('#fetchAccount', () => {
      it('returns account data', () => {
        const expectedAccount = {
          email: 'test@test.com'
        };

        return expect(nativeAccountService.fetchAccount()).resolves.toEqual(expectedAccount);
      });
    });
  });

  describe('the interface with native', () => {
    describe('methods that trigger the execution of native iOS code', () => {
      it('does not support any', () => {
        expect(nativeAccountService.methods).toEqual([]);
      });
    });

    describe('messages from the native iOS application to the lesson-player', () => {
      it('does not support any', () => {
        expect(nativeAccountService.events).toEqual([]);
      });
    });
  });
});
