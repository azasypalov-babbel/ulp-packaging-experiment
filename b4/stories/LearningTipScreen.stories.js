import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { LearningTipScreen } from '../src/components/Screen/LearningTipScreen/LearningTipScreen';
import withLoy from './decorators/withLoy';

const stories = storiesOf('LearningTipScreen', module);
stories.addDecorator(withLoy);

// Cliking button throws a warning in storybook console
// https://github.com/storybooks/storybook/issues/6471

const props = {
  onContinueButtonClick: action('onContinueButtonClick'),
  translations: {
    title: 'The Title',
    tip: 'The Tip',
    action: 'The Action'
  }
};

stories.add('LearningTipScreen', () => {
  return <LearningTipScreen {...props} />;
});
