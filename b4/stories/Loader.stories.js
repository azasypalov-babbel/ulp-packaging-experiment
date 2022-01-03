import React from 'react';
import { storiesOf } from '@storybook/react';
import Loader from '../src/components/shared/Loader';

const stories = storiesOf('Loader', module);

stories.add('Loader', () => {
  return <Loader />;
});
