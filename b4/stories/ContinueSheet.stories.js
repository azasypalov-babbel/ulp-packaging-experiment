import React from 'react';
import { storiesOf } from '@storybook/react';

import withStore from './decorators/withStore';
import { withKnobs } from '@storybook/addon-knobs';

import { ContinueSheet } from '../src/components/ContinueSheet';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Sheets', module)
  .addDecorator(withKnobs)
  .addDecorator(withStore);

stories.add('ContinueSheet', () => {
  const translations = {
    buttonText: 'Continue'
  };

  const props = {
    translations,
    onClick: action('continue-clicked')
  };

  return (
    <ContinueSheet {...props} />
  );
});
