import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../src/components/shared/Button/Button';

const stories = storiesOf('Buttons', module);

stories.add('Default Button', () => {
  return <Button>Click!</Button>;
});

stories.add('Default Button Small', () => {
  return <Button small>Click!</Button>;
});

stories.add('Primary Button', () => {
  return <Button primary>Click!</Button>;
});

stories.add('Primary Button Small', () => {
  return <Button primary small>Click!</Button>;
});

stories.add('Disabled Button', () => {
  return <Button disabled>Click!</Button>;
});

stories.add('Disabled Button Small', () => {
  return <Button disabled small>Click!</Button>;
});

stories.add('Positive Button', () => {
  return <Button positive>Click!</Button>;
});

stories.add('Positive Button Small', () => {
  return <Button positive small>Click!</Button>;
});

stories.add('Negative Button', () => {
  return <Button negative>Click!</Button>;
});

stories.add('Negative Button Small', () => {
  return <Button negative small>Click!</Button>;
});

stories.add('Positive Solid Button', () => {
  return <Button positiveSolid>Click!</Button>;
});

stories.add('Negative Solid Button', () => {
  return <Button negativeSolid>Click!</Button>;
});
