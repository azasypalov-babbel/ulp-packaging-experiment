import services from '../services';
import correctFeedbackSound from '@assets/sounds/babbel_correct.mp3';
import incorrectFeedbackSound from '@assets/sounds/babbel_wrong.mp3';
import endscreenFeedbackSound from '@assets/sounds/endscreen.mp3';


const { soundService, settingsService } = services;

soundService.preload(correctFeedbackSound);
soundService.preload(incorrectFeedbackSound);

export const FEEDBACK_SOUND = {
  CORRECT: 'CORRECT',
  INCORRECT: 'INCORRECT',
  END: 'END',
  forItemSolved: (solved) => {
    return solved
      ? FEEDBACK_SOUND.CORRECT
      : FEEDBACK_SOUND.INCORRECT;
  }
};

const feedbackSounds = {
  [FEEDBACK_SOUND.CORRECT]: correctFeedbackSound,
  [FEEDBACK_SOUND.INCORRECT]: incorrectFeedbackSound,
  [FEEDBACK_SOUND.END]: endscreenFeedbackSound
};

/**
 * If isFeedbackSoundEnabled, it will call the soundService.play method
 * If not, it will call onEnded (which is otherwise called by soundService.play)
 *
 * @param {str} feedbackSound} - Must be one of FEEDBACK_SOUND.CORRECT / INCORRECT / END.
 * @param {Object} options - Options
 * @param {function} options.onPlay - Callback when playback starts
 * @param {function} options.onEnded - Callback when playback finished
 */
const playFeedbackSound = (feedbackSound, options = {}) => {
  const {
    onEnded = () => {}
  } = options;

  if (settingsService.isFeedbackSoundEnabled) {
    const instance = soundService.getInstance(feedbackSounds[feedbackSound]);
    const unsub = instance.subscribe(() => {
      if (!soundService.isPlaying(instance)) {
        onEnded();
        unsub();
      }
    });

    instance.play();
  } else {
    onEnded();
  }
};

export default playFeedbackSound;
