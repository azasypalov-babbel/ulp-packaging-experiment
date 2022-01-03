import playFeedbackSound, { FEEDBACK_SOUND } from '../../src/lib/playFeedbackSound';
import soundService from '../../src/services/soundService';
import settingsService from '../../src/services/settingsService';

// `.mp3` files are mocked using Jest's `moduleNameMapper`.
// Since all imports point to a single module, it is only possible
// to mock them once (https://github.com/facebook/jest/issues/1303#issuecomment-239706949).
// Therefore we can not specifically mock the correct,
// incorrect and end sounds.
jest.mock('../../src/services/soundService');
jest.mock('../../src/services/settingsService');


describe('playFeedbackSound', () => {
  describe('#playFeedbackSound', () => {
    describe('when feedback sounds are disabled', () => {
      beforeEach(() => {
        settingsService.isFeedbackSoundEnabled = false;
      });

      it('calls onEnded', () => {
        const onEnded = jest.fn();
        playFeedbackSound(FEEDBACK_SOUND.CORRECT, { onEnded });

        expect(onEnded).toHaveBeenCalledTimes(1);
      });

      it('returns undefined', () => {
        expect(playFeedbackSound(FEEDBACK_SOUND.CORRECT)).toEqual(undefined);
      });

      it('does not call play from the sound service', () => {
        playFeedbackSound(FEEDBACK_SOUND.CORRECT);
        const instance = soundService.getInstance('babbel_correct.mp3');

        expect(instance.play).not.toHaveBeenCalled();
      });
    });

    describe('when feedback sounds are enabled', () => {
      const onEnded = jest.fn();

      beforeEach(() => {
        settingsService.isFeedbackSoundEnabled = true;
      });

      it('does not call onEnded', () => {
        playFeedbackSound(FEEDBACK_SOUND.CORRECT, { onEnded });

        expect(onEnded).not.toHaveBeenCalled();
      });

      it('calls sound service with onEnded', () => {
        playFeedbackSound(FEEDBACK_SOUND.CORRECT, { onEnded });
        const instance = soundService.getInstance('babbel_correct.mp3');

        expect(instance.play).toHaveBeenCalledTimes(1);

        instance.simulate('end');

        expect(onEnded).toHaveBeenCalled();
      });
    });
  });
});
