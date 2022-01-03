import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as sequenceSelectors from '../../../dux/sequence/selectors';
import * as sessionSelectors from '../../../dux/session/selectors';
import * as reviewActions from '../../../dux/review/actions';
import * as lessonActions from '../../../dux/lesson/actions';
import * as sequenceActions from '../../../dux/sequence/actions';
import { track } from '../../../dux/tracker/actions';
import Navbar from './Navbar';
import { progressCounterPropTypes } from './ProgressCounter';

export const mapStateToProps = ({ zendeskWidget, session, sequence }) => {
  const isLesson = sessionSelectors.isLesson(session);
  const progressCounter = isLesson
    ? sequenceSelectors.sequenceProgressCounter(sequence)
    : sequenceSelectors.itemProgressCounter(sequence);

  return {
    isLessonLandingScreenShown: sessionSelectors.isLessonLandingScreenShown(session),
    isLesson,
    progressBar: {
      trainerCount: sequenceSelectors.trainersInSequence(sequence).length,
      currentTrainerIndex: sequence.currentTrainerIndex,
      sequenceHeadProgress: sequenceSelectors.sequenceHeadProgress(sequence),
      sequenceHeadIndex: sequenceSelectors.sequenceHeadIndex(sequence)
    },
    showProgressBar: sequence.started,
    showFeedbackButton: zendeskWidget.ready,
    progressCounter
  };
};

const mapDispatchToProps = {
  closeLesson: lessonActions.closeLesson,
  closeReview: reviewActions.closeReview,
  track,
  navigate: sequenceActions.navigate
};

export class NavbarContainer extends Component {
  constructor(props) {
    super(props);
    this.handleProgressBarTrainerClick = this.handleProgressBarTrainerClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  handleCloseClick() {
    const { isLesson, closeLesson, closeReview, isLessonLandingScreenShown, track } = this.props;

    if (isLessonLandingScreenShown) {
      /* eslint-disable camelcase */
      track({
        event: 'gui:interacted',
        version: 1,
        payload: {
          gui_element: 'close_button',
          gui_container: 'lesson_landing_page',
          origin: 'lesson_player',
          interaction: 'clicked'
        }
      });
      /* eslint-enable camelcase */
    }

    if (isLesson) {
      closeLesson();
    } else {
      closeReview();
    }
  }

  handleProgressBarTrainerClick() {
    const { track, isLesson } = this.props;

    if (isLesson) {
      /* eslint-disable camelcase */
      track({
        event: 'gui:interacted',
        version: 1,
        payload: {
          gui_element: 'progress_bar',
          origin: 'lesson_player',
          interaction: 'clicked'
        }
      });
      /* eslint-enable camelcase */
    }
  }

  render() {
    const {
      progressBar,
      progressCounter,
      showFeedbackButton,
      showProgressBar
    } = this.props;

    return (
      <div className="loy">
        <Navbar
          onClickClose={this.handleCloseClick}
          showFeedbackButton={showFeedbackButton}
          showProgressBar={showProgressBar}
          progressBar={{
            ...progressBar,
            onTrainerClick: this.handleProgressBarTrainerClick
          }}
          progressCounter={progressCounter}
        />
      </div>
    );
  }
}

NavbarContainer.propTypes = {
  track: PropTypes.func.isRequired,
  closeLesson: PropTypes.func.isRequired,
  closeReview: PropTypes.func.isRequired,
  progressBar: PropTypes.object.isRequired,
  progressCounter: PropTypes.shape(progressCounterPropTypes).isRequired,
  showFeedbackButton: PropTypes.bool.isRequired,
  showProgressBar: PropTypes.bool,
  isLesson: PropTypes.bool.isRequired,
  isLessonLandingScreenShown: PropTypes.bool.isRequired
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(NavbarContainer);
