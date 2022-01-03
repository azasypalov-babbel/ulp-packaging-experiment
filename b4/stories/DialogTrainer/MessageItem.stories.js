import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import MessageItem from '../../src/components/Trainer/DialogTrainer/MessageItem';


const stories = storiesOf('Dialog Trainer', module);
stories.addDecorator(withKnobs);

stories.add('Message Item', () => {
  const label = 'Position';
  const options = {
    left: 'left',
    right: 'right'
  };
  const defaultValue = 'left';

  const props = {
    children: <span>This is the learning language text that can be interactive</span>,
    secondaryText: text('translation', 'Use the input below to add your custom translation'),
    active: boolean('active', false),
    position: select(label, options, defaultValue)
  };

  return (
    <MessageItem {...props} />
  );
});
