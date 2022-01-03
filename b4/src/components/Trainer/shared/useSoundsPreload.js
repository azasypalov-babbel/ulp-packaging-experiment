import { useContext, useEffect } from 'react';
import { ServiceContext } from '../../shared/withServices';

export const useSoundsPreload = (items) => {
  const {
    mediaUrlService,
    soundService
  } = useContext(ServiceContext);
  useEffect(() => {
    items
      .filter((item) => item.sound)
      .forEach((item) => soundService.preload(mediaUrlService.soundURL(item.sound.id)));
  }, [mediaUrlService, soundService, items]);
};
