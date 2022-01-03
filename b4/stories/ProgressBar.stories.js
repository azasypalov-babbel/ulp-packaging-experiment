import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import withLoy from './decorators/withLoy';
import ProgressBar from '../src/components/shared/Navbar/ProgressBar';

const stories = storiesOf('ProgressBar', module)
  .addDecorator(withKnobs)
  .addDecorator(withLoy);

const defaultProps = {
  trainerCount: 4,
  sequenceHeadIndex: 2,
  currentTrainerIndex: 2,
  sequenceHeadProgress: 0.33,
  onTrainerClick: () => {}
};

stories.add('default', () => {
  return <ProgressBar {...defaultProps} />;
});
