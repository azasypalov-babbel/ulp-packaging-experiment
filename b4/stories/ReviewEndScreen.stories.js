import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ReviewEndScreen } from '../src/components/Review/ReviewEndScreen/ReviewEndScreen';
import withLoy from './decorators/withLoy';

const stories = storiesOf('ReviewEndScreen', module);
stories.addDecorator(withLoy);

const items = [
  { sound: { id: '100afffb3' }, learnLanguageText: 'die Straße' },
  { sound: { id: '101afffb3' }, learnLanguageText: 'die Adresse' },
  { sound: { id: '102afffb3' }, learnLanguageText: 'Mark, Jay, Noe und Peter, seid ihr aus Hamburg?' },
  { sound: { id: '103afffb3' }, learnLanguageText: 'Das ist Maren. Sie ist auch aus Berlin.' },
  { sound: { id: '104afffb3' }, learnLanguageText: 'die Telefonnummer' },
  { sound: { id: '105afffb3' }, learnLanguageText: 'eins' },
  { sound: { id: '106afffb3' }, learnLanguageText: 'zwei' },
  { sound: { id: '107afffb3' }, learnLanguageText: 'die Stadt' },
  { sound: { id: '108afffb3' }, learnLanguageText: 'Bist du Stefan aus Deutschland?' },
  { sound: { id: '109afffb3' }, learnLanguageText: 'Das ist Roberto Charles Makkoth Ramaglietta. Er ist aus Bonn.' }
];

const defaultProps = {
  onCorrectErrorsButtonClick: action('onCorrectErrorsButtonClick'),
  onCloseButtonClick: action('onCloseButtonClick'),
  playSound: action('playSound'),
  playEndScreenSound: action('playEndScreenSound'),
  grade: 'medium',
  totalItemsCount: 6,
  translations: {
    correctErrorsButton: 'Correct your errors',
    close: 'Close',
    reviewMoreButton: 'Review more',
    title: 'Keep it up, Julia!',
    subtitle: 'You reviewed 6 items.',
    moreInfoLink: 'How does the review feature work?',
    grade: 'medium',
    correct: 'Correct',
    incorrect: 'Incorrect'
  }
};

stories.add('with correct and incorrect items', () => {
  const displayName = 'Julia';
  const correctItems = items.slice(0, 5);
  const incorrectItems = items.slice(5);
  const purgeableItemsCount = 3;
  const onCorrectErrosButtonClick = () => {};
  const onReviewMoreButtonClick = () => {};
  const locale = 'en-us';
  const hasNextReviewItems = false;

  const props = {
    displayName,
    correctItems,
    incorrectItems,
    purgeableItemsCount,
    onCorrectErrosButtonClick,
    onReviewMoreButtonClick,
    locale,
    hasNextReviewItems
  };

  return <ReviewEndScreen {...defaultProps} {...props}/>;
})
  .add('with only correct items', () => {
    const displayName = 'Julia';
    const correctItems = items;
    const incorrectItems = [];
    const purgeableItemsCount = 0;
    const onCorrectErrosButtonClick = () => {};
    const onReviewMoreButtonClick = () => {};
    const locale = 'en-us';
    const hasNextReviewItems = false;

    const props = {
      displayName,
      correctItems,
      incorrectItems,
      purgeableItemsCount,
      onCorrectErrosButtonClick,
      onReviewMoreButtonClick,
      locale,
      hasNextReviewItems
    };

    return <ReviewEndScreen {...defaultProps} {...props}/>;
  })
  .add('with only incorrect items', () => {
    const displayName = 'Julia';
    const correctItems = [];
    const incorrectItems = items;
    const purgeableItemsCount = 3;
    const onCorrectErrosButtonClick = () => {};
    const onReviewMoreButtonClick = () => {};
    const locale = 'en-us';
    const hasNextReviewItems = false;

    const props = {
      displayName,
      correctItems,
      incorrectItems,
      purgeableItemsCount,
      onCorrectErrosButtonClick,
      onReviewMoreButtonClick,
      locale,
      hasNextReviewItems
    };

    return <ReviewEndScreen {...defaultProps} {...props}/>;
  });

stories.add('without purgeable items', () => {
  const displayName = 'Julia';
  const correctItems = items.slice(0, 7);
  const incorrectItems = items.slice(7);
  const purgeableItemsCount = 0;
  const onCorrectErrosButtonClick = () => {};
  const onReviewMoreButtonClick = () => {};
  const locale = 'en-us';
  const hasNextReviewItems = false;

  const props = {
    displayName,
    correctItems,
    incorrectItems,
    purgeableItemsCount,
    onCorrectErrosButtonClick,
    onReviewMoreButtonClick,
    locale,
    hasNextReviewItems
  };

  return <ReviewEndScreen {...defaultProps} {...props}/>;
});

stories.add('with html-like content', () => {
  const displayName = 'Davidovich';

  const correctItems = [
    { sound: { id: '100afffb3' }, learnLanguageText: '<i>die Adresse</i> is the address' },
    { sound: { id: '100afffb3' }, learnLanguageText: '<b>die Adresse</b> is the address' }
  ];
  const incorrectItems = [];

  const purgeableItemsCount = 0;
  const onCorrectErrosButtonClick = () => {};
  const onReviewMoreButtonClick = () => {};
  const locale = 'en-us';
  const hasNextReviewItems = true;

  const props = {
    displayName,
    correctItems,
    incorrectItems,
    purgeableItemsCount,
    onCorrectErrosButtonClick,
    onReviewMoreButtonClick,
    locale,
    hasNextReviewItems
  };

  return <ReviewEndScreen {...defaultProps} {...props}/>;
});
