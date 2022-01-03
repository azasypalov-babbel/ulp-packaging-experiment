import { useContext, useEffect, useReducer } from 'react';
import { ServiceContext } from '../../shared/withServices';
import { checks } from '../../../services/soundService';

export const useSoundPlayer = (audioUrl) => {
  const { soundService } = useContext(ServiceContext);
  const [_, forceUpdate] = useReducer((s) => !s, true);
  const instance = soundService.getInstance(audioUrl);

  useEffect(() => {
    if (instance === null) return;
    const unsub = instance.subscribe(forceUpdate);
    return () => {
      const state = instance.getState();
      if (!checks.isPlaying(state)) instance.reset();
      unsub();
    };
  }, [instance]);

  return instance;
};
