import React from 'react';
import LessonEndScreen from '../../../../src/components/Lesson/LessonEndScreen/LessonEndScreen';
import { shallow } from 'enzyme';

import { isWebview } from '../../../../src/lib/features';
jest.mock('../../../../src/lib/features');
jest.mock('../../../../src/components/ReferAFriend/ReferAFriendModalContainer', () => 'ReferAFriendModalContainer');

const defaultProps = {
  displayName: 'Christian',
  correctItemsCount: 8,
  incorrectItemsCount: 4,
  purgeableItemsCount: 4,
  onCorrectErrorsButtonClick: jest.fn(),
  onReturnHomeButtonClick: jest.fn(),
  locale: 'en',
  learnLanguageAlpha3: 'FRA',
  playEndScreenSound: jest.fn(),
  onAccessContentButtonClick: jest.fn(),
  translations: {
    accessLessonContentText: 'accessLessonContentText',
    accessLessonContentButton: 'accessLessonContentButton',
    correctErrorsButton: 'correctErrorsButton',
    returnHomeButton: 'returnHomeButton',
    correctAnswersText: 'correctAnswersText',
    feedbackMessageText: 'feedbackMessageText'
  },
  grade: 'high',
  isUnlocked: true,
  showReferAFriend: false
};

describe('<LessonEndScreen />', () => {
  describe('Content Unlocked', () => {
    test('it renders', () => {
      const props = Object.assign({}, defaultProps, {
        isUnlocked: true
      });
      const component = shallow(
        <LessonEndScreen {...props} />
      );

      expect(component).toMatchSnapshot();
    });
  });

  describe('Content Locked', () => {
    test('it renders', () => {
      const props = Object.assign({}, defaultProps, {
        isUnlocked: false
      });
      const component = shallow(
        <LessonEndScreen {...props} />
      );

      expect(component).toMatchSnapshot();
    });
  });

  describe('when NOT in Webview', () => {
    beforeEach(() => {
      isWebview.mockImplementationOnce(() => false);
    });

    test('should enable user selection', () => {
      const component = shallow(<LessonEndScreen {...defaultProps} />);

      expect(component.find('.loy-lesson-end-screen__disable-selection')).toHaveLength(0);
    });
  });

  describe('when in Webview', () => {
    beforeEach(() => {
      isWebview.mockImplementationOnce(() => true);
    });

    test('should disable user selection', () => {
      const component = shallow(<LessonEndScreen {...defaultProps} />);

      expect(component.find('.loy-lesson-end-screen__disable-selection')).toHaveLength(1);
    });
  });

  describe('Refer a Friend', () => {
    describe('when conditions are met', () => {
      let props;

      beforeEach(() => {
        props = Object.assign({}, defaultProps, {
          showReferAFriend: true
        });
      });

      test('should show modal', () => {
        const component = shallow(<LessonEndScreen {...props} />);

        expect(component.find('ReferAFriendModalContainer')).toHaveLength(1);
      });
    });

    describe('when conditions are not met', () => {
      let props;

      beforeEach(() => {
        props = Object.assign({}, defaultProps, {
          showReferAFriend: false
        });
      });

      test('should not show modal', () => {
        const component = shallow(<LessonEndScreen {...props} />);

        expect(component.find('ReferAFriendModalContainer')).toHaveLength(0);
      });
    });
  });
});
