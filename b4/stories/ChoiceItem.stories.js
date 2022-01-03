import React from 'react';
import { storiesOf } from '@storybook/react';
import { ChoiceItem } from '../src/components/shared/ChoiceItem/ChoiceItem';
import KeyboardShortcutHint from '../src/components/shared/KeyboardShortcutHint';

const stories = storiesOf('ChoiceItems', module);

const defaultProps = {
  onClick: () => {}
};

stories.add('default ChoiceItem', () => {
  return (
    <ChoiceItem {...defaultProps} >I bless the rains down in Africa</ChoiceItem>
  );
});

stories.add('correct ChoiceItem', () => {
  return (
    <ChoiceItem {...defaultProps} correctFeedback>I bless the rains down in Africa</ChoiceItem>
  );
});

stories.add('incorrect ChoiceItem', () => {
  return (
    <ChoiceItem {...defaultProps} mistakeFeedback>I bless the rains down in Africa</ChoiceItem>
  );
});

stories.add('disabled ChoiceItem', () => {
  return (
    <ChoiceItem {...defaultProps} disabled>I bless the rains down in Africa</ChoiceItem>
  );
});

stories.add('Choicebutton interaction', () => {
  const keyboardHintComponent = <KeyboardShortcutHint keyName="1" />;
  return (
    <ChoiceItem {...defaultProps} keyboardHintComponent={keyboardHintComponent}>
      I bless the rains down in Africa
    </ChoiceItem>
  );
});

stories.add('Choicebutton interaction long text', () => {
  const keyboardHintComponent = <KeyboardShortcutHint keyName="1" />;
  return (
    <ChoiceItem {...defaultProps} keyboardHintComponent={keyboardHintComponent}>
      It’s gonna take a lot to drag me away from you there’s nothing that a hundred men or more
      could ever do I bless the rains down in Africa
    </ChoiceItem>
  );
});
