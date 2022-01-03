import { getTrackingNameForTrainerType } from '../getTrackingNameForTrainerType';
import * as sessionSelectors from '../../session/selectors';
import * as sequenceSelectors from '../../sequence/selectors';

export const trainerPropertiesPayload = (state) => {
  const trainer = sequenceSelectors.currentTrainer(state.sequence);
  /* eslint-disable camelcase */
  return {
    trainer_type: trainer.type === 'dictate' ? 'vocabulary' : trainer.type,
    trainer_shown: getTrackingNameForTrainerType(trainer, sessionSelectors.isMicEnabled(state.session)),
    translation_visibility: trainer.translation_visibility,
    interaction: trainer.interaction,
    puzzle_helper: trainer.puzzle_helper,
    dictate: trainer.dictate
  };
  /* eslint-enable camelcase */
};
