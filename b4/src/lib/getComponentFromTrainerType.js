import FlashCardTrainerContainer from '../components/Trainer/FlashCardTrainer/FlashCardTrainerContainer';
import ListeningTrainerContainer from '../components/Trainer/ListeningTrainer/ListeningTrainerContainer';
import SpeakingTrainerContainer from '../components/Trainer/SpeakingTrainer/SpeakingTrainerContainer';

import VocabularyContainer from '../components/Trainer/VocabularyTrainer/VocabularyTrainerContainer';
import VocabularySpeakContainer from '../components/Trainer/VocabularyTrainer/VocabularySpeakContainer';

import LegacyTrainerContainer from '../components/Sequence/LegacyTrainerContainer';

import * as features from '../lib/features';

import * as Engines from '../services/speechRecognition/engines';
import CardTrainerContainer from '../components/Trainer/CardTrainer/CardTrainerContainer';
import KeyboardTrainerContainer from '../components/Trainer/KeyboardTrainer/KeyboardTrainerContainer';
import DialogTrainerContainer from '../components/Trainer/DialogTrainer/DialogTrainerContainer';
import MatchingTrainerContainer from '../components/Trainer/MatchingTrainer/MatchingTrainerContainer';
import ComprehensionTrainerContainer from '../components/Trainer/ComprehensionTrainer';

const getComponentFromTrainerType = ({ trainer, speechEngineName }) => {
  switch (trainer.type) {
    case 'flashcard': {
      return FlashCardTrainerContainer;
    }
    case 'listening': {
      return ListeningTrainerContainer;
    }
    case 'spokenreview': {
      if (speechEngineName === Engines.types.LEGACY_SPEECH) {
        return LegacyTrainerContainer;
      }
      return SpeakingTrainerContainer;
    }
    case 'vocabulary': {
      if (
        trainer.interaction === 'speak' &&
        (!speechEngineName || [Engines.types.NATIVE_SPEECH, Engines.types.WEB_SPEECH].includes(speechEngineName)) &&
        !features.get('is_b3_vocabulary_trainer')
      ) {
        return VocabularySpeakContainer;
      } else if (
        trainer.interaction === 'choose' ||
        trainer.interaction === 'write' ||
        trainer.interaction === 'wordorder'
      ) {
        return VocabularyContainer;
      } else {
        return LegacyTrainerContainer;
      }
    }
    case 'card': {
      return CardTrainerContainer;
    }
    case 'dictate': {
      return VocabularyContainer;
    }
    case 'keyboard': {
      return KeyboardTrainerContainer;
    }
    case 'dialog': {
      return DialogTrainerContainer;
    }
    case 'comprehension':
      if (!features.isWebview()) {
        return ComprehensionTrainerContainer;
      }
      return LegacyTrainerContainer;
    case 'matching': {
      if (!features.isWebview()) {
        return MatchingTrainerContainer;
      }
      return LegacyTrainerContainer;
    }
    default: {
      return LegacyTrainerContainer;
    }
  }
};

export default getComponentFromTrainerType;
