import * as contentSelectors from '../../../src/dux/content/selectors';
import { getUSCopy } from '../../../src/components/ReferAFriend/helper';

import { getMyEnv } from '@lessonnine/my.js';

jest.mock('../../../src/dux/content/selectors');

const mockSetLocalStorage = jest.fn();
jest.mock('../../../src/lib/localStorage', () => ({
  getLocalStorage: () => ({
    get: jest.fn(),
    set: mockSetLocalStorage
  })
}));

// The module runs getMyEnv on file load. Therefore, the jest cache for this module must be busted
// to test the results of changes to these values.
const loadContainer = () => {
  let container;
  jest.isolateModules(() => {
    container = require('../../../src/components/ReferAFriend/ReferAFriendModalContainer');
  });
  return container;
};

describe('ReferAFriendModalContainer', () => {
  const state = {
    content: {},
    session: {
      locale: 'fr',
      learnLanguageAlpha3: 'SPA'
    },
    lesson: {
      learningActivityId: 'abc123',
      lessonUuid: '123abc'
    }
  };
  const ownProps = {
    translations: {
      title: 'mock title',
      description: 'mock description',
      cta: 'mock CTA'
    }
  };
  const course = {
    id: '123456'
  };
  const trackAction = jest.fn();
  const homeBaseUrl = 'http://mockdomain.test';
  let finalProps;

  const getPropsForGivenState = (state) => {
    const { mapStateToProps, mergeProps } = loadContainer();
    const stateProps = mapStateToProps(state, ownProps);
    const dispatchProps = { track: trackAction };
    return mergeProps(stateProps, dispatchProps);
  };

  const getPropsWithGivenSessionLocale = (locale) => {
    const modifiedState = Object.assign({}, state, { session: { locale } });
    return getPropsForGivenState(modifiedState);
  };

  beforeEach(() => {
    contentSelectors.currentCourse.mockImplementation(() => course);
    getMyEnv.mockReturnValue({ homeBaseUrl, geoData: { countryCode3: 'DEU' } });
    finalProps = getPropsForGivenState(state);
  });

  describe('passes unmodified data to props', () => {
    test('content state', () => {
      expect(finalProps.content).toEqual(state.content);
    });

    test('session state', () => {
      expect(finalProps.session).toEqual(state.session);
    });

    test('lesson state', () => {
      expect(finalProps.lesson).toEqual(state.lesson);
    });

    describe('Title and description', () => {
      describe.each(['en', 'en_GB'])('when display language is %s', (locale) => {
        describe('and country is USA', () => {
          beforeEach(() => {
            getMyEnv.mockReturnValue({ homeBaseUrl, geoData: { countryCode3: 'USA' } });
            finalProps = getPropsWithGivenSessionLocale(locale);
          });

          test.each(['title', 'description'])('renders %s for US campaign', (copy) => {
            expect(finalProps[copy]).toEqual(getUSCopy(copy));
          });
        });

        describe('and country is not USA', () => {
          beforeEach(() => {
            getMyEnv.mockReturnValue({ homeBaseUrl, geoData: { countryCode3: 'CAN' } });
            finalProps = getPropsWithGivenSessionLocale(locale);
          });

          test.each(['title', 'description'])('renders translated %s', (copy) => {
            expect(finalProps[copy]).toEqual(ownProps.translations[copy]);
          });
        });
      });
    });

    test('cta translation', () => {
      expect(finalProps.cta).toEqual(ownProps.translations.cta);
    });
  });

  describe('function props', () => {
    const closePortal = jest.fn();

    test('onRender sets value in localStorage to indicate user has seen the modal', () => {
      finalProps.onRender();
      expect(mockSetLocalStorage).toHaveBeenCalledWith('LES.SeenRaF', true);
    });

    test('onCtaClick closes modal', () => {
      finalProps.onCtaClick(closePortal);
      expect(closePortal).toHaveBeenCalled();
    });

    describe('emits events', () => {
      const { lesson, session } = state;
      /* eslint-disable camelcase */
      const payload = {
        origin: 'lesson_end_screen',
        cta_method: 'popup',
        cta_target_action: 'RaF',
        lesson_uuid: lesson.learningActivityId,
        content_uuid: lesson.lessonUuid,
        course_uuid: course.id,
        locale: session.locale,
        learn_language_alpha3: session.learnLanguageAlpha3
      };
      /* eslint-enable camelcase */

      test('onRender calls track with shown event', () => {
        const shownEvent = {
          event: 'smart_surfaces:cta:shown',
          version: 1,
          payload
        };
        finalProps.onRender();

        expect(trackAction).toHaveBeenCalledWith(shownEvent);
      });

      test('onCtaClick calls track with clicked event', () => {
        const clickedEvent = {
          event: 'smart_surfaces:cta:clicked',
          version: 1,
          payload
        };
        finalProps.onCtaClick(closePortal);

        expect(trackAction).toHaveBeenCalledWith(clickedEvent);
      });
    });
  });

  describe('talkableUrl', () => {
    test('sets talkableUrl to my app path by default', () => {
      expect(finalProps.talkableUrl).toEqual('/refer-a-friend?traffic_source=lesson-end');
    });

    describe('when located in USA', () => {
      const homeUrl = `${homeBaseUrl}/invite?traffic_source=lesson-end`;

      beforeEach(() => {
        getMyEnv.mockReturnValue({ homeBaseUrl, geoData: { countryCode3: 'USA' } });
      });

      test('set to home app path when user has en locale', () => {
        finalProps = getPropsWithGivenSessionLocale('en');
        expect(finalProps.talkableUrl).toEqual(homeUrl);
      });

      test('set to home app path when user has en_GB locale', () => {
        finalProps = getPropsWithGivenSessionLocale('en_GB');
        expect(finalProps.talkableUrl).toEqual(homeUrl);
      });
    });
  });

  // https://rollbar.com/babbel/Lesson-Player/items/9844/
  describe('with undefined geoIp data', () => {
    beforeEach(() => {
      getMyEnv.mockReturnValue({ homeBaseUrl });
      finalProps = getPropsWithGivenSessionLocale('en');
    });

    test('generates props from state without error', () => {
      expect(finalProps.content).toEqual(state.content);
    });
  });
});
