import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ListeningTrainer from './ListeningTrainer';

import * as sequenceActions from '../../../dux/sequence/actions';
import { toggleHints } from '../../../dux/keyboard/actions';
import { track } from '../../../dux/tracker/actions';
import { MESSAGE_KEYS } from '../../../dux/messages/messageKeys';
import * as messagesActions from '../../../dux/messages/actions';

import { withServices } from '../../shared/withServices';
import withAudio, { audioPropTypes } from '../../shared/withAudio';

import makeItemsWithDistractors from './makeItemsWithDistractors';
import { formatDL, formatLL } from '../../../lib/markupFormatter';
import shuffle from '../../../lib/shuffle';
import playFeedbackSound, { FEEDBACK_SOUND } from '../../../lib/playFeedbackSound';


const formatTrainerItem = (item) => ({
  id: item.id,
  sound: item.sound,
  learnLanguageText: formatLL(item.learn_language_text),
  displayLanguageText: formatDL(item.display_language_text)
});

const flattenItems = (trainer) => {
  return trainer.item_groups.reduce((acc, group) => {
    return acc.concat(group.items);
  }, []);
};

const shuffleItems = (currentIndex, items) => {
  const { item, distractors } = items[currentIndex];
  return shuffle({ array: [item, ...distractors] });
};

export class ListeningTrainerContainer extends React.Component {
  constructor(props) {
    super(props);

    const trainerItems = flattenItems(props.trainer)
      .map(formatTrainerItem)
      .filter((item) => Boolean(item.sound));

    const items = makeItemsWithDistractors(trainerItems);

    this.state = {
      items,
      currentIndex: 0,
      attempt: undefined,
      showChoiceItems: false,
      currentShuffledItems: shuffleItems(0, items)
    };

    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.handleChoiceItemClick = this.handleChoiceItemClick.bind(this);
    this.onSoundPlayerEnded = this.onSoundPlayerEnded.bind(this);
    this.onSoundPlayerError = this.onSoundPlayerError.bind(this);
    this.handleToggleShortcuts = this.handleToggleShortcuts.bind(this);
    this.handleKeyboardTriggeredAttempt = this.handleKeyboardTriggeredAttempt.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { items } = this.state;
    this.props.onStart({ scorableItemsCount: items.length });
  }

  handleToggleShortcuts() {
    const { toggleHints, track, locale, learnLanguageAlpha3 } = this.props;

    toggleHints();

    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_container: 'listening_trainer',
        gui_element: 'shortcut_hint_toggler',
        origin: 'lesson_player',
        interaction: 'clicked',
        locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  handleKeyboardTriggeredAttempt() {
    const { track, locale, learnLanguageAlpha3 } = this.props;
    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_container: 'listening_trainer',
        gui_element: 'keyboard_shortcut',
        origin: 'lesson_player',
        interaction: 'clicked',
        locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  handleChoiceItemClick(attempt, keyboardTriggered) {
    const { mediaUrlService, audio } = this.props;
    const { item } = this.state.items[this.state.currentIndex];
    const itemSoundUrl = mediaUrlService.soundURL(item.sound.id, 'mp3');

    this.setState({ attempt });

    if (keyboardTriggered) {
      this.handleKeyboardTriggeredAttempt();
    }

    const solved = attempt.mistakes === 0;
    const onEnded = () => {
      // Check if the item is still active
      const { item: currentItem } = this.state.items[this.state.currentIndex];
      if (item === currentItem && solved) {
        audio.playSoundWithState(itemSoundUrl);
      }
    };
    const options = {
      onEnded
    };

    playFeedbackSound(FEEDBACK_SOUND.forItemSolved(solved), options);

    this.props.attemptItem(item, {
      solved: attempt.mistakes === 0,
      text: attempt.text
    });
  }

  handleContinueClick(item, mistakes) {
    this.props.completeItem(item, mistakes);

    this.setState({ attempt: undefined, showChoiceItems: false });

    this.props.audio.stop();
    this.props.audio.cleanup();

    if (this.state.currentIndex < this.state.items.length - 1) {
      const nextIndex = this.state.currentIndex + 1;
      this.setState({
        currentIndex: nextIndex,
        currentShuffledItems: shuffleItems(nextIndex, this.state.items)
      });
    } else {
      setTimeout(() => this.props.onFinish(), 100);
    }
  }

  onSoundPlayerEnded() {
    this.setState({ showChoiceItems: true });
  }

  onSoundPlayerError() {
    const { items, currentIndex, attempt } = this.state;
    const { item: itemWithBrokenSound } = items[currentIndex];
    const { trainer, addMessage } = this.props;

    const trainerData = {
      interaction_mode: trainer.interaction,
      item_position_in_trainer: currentIndex + 1,
      number_of_items_in_trainer: items.length,
      translation_mode: ''
    };

    if (!navigator.onLine) {
      return addMessage(MESSAGE_KEYS.NETWORK);
    }

    this.props.skipItem(itemWithBrokenSound, attempt, trainerData);

    this.setState({ attempt: undefined, showChoiceItems: false });

    if (this.state.currentIndex < this.state.items.length - 1) {
      this.setState((prevState) => ({
        items: prevState.items.filter((itemWithDistractors) => itemWithDistractors.item !== itemWithBrokenSound)
      }));
    } else {
      this.props.onFinish();
    }
  }

  render() {
    const { attempt, showChoiceItems, currentShuffledItems } = this.state;
    const { item } = this.state.items[this.state.currentIndex];

    return (
      <ListeningTrainer
        key={item.id}
        mediaUrlService={this.props.mediaUrlService}
        choiceItemsList={currentShuffledItems}
        onSoundPlayerEnded={this.onSoundPlayerEnded}
        onSoundPlayerError={this.onSoundPlayerError}
        attempt={attempt}
        showChoiceItems={showChoiceItems}
        item={item}
        onContinue={this.handleContinueClick}
        onChoiceItemClick={this.handleChoiceItemClick}
        audio={this.props.audio}
        onToggleShortcuts={this.handleToggleShortcuts}
      />
    );
  }
}

const mapDispatchToProps = {
  track,
  toggleHints,
  attemptItem: sequenceActions.attemptItem,
  completeItem: sequenceActions.completeItem,
  skipItem: sequenceActions.skipItem,
  addMessage: messagesActions.addMessage
};

const mapStateToProps = ({ session }) => ({
  locale: session.locale,
  learnLanguageAlpha3: session.learnLanguageAlpha3
});

ListeningTrainerContainer.propTypes = {
  addMessage: PropTypes.func.isRequired,
  attemptItem: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired,
  skipItem: PropTypes.func.isRequired,
  trainer: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  mediaUrlService: PropTypes.any.isRequired,
  audio: audioPropTypes.isRequired,
  track: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  toggleHints: PropTypes.func.isRequired
};

export default compose(
  withServices(['mediaUrlService']),
  withAudio(),
  connect(mapStateToProps, mapDispatchToProps)
)(ListeningTrainerContainer);
