import React from 'react';
import { storiesOf } from '@storybook/react';
import { FeedbackSheet } from '../src/components/shared/FeedbackSheet/FeedbackSheet';

import { withMockServicesProvider } from './decorators/withServices';
import withStore from './decorators/withStore';
import { withKnobs, text, select  } from '@storybook/addon-knobs';
import SpeakItem from '../src/components/Trainer/DialogTrainer/SpeakItem';

import HighlightedText from '../src/components/shared/FeedbackSheet/HighlightedText';

const stories = storiesOf('FeedbackSheet', module)
  .addDecorator(withKnobs)
  .addDecorator(withMockServicesProvider)
  .addDecorator(withStore);

stories.add('Feedback Sheet with Feedback Message', () => {
  const translations = {
    continue: 'Continue',
    tryAgain: 'Try Again'
  };
  const feedbackMessage = text('Primary Text', 'Feedback Message');
  const callbackOptions = {
    yes: () => {},
    no: null
  };
  const onTryAgainClickOption = select('Try Again Button', callbackOptions, 'yes');
  const callback = () => {};
  const props = {
    translations,
    feedbackMessage,
    onContinueClick: callback,
    onTryAgainClick: onTryAgainClickOption && callback
  };

  return (
    <FeedbackSheet {...props} />
  );
});

stories.add('Feedback Sheet Highlighted Negative Text', () => {
  const translations = {
    continue: 'Continue',
    tryAgain: 'Try Again'
  };
  const feedbackMessage = text('Primary Text', 'Feedback Message');
  const feedbackDetail =
    <HighlightedText appearance="NEGATIVE">
      This highlighted text is used to render the transcript
    </HighlightedText>;
  const callbackOptions = {
    yes: () => {},
    no: null
  };
  const onTryAgainClickOption = select('Try Again Button', callbackOptions, 'yes');
  const callback = () => {};
  const props = {
    translations,
    feedbackMessage,
    feedbackDetail,
    onContinueClick: callback,
    onTryAgainClick: onTryAgainClickOption && callback
  };

  return (
    <FeedbackSheet {...props} />
  );
});

stories.add('Feedback Sheet Highlighted Positive Text', () => {
  const translations = {
    continue: 'Continue',
    tryAgain: 'Try Again'
  };
  const feedbackMessage = text('Primary Text', 'Feedback Message');
  const feedbackDetail =
    <HighlightedText appearance="POSITIVE">
      This highlighted text is used to render the item again in Listening Trainer
    </HighlightedText>;
  const callbackOptions = {
    yes: () => {},
    no: null
  };
  const onTryAgainClickOption = select('Try Again Button', callbackOptions, 'yes');
  const callback = () => {};
  const props = {
    translations,
    feedbackMessage,
    feedbackDetail,
    onContinueClick: callback,
    onTryAgainClick: onTryAgainClickOption && callback
  };

  return (
    <FeedbackSheet {...props} />
  );
});

stories.add('Feedback Sheet Speak Item', () => {
  const translations = {
    continue: 'Continue',
    tryAgain: 'Try Again'
  };
  const feedbackMessage = text('Primary Text', 'Feedback Message');
  const feedbackDetail = <SpeakItem text="Hola" />;
  const callbackOptions = {
    yes: () => {},
    no: null
  };
  const onTryAgainClickOption = select('Try Again Button', callbackOptions, 'yes');
  const callback = () => {};
  const props = {
    translations,
    feedbackMessage,
    feedbackDetail,
    onContinueClick: callback,
    onTryAgainClick: onTryAgainClickOption && callback
  };

  return (
    <FeedbackSheet {...props} />
  );
});
