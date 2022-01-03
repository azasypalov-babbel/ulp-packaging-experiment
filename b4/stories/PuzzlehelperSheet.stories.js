import React from 'react';
import { storiesOf } from '@storybook/react';

import withStore from './decorators/withStore';
import { withKnobs } from '@storybook/addon-knobs';

import { action } from '@storybook/addon-actions';
import { PuzzlehelperSheet } from '../src/components/Interactions/Puzzlehelper/PuzzlehelperSheet';
import Text from '../src/components/shared/Text';

const stories = storiesOf('Sheets', module)
  .addDecorator(withKnobs)
  .addDecorator(withStore);

stories.add('PuzzlehelperSheet', () => {
  const translations = {
    done: 'Done'
  };

  const props = {
    translations,
    onDelete: action('delete-clicked'),
    onDone: action('done-clicked')
  };

  return (
    <PuzzlehelperSheet {...props}>
      <Text>Puzzlehelper goes here</Text>
    </PuzzlehelperSheet>
  );
});
