import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import * as trackerActions from '../../dux/tracker/actions';
import * as lessonActions from '../../dux/lesson/actions';
import * as statisticsActions from '../../dux/statistics/actions';
import * as profileActions from '../../dux/profile/actions';
import * as subscriptionsActions from '../../dux/subscriptions/actions';
import * as accountActions from '../../dux/account/actions';

import * as statisticsSelectors from '../../dux/statistics/selectors';
import * as profileSelectors from '../../dux/profile/selectors';

import { isAllowedReferAFriend } from '../../lib/smartSurfaces';
import rollbar from '../../services/rollbarService';

import ApplicationLayout from '../shared/ApplicationLayout';
import NavbarContainer from '../shared/Navbar/NavbarContainer';
import FeatureToggles from '../shared/FeatureToggles';
import LessonSequence from './LessonSequence';
import MessagesContainer from '../shared/Messages/MessagesContainer';
import { BottomLayout } from '../shared/BottomLayout';
import ApplicationErrorBoundary from '../ApplicationErrorBoundary';
import TrainerOverlay from '../shared/TrainerOverlay';
import { performancePageLoadedEvent } from '../../dux/tracker/events/performance';

const userHasNoCompletedLessons = async (dispatch) => {
  const { value: statistics } = await dispatch(statisticsActions.fetchTrainerItemsStatistics());
  return !statisticsSelectors.userHasCompletedLessons({ data: statistics });
};

const userIsB2b = async (dispatch) => {
  const { value: profile } = await dispatch(profileActions.fetchProfile());
  return profileSelectors.isB2bUser({ data: profile });
};

const mapStateToProps = (state) => ({
  state,
  locale: state.session.locale,
  learnLanguageAlpha3: state.session.learnLanguageAlpha3
});

export const fetchSmartSurfacesData = () => async (dispatch) => {
  try {
    if (await userHasNoCompletedLessons(dispatch) || await userIsB2b(dispatch)) return;

    return dispatch(subscriptionsActions.fetchSubscriptions());
  } catch (error) {
    rollbar.warning(`SmartSurfacesError@LessonApp: ${error.message}`, {
      message: error.message,
      stack: error.stack
    });
  }
};

const mapDispatchToProps = {
  initLesson: lessonActions.initLesson,
  fetchAccount: accountActions.fetchAccount,
  track: trackerActions.track,
  fetchSmartSurfacesData: fetchSmartSurfacesData
};

export class LessonApp extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initLesson();
  }
  async initLesson() {
    const {
      fetchAccount,
      initLesson,
      fetchSmartSurfacesData,
      track,
      locale,
      learnLanguageAlpha3
    } = this.props;

    const { contentReleaseId, lessonUuid, learningActivityId } = this.props;
    initLesson({ contentReleaseId, lessonUuid, learningActivityId });

    await fetchAccount();

    /* eslint-disable camelcase */
    track({
      event: 'product:view_shown',
      version: 1,
      payload: {
        view_name: 'lesson',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */

    track(performancePageLoadedEvent({ locale, learnLanguageAlpha3 }));

    // Although this feature is used at the end of the lesson, the relevant data is fetched here so as not
    // to delay the rendering of the LessonEndScreen
    if (isAllowedReferAFriend()) {
      fetchSmartSurfacesData();
    }
  }

  render() {
    return (
      <ApplicationLayout>
        <ApplicationErrorBoundary name="LessonApp">
          <NavbarContainer />
          <FeatureToggles />
          <MessagesContainer />
          <TrainerOverlay />
          <main>
            <LessonSequence />
          </main>
          <BottomLayout />
        </ApplicationErrorBoundary>
      </ApplicationLayout>
    );
  }
}

LessonApp.propTypes = {
  initLesson: PropTypes.func.isRequired,
  fetchAccount: PropTypes.func.isRequired,
  track: PropTypes.func.isRequired,
  fetchSmartSurfacesData: PropTypes.func.isRequired,
  lessonUuid: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  contentReleaseId: PropTypes.string,
  learningActivityId: PropTypes.string
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(LessonApp);
