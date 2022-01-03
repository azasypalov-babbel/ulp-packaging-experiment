import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SpeakItem from '../../Trainer/DialogTrainer/SpeakItem';
import useTrainerItemSounds from '../../Trainer/shared/useTrainerItemSounds';
import FeedbackSheet from '../../shared/FeedbackSheet/FeedbackSheet';
import withTranslations from '../../shared/withTranslations';
import pickRandom from '../../../lib/pickRandom';

export const SpeakInteractionFeedback = ({
  latestAttempt,
  item,
  onRetry,
  onProceed,
  translations
}) => {
  let solved = latestAttempt.solved;

  const [playItemSound, isItemSoundPlaying] = useTrainerItemSounds([item]);

  // Automatically proceed on correct attempts
  useEffect(() => {
    if (solved) {
      let timer = setTimeout(() => onProceed(), 1500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [solved, onProceed]);

  const getSpeakItemState = () => {
    if (solved) return 'success';
    return isItemSoundPlaying(item)
      ? 'active'
      : 'error';
  };

  return (
    <FeedbackSheet
      feedbackDetail={<SpeakItem
        state={getSpeakItemState()}
        onClick={!solved ? () => playItemSound(item) : undefined}
        text={latestAttempt.text}
      />}
      feedbackMessage={solved ? translations.positiveFeedback : translations.negativeFeedback}
      onContinueClick={!solved ? onProceed : undefined}
      onTryAgainClick={!solved ? onRetry : undefined}
    />
  );
};

SpeakInteractionFeedback.propTypes = {
  latestAttempt: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  onRetry: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    positiveFeedback: PropTypes.string.isRequired,
    negativeFeedback: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate, props, instanceId) => {
  const positiveFeedbackMessages = [
    'speech_recognition.feedback.positive.1',
    'speech_recognition.feedback.positive.2',
    'speech_recognition.feedback.positive.3'
  ].map(translate);

  return {
    positiveFeedback: pickRandom(positiveFeedbackMessages, instanceId),
    negativeFeedback: translate('speech_recognition.feedback.negative.1')
  };
};

export default withTranslations(getTranslations)(SpeakInteractionFeedback);
