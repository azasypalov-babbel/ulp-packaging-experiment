import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TrainerContainer from '../Sequence/TrainerContainer';
import MicPermissionContainer from '../shared/SpeechRecognition/MicPermissionContainer';

import * as sequenceActions from '../../dux/sequence/actions';
import * as trackerActions from '../../dux/tracker/actions';
import * as sessionActions from '../../dux/session/actions';
import { isMicEnabled, isReview } from '../../dux/session/selectors';
import { calculateTrainerProgress, currentTrainerItemIndex } from '../../dux/sequence/selectors';

import * as Engines from '../../services/speechRecognition/engines';
import TrainerErrorBoundary from './TrainerErrorBoundary';

const mapStateToProps = ({ session, sequence, permissions }) => ({
  isMicEnabled: isMicEnabled(session),
  trainers: sequence.trainers,
  isReview: isReview(session),
  trainerProgress: calculateTrainerProgress(sequence.trainers[sequence.currentTrainerIndex]),
  currentTrainerIndex: sequence.currentTrainerIndex,
  isPermissionCompleted: permissions.completed,
  currentTrainerItemIndex: currentTrainerItemIndex(sequence)
});

const mapDispatchToProps = {
  track: trackerActions.track,
  abortSequence: sequenceActions.abortSequence,
  completeTrainer: sequenceActions.completeTrainer,
  allocateItems: sequenceActions.allocateItems,
  skipItem: sequenceActions.skipItem,
  setMicSettings: sessionActions.setMicSettings
};

export class TrainersSequence extends React.Component {
  constructor(props) {
    super(props);

    this.handleTrainerStart = this.handleTrainerStart.bind(this);
    this.handleTrainerFinish = this.handleTrainerFinish.bind(this);
    this.handleTrainerItemSkip = this.handleTrainerItemSkip.bind(this);
    this.unloadHandler = this.unloadHandler.bind(this);
  }

  handleTrainerStart({ scorableItemsCount }) {
    if (scorableItemsCount) {
      this.props.allocateItems(scorableItemsCount);
    }
  }

  handleTrainerItemSkip(item, attempt, trainerData) {
    this.props.skipItem(item, attempt, trainerData);
  }

  handleTrainerFinish() {
    this.props.completeTrainer();
  }

  unloadHandler() {
    this.props.abortSequence();
  }

  componentDidMount() {
    addEventListener('beforeunload', this.unloadHandler);
  }

  componentWillUnmount() {
    removeEventListener('beforeunload', this.unloadHandler);
  }

  renderTrainer() {
    const currentTrainer = this.props.trainers[this.props.currentTrainerIndex];
    const shouldShowToolbar =
      this.props.shouldShowToolbar &&
      [Engines.types.WEB_SPEECH, Engines.types.NATIVE_SPEECH].includes(this.props.speechEngineName) &&
      currentTrainer.interaction === 'speak';

    const key = `${this.props.currentTrainerIndex}_${currentTrainer.interaction}`;

    return (
      <TrainerErrorBoundary
        trainerType={currentTrainer.type}
        trainerInteraction={currentTrainer.interaction}
        onError={this.handleTrainerFinish}
      >
        <TrainerContainer
          key={key}
          isMicEnabled={this.props.isMicEnabled}
          trainer={currentTrainer}
          trainerProgress={this.props.trainerProgress}
          currentTrainerItemIndex={this.props.currentTrainerItemIndex}
          onStart={this.handleTrainerStart}
          onItemSkip={this.handleTrainerItemSkip}
          onFinish={this.handleTrainerFinish}
          speechEngineName={this.props.speechEngineName}
          shouldShowToolbar={shouldShowToolbar}
        />
      </TrainerErrorBoundary>
    );
  }

  render() {
    const currentTrainer = this.props.trainers[this.props.currentTrainerIndex];
    const { isMicEnabled, speechEngineName, isPermissionCompleted } = this.props;

    if (!currentTrainer) return null;

    if (speechEngineName === Engines.types.WEB_SPEECH) {
      const shouldRenderMicPermission =
        isMicEnabled &&
        currentTrainer.interaction === 'speak' &&
        !isPermissionCompleted;

      if (shouldRenderMicPermission) {
        return (
          <MicPermissionContainer speechEngineName={speechEngineName} />
        );
      }
    }

    return (
      this.renderTrainer()
    );
  }
}

TrainersSequence.propTypes = {
  isMicEnabled: PropTypes.bool,
  allocateItems: PropTypes.func.isRequired,
  completeTrainer: PropTypes.func.isRequired,
  trainers: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentTrainerIndex: PropTypes.number,
  speechEngineName: PropTypes.oneOf([
    Engines.types.LEGACY_SPEECH,
    Engines.types.NATIVE_SPEECH,
    Engines.types.WEB_SPEECH
  ]),
  isPermissionCompleted: PropTypes.bool.isRequired,
  trainerProgress: PropTypes.number,
  shouldShowToolbar: PropTypes.bool.isRequired,
  skipItem: PropTypes.func.isRequired,
  currentTrainerItemIndex: PropTypes.number,
  abortSequence: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainersSequence);
