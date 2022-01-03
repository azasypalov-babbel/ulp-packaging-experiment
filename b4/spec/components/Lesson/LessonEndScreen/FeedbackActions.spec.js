import React from 'react';
import FeedbackActions from '../../../../src/components/Lesson/LessonEndScreen/FeedbackActions';
import { shallow } from 'enzyme';

describe('<FeedbackActions />', () => {
  describe('Content Unlocked', () => {
    const defaultProps = {
      isUnlocked: true,
      onCorrectErrorsButtonClick: jest.fn(),
      onReturnHomeButtonClick: jest.fn(),
      accessLessonContentText: '',
      accessLessonContentButton: '',
      correctErrorsButton: 'Correct my mistakes (4)',
      returnHomeButton: 'Continue learning'
    };

    test('it renders when there are purgable items', () => {
      const props = Object.assign({}, defaultProps, {
        purgeableItemsCount: 4
      });
      const component = shallow(
        <FeedbackActions {...props} />
      );

      expect(component).toMatchSnapshot();
    });

    test('it renders when there are no purgable items', () => {
      const props = Object.assign({}, defaultProps, {
        purgeableItemsCount: 0
      });
      const component = shallow(
        <FeedbackActions {...props} />
      );

      expect(component).toMatchSnapshot();
    });
  });

  describe('Content Locked', () => {
    const props = {
      isUnlocked: false,
      onAccessContentButtonClick: jest.fn(),
      accessLessonContentText: 'Keep it up! Get access to all lessons and topics.',
      accessLessonContentButton: 'Access all French content',
      correctErrorsButton: '',
      returnHomeButton: ''
    };

    test('it renders', () => {
      const component = shallow(
        <FeedbackActions {...props} />
      );

      expect(component).toMatchSnapshot();
    });
  });
});
