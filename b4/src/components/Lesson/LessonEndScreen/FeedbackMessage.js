import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';
import { getModifier, getMessage } from './helper';

const FeedbackMessage = ({
  displayName,
  learnLanguageAlpha3,
  grade,
  feedbackMessageText
}) => {
  const prefix = 'lesson-end-screen-feedback-message';
  const scoreModifier = getModifier(prefix, grade);
  const message = getMessage({ displayName, feedbackMessageText });

  const classNames = {
    base: cx(prefix, scoreModifier),
    icon: cx(`${prefix}__icon`),
    text: cx(`${prefix}__text`)
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const imageUrl = require(`@assets/images/feedbackMessage/${learnLanguageAlpha3}/${grade}.svg`);
  return (
    <div className={classNames.base}>
      <img src={imageUrl} className={classNames.icon}/>
      <h1 className={classNames.text} data-feedback-grade={grade}>{message}</h1>
    </div>
  );
};

FeedbackMessage.propTypes = {
  displayName: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  grade: PropTypes.string.isRequired,
  feedbackMessageText: PropTypes.string.isRequired
};

export default FeedbackMessage;
