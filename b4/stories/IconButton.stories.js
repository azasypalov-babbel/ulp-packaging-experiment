import React from 'react';
import { storiesOf } from '@storybook/react';
import IconButton from '../src/components/shared/IconButton/IconButton';
import KeyboardShortcutHint from '../src/components/shared/KeyboardShortcutHint';
import { withKnobs } from '@storybook/addon-knobs';

const stories = storiesOf('Icon Buttons', module);
stories.addDecorator(withKnobs);

stories.add('Icon Button without text', () => {
  return <IconButton iconName={'LightBulbIcon'} />;
});

stories.add('Negative Cross Button', () => {
  return <IconButton negative iconName={'CrossIcon'}>No</IconButton>;
});

stories.add('Positive Check Button', () => {
  return <IconButton positive iconName={'CheckIcon'}>Yes</IconButton>;
});

stories.add('Default Keyboard Button', () => {
  return <IconButton iconName={'KeyboardIcon'} />;
});

stories.add('with keyboard shortcut hint', () => {
  const keyboardHintComponent = <KeyboardShortcutHint keyName="A" />;
  return <IconButton iconName={'KeyboardIcon'} keyboardHintComponent={keyboardHintComponent}>Yes</IconButton>;
});
