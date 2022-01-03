import React from 'react';
import { ReviewEndScreen } from '../../../../src/components/Review/ReviewEndScreen/ReviewEndScreen';
import { shallow } from 'enzyme';

import { isWebview } from '../../../../src/lib/features';
jest.mock('../../../../src/lib/features');

const items = [
  { learnLanguageText: 'a', sound: { id: '100afffb3' } },
  { learnLanguageText: 'b', sound: { id: '101afffb3' } },
  { learnLanguageText: 'c', sound: { id: '102afffb3' } }
];

const closeButtonStub = jest.fn();

const defaultProps = {
  displayName: 'Julia',
  correctItems: [],
  incorrectItems: [],
  purgeableItemsCount: 3,
  locale: 'en',
  onCorrectErrorsButtonClick: jest.fn(),
  onReviewMoreButtonClick: jest.fn(),
  onGetMoreInfoLinkClick: jest.fn(),
  onCloseButtonClick: closeButtonStub,
  playSound: jest.fn(),
  playEndScreenSound: jest.fn(),
  hasNextReviewItems: false,
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

describe('<ReviewEndScreen />', () => {
  describe('Cards', () => {
    describe('when having correct and incorrect items', () => {
      test('should show card for correct and card incorrect items', () => {
        const props = Object.assign({}, defaultProps, {
          correctItems: items,
          incorrectItems: items
        });
        const component = shallow(<ReviewEndScreen {...props} />);
        const cards = component.find('Card');

        expect(cards).toHaveLength(2);
        expect(cards.at(0).props().type).toEqual('incorrect');
        expect(cards.at(1).props().type).toEqual('correct');
      });
    });

    describe('when having only correct items', () => {
      test('should show card for correct items', () => {
        const props = Object.assign({}, defaultProps, {
          correctItems: items
        });
        const component = shallow(<ReviewEndScreen {...props} />);
        const cards = component.find('Card');

        expect(cards).toHaveLength(1);
        expect(cards.at(0).props().type).toEqual('correct');
      });
    });

    describe('when having only incorrect items', () => {
      test('should show card for incorrect items', () => {
        const props = Object.assign({}, defaultProps, {
          incorrectItems: items
        });
        const component = shallow(<ReviewEndScreen {...props} />);
        const cards = component.find('Card');

        expect(cards).toHaveLength(1);
        expect(cards.at(0).props().type).toEqual('incorrect');
      });
    });
  });

  describe('Actions', () => {
    test('should show action buttons', () => {
      const component = shallow(<ReviewEndScreen {...defaultProps} />);
      const actions = component.find('ReviewActions');

      expect(actions).toHaveLength(1);
    });
  });

  describe('More info link', () => {
    describe('when in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementation(() => true);
      });

      test('should not show link', () => {
        const component = shallow(<ReviewEndScreen {...defaultProps} />);
        const link = component.find('a');

        expect(link).toHaveLength(0);
      });
    });

    describe('when NOT in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementation(() => false);
      });

      test('should show link', () => {
        const component = shallow(<ReviewEndScreen {...defaultProps} />);
        const link = component.find('a');

        expect(link).toHaveLength(1);
      });
    });
  });
});
