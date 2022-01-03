import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import pickRandom from '../../../lib/pickRandom';
import { RESULTS } from '../../../lib/matchingUtils/evaluate';

import { toggleTransliterationVisibility } from '../../../dux/session/actions';

import Delayed from '../../shared/Delayed';
import FeedbackSheet from '../../shared/FeedbackSheet/FeedbackSheet';
import withTranslations from '../../shared/withTranslations';

import { attemptType } from '../shared/scene/scenePropTypes';

const PuzzlehelperFeedback = (props) => {
  const {
    attempt,
    onProceed,
    onRetry,
    translations
  } = props;

  const { solved, feedbackType } = attempt;

  const getFeedbackMessage = (type) => {
    return {
      [RESULTS.CORRECT]: undefined,
      [RESULTS.INCORRECT]: translations.negativeFeedback,
      [RESULTS.TYPO]: translations.typoFeedback
    }[type];
  };

  if (feedbackType === RESULTS.CORRECT) {
    return <Delayed delay={1000} onFinish={onProceed} />;
  } else {
    return (
      <FeedbackSheet
        data-gap-feedback={true}
        data-solved={solved}
        data-mistaken={!solved}
        feedbackMessage={getFeedbackMessage(feedbackType)}
        onContinueClick={onProceed}
        onTryAgainClick={!solved ? onRetry : undefined}
      />
    );
  }
};

PuzzlehelperFeedback.propTypes = {
  attempt: attemptType,
  onProceed: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    negativeFeedback: PropTypes.string.isRequired,
    typoFeedback: PropTypes.string.isRequired
  }).isRequired,
  inputCommands: PropTypes.shape({
    insert: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    deleteAll: PropTypes.func.isRequired,
    return: PropTypes.func.isRequired
  }),
  onRetry: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  toggleTransliterationVisibility
};

const getTranslations = (translate, props, instanceId) => {
  const negativeFeedbackMessages = [
    'listening_trainer.feedback.negative.1',
    'listening_trainer.feedback.negative.2',
    'listening_trainer.feedback.negative.3',
    'listening_trainer.feedback.negative.4',
    'listening_trainer.feedback.negative.5'
  ].map(translate);

  return {
    negativeFeedback: pickRandom(negativeFeedbackMessages, instanceId),
    typoFeedback: translate('writing.feedback.typos')
  };
};

export default compose(
  connect(null, mapDispatchToProps),
  withTranslations(getTranslations)
)(PuzzlehelperFeedback);
