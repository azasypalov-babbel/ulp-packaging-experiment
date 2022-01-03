import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import withB3 from '../../providers/b3';
import * as features from '../../lib/features';
import { parseTrainer } from '../../lib/parser/trainers';
import InteractionToggleToolbar from '../shared/SpeechRecognition/InteractionToggleToolbar';
import rollbar from '../../services/rollbarService';
import { StyledLegacyTrainerLayout } from '../LegacyTrainerLayout';
import withInfoText from '../shared/withInfoText';

export class LegacyTrainerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.legacyTrainerPage = null;

    this.handleItemSkip = this.handleItemSkip.bind(this);
    this.mountLegacyTrainerPage = this.mountLegacyTrainerPage.bind(this);
    this.startLegacyTrainerPage = this.startLegacyTrainerPage.bind(this);
  }

  componentDidMount() {
    this.mountLegacyTrainerPage();
  }

  mountLegacyTrainerPage() {
    const {
      b3,
      isMicEnabled,
      onFinish,
      displayInfoText,
      clearInfoTextUI
    } = this.props;

    const parsedTrainerData = parseTrainer(this.props.trainer);

    const componentName = parsedTrainerData.component.toLowerCase();
    const options = {
      mountPoint: this.containerRef.current,
      speak: isMicEnabled,
      displayInfoText,
      clearInfoTextUI,
      onFinish,
      onItemSkip: this.handleItemSkip,
      services: {
        rollbar
      }
    };

    b3.keyboardEvents.reset();

    const createLegacyTrainerPage = b3.settings.pageComponents[componentName];
    this.legacyTrainerPage = createLegacyTrainerPage(parsedTrainerData.traineritems, parsedTrainerData, options);

    if (this.legacyTrainerPage.prepare.length) {
    /* Some trainers have async preparation step.
       We need to wait until it gets prepared.
       prepare.length returns the number of arguments the function accepts, if 1 it accepts a callback. */
      this.legacyTrainerPage.prepare(this.startLegacyTrainerPage);
    } else {
      this.legacyTrainerPage.prepare();
      this.startLegacyTrainerPage();
    }
  }

  startLegacyTrainerPage() {
    if (typeof this.legacyTrainerPage.totalScoreEvents === 'function') {
      this.props.onStart({ scorableItemsCount: this.legacyTrainerPage.totalScoreEvents() });
    } else {
      this.props.onStart({});
    }
    this.legacyTrainerPage.start();
  }

  componentWillUnmount() {
    if (typeof this.legacyTrainerPage.cleanup === 'function') this.legacyTrainerPage.cleanup();
  }

  handleItemSkip(item, attempt, trainerData) {
    this.props.onItemSkip(item, attempt, trainerData);
  }

  render() {
    const { trainer } = this.props;
    const shouldShowToolbar = (
      this.props.shouldShowToolbar &&
      this.props.trainerProgress < 1
    );

    return (
      <>
        <StyledLegacyTrainerLayout
          data-trainer-type={`${trainer.type}`}
          data-trainer-interaction={`${trainer.interaction}`}
          data-trainer-puzzlehelper={`${trainer.puzzle_helper}`}
          ref={this.containerRef}
          className={'b3 ' + (features.isWebview() ? 'disable-selection' : '')}
        />
        {shouldShowToolbar && <InteractionToggleToolbar />}
      </>
    );
  }
}

LegacyTrainerContainer.propTypes = {
  isMicEnabled: PropTypes.bool,
  onStart: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  onItemSkip: PropTypes.func.isRequired,
  trainer: PropTypes.object.isRequired,
  b3: PropTypes.any.isRequired,
  trainerProgress: PropTypes.number,
  shouldShowToolbar: PropTypes.bool.isRequired,
  displayInfoText: PropTypes.func,
  clearInfoTextUI: PropTypes.func
};

LegacyTrainerContainer.defaultProps = {
  shouldShowToolbar: false,
  displayInfoText: () => {},
  clearInfoTextUI: () => {}
};

export default compose(
  withInfoText,
  withB3,
)(LegacyTrainerContainer);
