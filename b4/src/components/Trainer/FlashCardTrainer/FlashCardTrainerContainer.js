import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatDL, formatLL } from '../../../lib/markupFormatter';
import playFeedbackSound, { FEEDBACK_SOUND } from '../../../lib/playFeedbackSound';

import FlashCardTrainer from './FlashCardTrainer';
import { withServices } from '../../shared/withServices';
import withAudio, { audioPropTypes } from '../../shared/withAudio';
import * as sequenceActions from '../../../../src/dux/sequence/actions';
import { toggleHints } from '../../../dux/keyboard/actions';


const formatTrainerItem = (item) => ({
  id: item.id,
  sound: item.sound,
  image: item.image,
  learnLanguageText: formatLL(item.learn_language_text),
  displayLanguageText: formatDL(item.display_language_text)
});

const flattenItems = (trainer) => {
  return trainer.item_groups.reduce((acc, group) => {
    return acc.concat(group.items);
  }, []);
};

export class FlashCardTrainerContainer extends React.Component {
  constructor(props) {
    super(props);

    const items = flattenItems(props.trainer).map(formatTrainerItem);
    this.state = {
      items,
      currentIndex: 0
    };

    this.handleContinueClick = this.handleContinueClick.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { items } = this.state;
    this.props.onStart({ scorableItemsCount: items.length });
  }

  handleContinueClick(item, { mistakes }) {
    const solved = mistakes === 0;

    playFeedbackSound(FEEDBACK_SOUND.forItemSolved(solved));

    this.props.attemptItem(item, { solved });
    this.props.completeItem(item, mistakes);

    if (this.state.currentIndex < this.state.items.length - 1) {
      this.setState((state) => ({ currentIndex: state.currentIndex + 1 }));
    } else {
      setTimeout(() => this.props.onFinish(), 100);
    }
  }

  render() {
    return (
      <FlashCardTrainer
        learnLanguageAlpha3={this.props.learnLanguageAlpha3}
        locale={this.props.locale}
        mediaUrlService={this.props.mediaUrlService}
        item={this.state.items[this.state.currentIndex]}
        onContinue={this.handleContinueClick}
        audio={this.props.audio}
        onToggleShortcuts={this.props.onToggleShortcuts}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { locale, learnLanguageAlpha3 } = state.session;
  return {
    locale,
    learnLanguageAlpha3
  };
};

const mapDispatchToProps = {
  onToggleShortcuts: toggleHints,
  attemptItem: sequenceActions.attemptItem,
  completeItem: sequenceActions.completeItem
};

FlashCardTrainerContainer.propTypes = {
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  attemptItem: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired,
  audio: audioPropTypes.isRequired,
  onToggleShortcuts: PropTypes.func.isRequired,
  trainer: PropTypes.object.isRequired,
  mediaUrlService: PropTypes.any.isRequired,
  onFinish: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired
};

const enhance = compose(
  withServices(['mediaUrlService']),
  withAudio(),
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(FlashCardTrainerContainer);
