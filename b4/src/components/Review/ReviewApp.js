import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as reviewActions from '../../dux/review/actions';
import * as statisticsActions from '../../dux/statistics/actions';
import NavbarContainer from '../shared/Navbar/NavbarContainer';
import ApplicationLayout from '../shared/ApplicationLayout';
import ReviewMenuScreenContainer from './ReviewMenuScreen/ReviewMenuScreenContainer';
import ReviewEndScreenContainer from './ReviewEndScreen/ReviewEndScreenContainer';
import TrainersSequence from '../Sequence/TrainersSequence';
import FeatureToggles from '../shared/FeatureToggles';
import Loader from '../shared/Loader';
import CenterContent from '../shared/CenterContent';
import * as accountActions from '../../dux/account/actions';
import * as trackerActions from '../../dux/tracker/actions';
import * as permissionsActions from '../../dux/permissions/actions';
import MessagesContainer from '../shared/Messages/MessagesContainer';
import { withServices } from '../shared/withServices';
import withFontsLoaded from '../shared/withFontsLoaded';
import { BottomLayout } from '../shared/BottomLayout';

import ApplicationErrorBoundary from '../ApplicationErrorBoundary';

import { performancePageLoadedEvent } from '../../dux/tracker/events/performance';
import TrainerOverlay from '../shared/TrainerOverlay';

const mapStateToProps = (state) => ({
  state: state,
  isLoading: Boolean(state.review.loading || state.statistics.loading),
  started: state.sequence.started,
  completed: state.sequence.completed,
  selectedInteraction: state.review.selectedInteraction,
  locale: state.session.locale,
  learnLanguageAlpha3: state.session.learnLanguageAlpha3
});

export const mapDispatchToProps = {
  fetchAccount: accountActions.fetchAccount,
  fetchTrainerItemsStatistics: statisticsActions.fetchTrainerItemsStatistics,
  fetchInteractionTypes: reviewActions.fetchInteractionTypes,
  track: trackerActions.track,
  initMicPermissions: permissionsActions.initMicPermissions
};

export class ReviewApp extends React.Component {
  componentDidMount() {
    this.initReview();
  }

  async initReview() {
    const {
      fetchAccount,
      fetchInteractionTypes,
      fetchTrainerItemsStatistics,
      initMicPermissions,
      track,
      locale,
      learnLanguageAlpha3
    } = this.props;

    await fetchAccount();

    /* eslint-disable camelcase */
    track({
      event: 'product:view_shown',
      version: 1,
      payload: {
        view_name: 'review',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */

    track(performancePageLoadedEvent({ locale, learnLanguageAlpha3 }));

    fetchInteractionTypes();
    fetchTrainerItemsStatistics();

    initMicPermissions();
  }

  renderSequence() {
    const {
      started,
      completed,
      speechRecognitionService,
      isLoading,
      isLoadingFonts,
      selectedInteraction
    } = this.props;

    if (isLoading || isLoadingFonts) {
      return <CenterContent><Loader /></CenterContent>;
    }

    if (!selectedInteraction) {
      return <ReviewMenuScreenContainer />;
    }

    if (started && !completed) {
      return <TrainersSequence
        speechEngineName={speechRecognitionService?.getEngineName()}
        shouldShowToolbar={false}
      />;
    }

    if (completed) {
      return <ReviewEndScreenContainer />;
    }

    return null;
  }

  render() {
    return (
      <ApplicationLayout>
        <ApplicationErrorBoundary name="ReviewApp">
          <NavbarContainer />
          <FeatureToggles />
          <MessagesContainer />
          <TrainerOverlay />
          <main>
            {this.renderSequence()}
          </main>
          <BottomLayout />
        </ApplicationErrorBoundary>
      </ApplicationLayout>
    );
  }
}

ReviewApp.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isLoadingFonts: PropTypes.bool.isRequired,
  fetchAccount: PropTypes.func.isRequired,
  fetchTrainerItemsStatistics: PropTypes.func.isRequired,
  initMicPermissions: PropTypes.func.isRequired,
  selectedInteraction: PropTypes.string,
  fetchInteractionTypes: PropTypes.func.isRequired,
  track: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  speechRecognitionService: PropTypes.any.isRequired,
  started: PropTypes.bool,
  completed: PropTypes.bool
};

export default compose(
  withServices(['speechRecognitionService']),
  withFontsLoaded,
  connect(mapStateToProps, mapDispatchToProps)
)(ReviewApp);
