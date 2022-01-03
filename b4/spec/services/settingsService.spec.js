import settingsService from '../../src/services/settingsService';

describe('settingsService', () => {
  describe('isFeedbackSoundEnabled', () => {
    it('is enabled', () => {
      expect(settingsService.isFeedbackSoundEnabled).toBeTruthy();
    });
  });
});
