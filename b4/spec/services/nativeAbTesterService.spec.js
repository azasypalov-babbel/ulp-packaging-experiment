import nativeAbTesterService from '../../src/services/nativeAbTesterService';

describe('NativeAbTesterService bridge', () => {
  const name = 'abtester';

  describe('the bridge', () => {
    it(`is called '${name}'`, () => {
      expect(nativeAbTesterService.name).toEqual(name);
    });
  });

  describe('the interface with native', () => {
    describe('methods that trigger the execution of native iOS code', () => {
      it('does not support any', () => {
        expect(nativeAbTesterService.methods).toEqual([]);
      });
    });

    describe('messages from the native iOS application to the lesson-player', () => {
      it('does not support any', () => {
        expect(nativeAbTesterService.events).toEqual([]);
      });
    });
  });

  describe('other bridge methods', () => {
    it('has "getExperimentBucket()" that does nothing', () => {
      return expect(nativeAbTesterService.getExperimentBucket()).resolves.toEqual(undefined);
    });
  });
});
