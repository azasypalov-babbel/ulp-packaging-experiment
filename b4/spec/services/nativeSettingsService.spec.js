import nativeSettingsService from '../../src/services/nativeSettingsService';


describe('NativeSettingsService bridge', () => {
  const name = 'settings';

  describe('the bridge', () => {
    it(`is called '${name}'`, () => {
      expect(nativeSettingsService.name).toEqual(name);
    });
  });

  describe('methods that fetch static data from native', () => {
    beforeEach(() => {
      jest.spyOn(document, 'querySelector');
      document.querySelector.mockReturnValue({ text: '{ "user_settings": { "feedback_sound_enabled": false } }' });
    });

    afterEach(() => {
      document.querySelector.mockRestore();
    });

    describe('#isFeedbackSoundEnabled', () => {
      it('returns the current setting for isFeedbackSoundEnabled', () => {
        expect(nativeSettingsService.isFeedbackSoundEnabled).toBeFalsy();
      });
    });
  });
});
