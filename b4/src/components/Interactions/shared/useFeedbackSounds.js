import { useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { ServiceContext } from '@src/components/shared/withServices';
import incorrectFeedbackSound from '@assets/sounds/babbel_wrong.mp3';
import correctFeedbackSound from '@assets/sounds/babbel_correct.mp3';
import { useSoundPlayer } from '@src/components/Trainer/shared/useSoundPlayer';
import { checks } from '@src/services/soundService';

const useFeedbackSounds = ({ skipOnActiveSound = true, resetDependencies = [] } = {}) => {
  const { settingsService, soundService } = useContext(ServiceContext);
  const correctSoundInstance = useSoundPlayer(correctFeedbackSound);
  const incorrectSoundInstance = useSoundPlayer(incorrectFeedbackSound);
  const [, forceUpdate] = useReducer((s) => !s, true);
  const skippedFeedbackRef = useRef(false);

  useEffect(() => {
    skippedFeedbackRef.current = false;
    correctSoundInstance.reset();
    incorrectSoundInstance.reset();
  }, [correctSoundInstance, incorrectSoundInstance, ...resetDependencies]);

  const hasPlayed = checks.hasPlayed(correctSoundInstance.getState())
    || checks.hasPlayed(incorrectSoundInstance.getState());

  return [
    useCallback((solved) => {
      const isPlayingAnySound = soundService.getPlayingInstances().length > 0;
      if ((skipOnActiveSound && isPlayingAnySound) || !settingsService.isFeedbackSoundEnabled) {
        skippedFeedbackRef.current = true;
        forceUpdate();
        return;
      }
      const instance = solved ? correctSoundInstance : incorrectSoundInstance;
      instance.play();
    }, [skipOnActiveSound, soundService, settingsService, correctSoundInstance, incorrectSoundInstance]),
    hasPlayed || skippedFeedbackRef.current
  ];
};

export default useFeedbackSounds;
