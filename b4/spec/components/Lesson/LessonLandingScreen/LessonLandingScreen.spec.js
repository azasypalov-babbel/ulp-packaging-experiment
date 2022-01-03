import React from 'react';
import { shallow } from 'enzyme';
import { LessonLandingScreen } from '../../../../src/components/Lesson/LessonLandingScreen/LessonLandingScreen';
import { mountWithTheme } from '../../shared/themeMock';

describe('<LessonLandingScreen />', () => {
  const defaultProps = {
    locale: 'en',
    learnLanguageAlpha3: 'FRA',
    onConfirm: jest.fn(),
    course: {
      title: 'mock course title'
    },
    lesson: {
      title: 'mock lesson title',
      detailedDescriptionHtml: '<div>mock lesson description hmtl</div>',
      description: 'mock lesson description',
      image: {
        id: 'mocklessonimageid'
      }
    },
    translations: {
      button: 'Start lesson'
    },
    track: jest.fn()
  };

  describe('Rendering', () => {
    test('it renders correctly', () => {
      const component = shallow(
        <LessonLandingScreen {...defaultProps} />
      );

      expect(component).toMatchSnapshot();
    });
  });

  describe('Integration', () => {
    test('it calls `onConfirm` when `button` is clicked', () => {
      const component = mountWithTheme(
        <LessonLandingScreen {...defaultProps} />
      );

      component.find('button').simulate('click');

      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
