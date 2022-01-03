import {
  mergeProps,
  mapStateToProps
} from '../../../../src/components/Lesson/LessonEndScreen/LessonEndScreenContainer';

jest.mock('../../../../src/dux/sequence/selectors', () => ({
  purgeableItems: () => [{}, {}, {}, {}],
  correctItems: () => [{}, {}, {}, {}, {}, {}, {}, {}],
  incorrectItems: () => [{}, {}, {}, {}]
}));

jest.mock('../../../../src/dux/content/selectors', () => ({
  isUnlocked: () => true
}));

jest.mock('../../../../src/dux/statistics/selectors');
import { userHasCompletedLessons } from '../../../../src/dux/statistics/selectors';

jest.mock('../../../../src/dux/profile/selectors');
import { isB2bUser } from '../../../../src/dux/profile/selectors';

jest.mock('../../../../src/dux/subscriptions/selectors');
import { subscriptionDate } from '../../../../src/dux/subscriptions/selectors';

jest.mock('@lessonnine/react-ui-components.js/lib/Modal', () => ({ Modal: jest.fn().mockReturnValue({}) }));

jest.mock('../../../../src/services/rollbarService');
import rollbar from '../../../../src/services/rollbarService';

import { isAllowedReferAFriend } from '../../../../src/lib/smartSurfaces';
jest.mock('../../../../src/lib/smartSurfaces');


describe('LessonEndScreenContainer', () => {
  describe('mergeProps', () => {
    const stateProps = {
      purgeableItems: 1,
      correctItemsCount: 2,
      incorrectItemsCount: 3,
      locale: 'en',
      learnLanguageAlpha3: 'FRA'
    };
    const dispatchProps = {
      navigateToPriceUrl: jest.fn()
    };
    const ownProps = {
      soundService: {
        play: jest.fn()
      },
      onCorrectErrorsButtonClick: jest.fn(),
      onReturnHomeButtonClick: jest.fn()
    };

    test('combines stateProps, dispatchProps and ownProps', () => {
      expect(mergeProps(stateProps, dispatchProps, ownProps)).toMatchSnapshot();
    });

    describe('when ownProps does not contain onCorrectErrorsButtonClick', () => {
      test('uses onCorrectErrorsButtonClick from dispatchProps', () => {
        const onCorrectErrorsButtonClick = jest.fn();

        expect(mergeProps(stateProps, {
          ...dispatchProps,
          onCorrectErrorsButtonClick
        }, {
          ...ownProps,
          onCorrectErrorsButtonClick: null
        }).onCorrectErrorsButtonClick).toEqual(onCorrectErrorsButtonClick);
      });
    });
  });

  describe('mapStateToProps', () => {
    let state;

    beforeEach(() => {
      state = {
        account: {
          data: {
            displayname: 'Christian',
            createdAt: '2020-10-08T09:59:37Z'
          }
        },
        content: {
          data: {
            unlocked: true
          }
        },
        sequence: null,
        session: {
          locale: 'en',
          learnLanguageAlpha3: 'FRA'
        }
      };
      isAllowedReferAFriend.mockReturnValue(true);
      isB2bUser.mockReturnValue(false);
      subscriptionDate.mockReturnValue('2018-11-25');
      userHasCompletedLessons.mockReturnValue(true);
    });

    test('maps the props', () => {
      expect(mapStateToProps(state)).toMatchSnapshot();
    });

    describe('#showReferAFriend', () => {
      test('is true when existing conditions met', () => {
        expect(mapStateToProps(state).showReferAFriend).toBe(true);
      });

      test('is false if feature is not allowed due to non-API conditions', () => {
        isAllowedReferAFriend.mockReturnValue(false);
        expect(mapStateToProps(state).showReferAFriend).toBe(false);
      });

      test('is false if user has not completed any lessons', () => {
        userHasCompletedLessons.mockReturnValue(false);
        expect(mapStateToProps(state).showReferAFriend).toBe(false);
      });

      test('is false if user is not a subscriber', () => {
        subscriptionDate.mockReturnValue(null);
        expect(mapStateToProps(state).showReferAFriend).toBe(false);
      });

      describe('when the user has subscribed after the feature launch date', () => {
        beforeEach(() => {
          subscriptionDate.mockReturnValue('2020-10-30');
        });

        test('is true in 40% of cases', () => {
          jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
          expect(mapStateToProps(state).showReferAFriend).toEqual(true);
        });

        test('is false in the remainder of cases', () => {
          jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
          expect(mapStateToProps(state).showReferAFriend).toBe(false);
        });
      });

      test('should notify rollbar with a warning and not interrupt UX in event of an error', () => {
        isAllowedReferAFriend.mockImplementation(() => { throw new SyntaxError(); });
        mapStateToProps(state);
        expect(rollbar.warning).toHaveBeenCalled();
      });

      describe('for b2b users', () => {
        beforeEach(() => {
          isB2bUser.mockReturnValue(true);
        });

        test('is true if user is a b2b subscriber with account created before feature launch', () => {
          expect(mapStateToProps(state).showReferAFriend).toBe(true);
        });

        describe('when the account was created after the feature launch date', () => {
          beforeEach(() => {
            state.account.data.createdAt = '2020-10-30';
          });

          test('is true in 40% of cases', () => {
            jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
            expect(mapStateToProps(state).showReferAFriend).toBe(true);
          });

          test('is false in remainder of cases', () => {
            jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
            expect(mapStateToProps(state).showReferAFriend).toBe(false);
          });
        });
      });
    });
  });
});
