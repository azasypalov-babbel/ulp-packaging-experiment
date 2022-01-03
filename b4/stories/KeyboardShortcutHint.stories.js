import React from 'react';
import { storiesOf } from '@storybook/react';
import KeyboardShortcutHint from '../src/components/shared/KeyboardShortcutHint';

const stories = storiesOf('KeyboardShortcutHint', module);

stories.add('All Keys', () => {
  return (
    <React.Fragment>
      <KeyboardShortcutHint keyName="1" />
      <KeyboardShortcutHint keyName="2" />
      <KeyboardShortcutHint keyName="3" />
      <KeyboardShortcutHint keyName="4" />
      <KeyboardShortcutHint keyName="5" />
      <KeyboardShortcutHint keyName="6" />
      <KeyboardShortcutHint keyName="7" />
      <KeyboardShortcutHint keyName="8" />
      <KeyboardShortcutHint keyName="9" />
      <KeyboardShortcutHint keyName="Enter" />
      <KeyboardShortcutHint keyName="Space" />
    </React.Fragment>
  );
});
