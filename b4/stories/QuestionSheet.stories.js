import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { text, number, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { QuestionSheet } from '../src/components/Interactions/QuestionWithChoicebuttons/QuestionSheet';
import { ChoiceItem } from '../src/components/shared/ChoiceItem/ChoiceItem';

const stories = storiesOf('Sheets', module);

// hack, needs clarification
const StyledChoiceItem = styled(ChoiceItem)`
  max-width: 37.5rem;
`;

stories.add('QuestionSheet', () => {
  return (
    <QuestionSheet
      onOpenChange={action('toggled')}
      question={text(
        'question',
        'This is a Question about something important in the audio comprehension.'
      )}
      translations={{ questionText: 'Question' }}
      nrOfQuestions={number('nrOfQuestions', 3)}
      activeQuestion={number('activeQuestion', 2)}
      isHighlighted={boolean('isHighlighted', false)}
      interaction={<StyledChoiceItem onClick={action('choice selected')}>Select this</StyledChoiceItem>}
    />
  );
});
