import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import MessageBlock from '../../src/components/Trainer/DialogTrainer/MessageBlock';

const stories = storiesOf('Dialog Trainer', module);
stories.addDecorator(withKnobs);

stories.add('Message Block', () => {
  const options = {
    left: 'left',
    right: 'right'
  };

  const speakerRoles = {
    M1: 'm1',
    M2: 'm2',
    F1: 'f1',
    F2: 'f2',
    N1: 'n1'
  };

  const defaultValue = options.left;
  const defaultRole = 'm2';

  const props = {
    hasAvatar: true,
    speakerRole: select('Speaker Role', speakerRoles, defaultRole),
    children: <span>Learning text</span>,
    secondaryText: 'translation',
    onclick: () => {},
    position: select('Position', options, defaultValue)
  };

  return (
    <MessageBlock {...props} />
  );
});
