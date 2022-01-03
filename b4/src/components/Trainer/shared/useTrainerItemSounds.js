import { useCallback, useContext, useState } from 'react';
import { ServiceContext } from '../../shared/withServices';
import { useSoundsPreload } from './useSoundsPreload';
import { PlayStates } from '../../../services/soundService';

const useTrainerItemSounds = (items = []) => {
  const {
    mediaUrlService,
    soundService
  } = useContext(ServiceContext);

  useSoundsPreload(items);

  const [playing, setPlaying] = useState(null);

  const play = useCallback((item) => {
    if (!item?.sound?.id) return Promise.reject(
      new Error('No item sound for this item')
    );

    setPlaying(item.id);

    const audioUrl = mediaUrlService.soundURL(item.sound.id);
    const instance = soundService.getInstance(audioUrl);
    return new Promise(
      (resolve, reject) => {
        if (soundService.isPlaying(instance)) reject();
        else {
          const unsub = instance.subscribe((event) => {
            const playState = instance.getState();
            if (!soundService.isPlaying(instance)) {
              unsub();
              if (playState === PlayStates.FAILED) reject(event.msg);
              else resolve(playState === PlayStates.COMPLETED);
            }
          });
          instance.play();
        }
      })
      .finally(() => {
        setPlaying((id) => id === item.id ? null : id);
      });
  }, [mediaUrlService, soundService]);

  const isPlaying = useCallback(
    (item) => item
      ? item.id === playing
      : playing
    , [playing]);

  return [play, isPlaying];
};


export default useTrainerItemSounds;
