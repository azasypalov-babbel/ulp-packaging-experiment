import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import mockStore from '../../../dux/mockStore';
import * as contentSelectors from '../../../../src/dux/content/selectors';
// eslint-disable-next-line max-len
import LessonLandingScreenContainer from '../../../../src/components/Lesson/LessonLandingScreen/LessonLandingScreenContainer';
import LessonLandingScreen from '../../../../src/components/Lesson/LessonLandingScreen/LessonLandingScreen';

jest.mock('../../../../src/dux/content/selectors');
// eslint-disable-next-line max-len
jest.mock('../../../../src/components/Lesson/LessonLandingScreen/LessonLandingScreen', () => () => 'LessonLandingScreen');

const store = mockStore(() => ({
  content: {},
  lesson: {},
  session: {
    locale: 'en',
    learnLanguageAlpha3: 'FRA'
  }
}));

const mockLesson = {
  title: 'mockLessonTitle'
};

const mockCourse = {
  title: 'mockCourseTitle'
};

describe('LessonLandingScreenContainer', () => {
  let component;

  describe('adds correct props', () => {
    beforeEach(() => {
      contentSelectors.currentLesson.mockImplementation(() => mockLesson);
      contentSelectors.currentCourse.mockImplementation(() => mockCourse);

      component = mount(
        <Provider store={store}>
          <LessonLandingScreenContainer />
        </Provider>
      );
    });

    test('maps the props', () => {
      const { course, lesson } = component.find(LessonLandingScreen).props();

      expect(course).toEqual(mockCourse);
      expect(lesson).toEqual(mockLesson);
    });
  });
});
