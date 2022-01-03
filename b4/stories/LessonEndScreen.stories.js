import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number, select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import LessonEndScreen from '../src/components/Lesson/LessonEndScreen/LessonEndScreen';
import withLoy from './decorators/withLoy';

const stories = storiesOf('LessonEndScreen', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withLoy);

const onCorrectErrorsButtonClick = () => {};
const onReturnHomeButtonClick = () => {};

const learningLanguageLabel = 'Learning Language';
const learningLanguageOptions = {
  FRA: 'FRA',
  POR: 'POR',
  SPA: 'SPA',
  DAN: 'DAN',
  NLD: 'NLD',
  ENG: 'ENG',
  IND: 'IND',
  ITA: 'ITA',
  NOR: 'NOR',
  DEU: 'DEU',
  POL: 'POL',
  RUS: 'RUS',
  SWE: 'SWE',
  TUR: 'TUR',
  QMS: 'QMS'
};
const grades = {
  high: 'high',
  low: 'low',
  medium: 'medium'
};
const learningLanguageDefault = 'FRA';

stories.add('with configurable props', () => {
  const grade = select('grade', grades, 'high');

  const displayName = text('Display Name', 'Christian');
  const correctItemsCount = number('Correct Items Count', 11);
  const incorrectItemsCount = number('Incorrect Items Count', 1);
  const purgeableItemsCount = number('Purgable Items Count', 1);
  const playEndScreenSound = action('playEndScreenSound');
  const translations = {
    accessLessonContentText: text('accessLessonContentText', 'Start lesson'),
    accessLessonContentButton: text('accessLessonContentButton', 'Access all Italian content'),
    correctErrorsButton: text('correctErrorsButton', 'Correct my mistakes (10)'),
    returnHomeButton: text('returnHomeButton', 'Continue learning'),
    correctAnswersText: text('correctAnswersText', 'Answered correctly:'),
    feedbackMessageText: text('feedbackMessageText', `Keep it up, ${displayName}!`)
  };

  const learnLanguageAlpha3 = select(learningLanguageLabel, learningLanguageOptions, learningLanguageDefault);
  const isUnlocked = boolean('Content Unlocked', true);
  const locale = 'en';

  const props = {
    showReferAFriend: false,
    displayName,
    correctItemsCount,
    incorrectItemsCount,
    purgeableItemsCount,
    playEndScreenSound,
    onCorrectErrorsButtonClick,
    onReturnHomeButtonClick,
    locale,
    learnLanguageAlpha3,
    isUnlocked,
    translations,
    grade
  };

  return <LessonEndScreen {...props} />;
});
