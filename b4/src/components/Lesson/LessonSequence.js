import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as sessionActions from '../../dux/session/actions';
import * as sequenceActions from '../../dux/sequence/actions';
import * as permissionsActions from '../../dux/permissions/actions';
import { track } from '../../dux/tracker/actions';
import Loader from '../shared/Loader';
import CenterContent from '../shared/CenterContent';
import LessonEndScreenContainer from '../Lesson/LessonEndScreen/LessonEndScreenContainer';
import LearningTipScreenContainer from '../Screen/LearningTipScreen/LearningTipScreenContainer';
import TrainersSequence from '../Sequence/TrainersSequence';
import LegacyTrainerSettingsContainer from './LegacyTrainerSettingsContainer';
import LessonLandingScreenContainer from './LessonLandingScreen/LessonLandingScreenContainer';
import InternetExplorerMessage from '../shared/InternetExplorerMessage';
import * as sessionSelectors from '../../dux/session/selectors';
import { trainersContainSpeakInteraction } from '../../lib/speechHelper';
import { compose } from 'redux';
import { withServices } from '../shared/withServices';
import withFontsLoaded from '../shared/withFontsLoaded';

import * as Engines from '../../services/speechRecognition/engines';

export const mapStateToProps = ({
  content,
  lesson,
  session,
  sequence
}, { speechRecognitionService }) => ({
  isLoading: Boolean(
    sequence.trainers.length === 0 ||
    content.loading ||
    lesson.loading ||
    lesson.loadingCourseDetails
  ),
  started: sequence.started,
  completed: sequence.completed,
  trainers: sequence.trainers,
  currentTrainerIndex: sequence.currentTrainerIndex,
  learningTipConfirmed: session.learningTipConfirmed,
  showMicSetupPage:
    trainersContainSpeakInteraction(sequence.trainers, speechRecognitionService?.getEngineName()),
  speechEngineName: speechRecognitionService && speechRecognitionService.getEngineName(),
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale,
  isUnsupportedBrowser: sessionSelectors.isUnsupportedBrowser(session),
  isUnsupportedBrowserWarningDismissed: session.isUnsupportedBrowserWarningDismissed,
  isLessonLandingScreenShown: sessionSelectors.isLessonLandingScreenShown(session)
});

const mapDispatchToProps = {
  confirmLearningTip: sessionActions.confirmLearningTip,
  confirmLessonLandingScreen: sessionActions.confirmLessonLandingScreen,
  dismissUnsupportedBrowserWarning: sessionActions.dismissUnsupportedBrowserWarning,
  setMicSettings: sessionActions.setMicSettings,
  startSequence: sequenceActions.startSequence,
  initMicPermissions: permissionsActions.initMicPermissions,
  initMicSettings: sessionActions.initMicSettings,
  track
};

export class LessonSequence extends React.Component {
  constructor(props) {
    super(props);
    this.handleMicSetupFinish = this.handleMicSetupFinish.bind(this);
    this.handleLearningTipConfirmation = this.handleLearningTipConfirmation.bind(this);
    this.handleDismissUnsupportedBrowserWarning = this.handleDismissUnsupportedBrowserWarning.bind(this);
    this.props.initMicPermissions();
    this.props.initMicSettings();
  }

  trackMicSettings(settings) {
    const { track, locale, learnLanguageAlpha3 } = this.props;

    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 2,
      payload: {
        gui_container: 'mic_setting_screen',
        gui_element: 'continue_button',
        gui_variant: settings.speak ? 'with_mic' : 'without_mic',
        interaction: 'clicked',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  handleMicSetupFinish(settings) {
    this.trackMicSettings(settings);
    const isMicEnabled = settings && settings.speak;
    this.props.setMicSettings(isMicEnabled);
    this.props.startSequence();
  }

  handleLearningTipConfirmation() {
    this.props.confirmLearningTip();
    this.props.startSequence();
  }

  handleDismissUnsupportedBrowserWarning() {
    this.props.dismissUnsupportedBrowserWarning();
    this.props.startSequence();
  }

  render() {
    const {
      isLoading,
      isLoadingFonts,
      started,
      completed,
      locale,
      learningTipConfirmed,
      showMicSetupPage,
      isUnsupportedBrowser,
      isUnsupportedBrowserWarningDismissed,
      speechEngineName,
      isLessonLandingScreenShown,
      confirmLessonLandingScreen
    } = this.props;

    if (isLoading || isLoadingFonts) return <CenterContent><Loader /></CenterContent>;

    if (isLessonLandingScreenShown) {
      return <LessonLandingScreenContainer
        onConfirm={confirmLessonLandingScreen}
      />;
    }

    if (!started) {
      if (isUnsupportedBrowser && !isUnsupportedBrowserWarningDismissed) {
        return <InternetExplorerMessage
          onRemindLaterClick={this.handleDismissUnsupportedBrowserWarning}
          locale={locale}
        />;
      }

      if (showMicSetupPage) {
        return <LegacyTrainerSettingsContainer
          onFinish={this.handleMicSetupFinish}
          speechEngineName={speechEngineName}
        />;
      }

      if (!learningTipConfirmed) {
        return <LearningTipScreenContainer
          onContinueButtonClick={this.handleLearningTipConfirmation}
        />;
      }
    }

    if (started && !completed) {
      const currentTrainer = this.props.trainers[this.props.currentTrainerIndex];

      if (!currentTrainer) return null;

      return <TrainersSequence
        speechEngineName={speechEngineName}
        shouldShowToolbar={true}
      />;
    }

    if (completed) {
      return <LessonEndScreenContainer />;
    }

    return null;
  }
}

LessonSequence.propTypes = {
  showMicSetupPage: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingFonts: PropTypes.bool.isRequired,
  started: PropTypes.bool,
  completed: PropTypes.bool.isRequired,
  learningTipConfirmed: PropTypes.bool.isRequired,
  confirmLearningTip: PropTypes.func.isRequired,
  startSequence: PropTypes.func.isRequired,
  speechEngineName: PropTypes.oneOf([
    Engines.types.LEGACY_SPEECH,
    Engines.types.WEB_SPEECH,
    Engines.types.NATIVE_SPEECH
  ]),
  setMicSettings: PropTypes.func.isRequired,
  initMicPermissions: PropTypes.func.isRequired,
  initMicSettings: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired,
  trainers: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentTrainerIndex: PropTypes.number,
  isUnsupportedBrowser: PropTypes.bool.isRequired,
  isUnsupportedBrowserWarningDismissed: PropTypes.bool.isRequired,
  dismissUnsupportedBrowserWarning: PropTypes.func.isRequired,
  isLessonLandingScreenShown: PropTypes.bool.isRequired,
  confirmLessonLandingScreen: PropTypes.func.isRequired
};

export default compose(
  withServices(['speechRecognitionService']),
  withFontsLoaded,
  connect(mapStateToProps, mapDispatchToProps)
)(LessonSequence);
