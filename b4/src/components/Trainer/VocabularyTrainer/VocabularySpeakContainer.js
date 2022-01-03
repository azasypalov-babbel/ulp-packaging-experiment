import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import VocabularySpeak from './VocabularySpeak';
import { stripParantheses } from '../../../lib/markupFormatter';
import playFeedbackSound, { FEEDBACK_SOUND } from '../../../lib/playFeedbackSound';
import {
  formatParentheses,
  getFirstCorrectSolution,
  removeGapFormatting,
  markupStringToPlainText,
  stripCurlyBracesAndContent,
  markupStringToHTML
} from '@lessonnine/babbel-markup-helper.js';
import { learnLanguageAlpha3toBCP47 } from '../../../lib/languageCodeConverter';

import { withServices } from '../../shared/withServices';
import withConditionalHOC from '../../shared/withConditionalHOC';
import withAudio, { audioPropTypes } from '../../shared/withAudio';
import withSpeech, {
  speechPropTypes,
  recognitionHasEnded,
  recognitionHasError
} from '../../shared/withSpeech';
import withSpeechMessages from '../../shared/withSpeechMessages';
import withInfoText from '../../shared/withInfoText';

import { track } from '../../../dux/tracker/actions';
import { shallUserPass } from '../../../dux/tracker/shallUserPass';

import * as sequenceActions from '../../../dux/sequence/actions';
import * as Engines from '../../../services/speechRecognition/engines';

const formatLL = compose(
  stripParantheses,
  removeGapFormatting,
  formatParentheses,
  markupStringToPlainText,
  getFirstCorrectSolution,
  stripCurlyBracesAndContent,
  (s) => s || ''
);

const formatTrainerItem = (item) => ({
  id: item.id,
  sound: item.sound,
  image: item.image,
  learnLanguageText: item.learn_language_text,
  displayLanguageText: item.display_language_text,
  infoText: item.info_text
});

const flattenItems = (trainer) => {
  return trainer.item_groups.reduce((acc, group) => {
    return acc.concat(group.items);
  }, []);
};

export class VocabularySpeakContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: flattenItems(props.trainer).map(formatTrainerItem),
      currentIndex: props.currentTrainerItemIndex,
      isUserAllowedToSpeak: false,
      attemptsCounter: 1
    };

    if (props.speech) {
      // Webview speech recognition expects a tap and hold interaction for speaking, rather than click
      this.tapAndHoldToSpeak = props.speech.engineName === Engines.types.NATIVE_SPEECH;
    }

    this.handleMicButtonInteraction = this.handleMicButtonInteraction.bind(this);
    this.handleSoundPlayEnded = this.handleSoundPlayEnded.bind(this);
    this.handleSpeechEnd = this.handleSpeechEnd.bind(this);
    this.handleAttempt = this.handleAttempt.bind(this);
    this.handleSpeechError = this.handleSpeechError.bind(this);
    this.handleAttemptRetry = this.handleAttemptRetry.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.handleItemPlaybackCardClick = this.handleItemPlaybackCardClick.bind(this);
    this.handleSkipClick = this.handleSkipClick.bind(this);

    this.state
      .items
      .filter((item) => item.sound)
      .map((item) => props.mediaUrlService.soundURL(item.sound.id))
      .forEach((url) => props.audio.preload(url));

    this.attemptTimeout = null;
  }

  UNSAFE_componentWillMount() {
    const { items } = this.state;
    this.props.onStart({ scorableItemsCount: items.length });
  }

  componentWillUnmount() {
    clearTimeout(this.attemptTimeout);
  }

  componentDidUpdate(prevProps) {
    if (this.props.speech) {
      if (recognitionHasEnded(prevProps.speech, this.props.speech)) this.handleSpeechEnd();
      if (recognitionHasError(prevProps.speech, this.props.speech)) this.handleSpeechError();
    }
  }

  handleMicButtonInteraction() {
    this.startSpeech();

    if (this.props.shallUserPass) {
      const { track, locale, learnLanguageAlpha3 } = this.props;

      /* eslint-disable camelcase */
      track({
        event: 'gui:interacted',
        version: 1,
        payload: {
          gui_container: 'cube_trainer',
          gui_element: 'mic_button',
          interaction: 'clicked',
          origin: 'lesson_player',
          locale: locale,
          learn_language_alpha3: learnLanguageAlpha3
        }
      });
      /* eslint-enable camelcase */
    }
  }

  startSpeech() {
    const { speech, learnLanguageBCP47, audio } = this.props;
    const { items, currentIndex } = this.state;
    const item = items[currentIndex];

    if (audio.isPlaying) audio.stop();

    if (speech && !(speech.listening || speech.recording)) {
      speech.start({
        interimResults: true,
        lang: learnLanguageBCP47,
        continuous: true,
        targetText: formatLL(item.learnLanguageText),
        soundId: item.sound.id,
        itemUuid: item.id
      });
    }
  }

  handleSoundPlayEnded() {
    if (this.state.hasSoundPlayed) return;

    this.setState({
      hasSoundPlayed: true
    });

    if (this.props.speech) {
      !this.tapAndHoldToSpeak && this.startSpeech();
    } else {
      const { items, currentIndex } = this.state;
      const item = items[currentIndex];
      // With short item sounds doesn't give the user enough time to toggle to speak mode
      // so we have a timeout before showing feedback sheet
      const TIMEOUT_FOR_FEEDBACK_SHEET = 800;
      this.attemptTimeout = setTimeout(() => {
        this.handleAttempt({ solved: true });
        this.props.displayInfoText(item);
      }, TIMEOUT_FOR_FEEDBACK_SHEET);
    }
  }

  handleItemPlaybackCardClick() {
    if (this.props.shallUserPass) {
      const { track, locale, learnLanguageAlpha3 } = this.props;
      /* eslint-disable camelcase */
      track({
        event: 'gui:interacted',
        version: 1,
        payload: {
          gui_container: 'cube_trainer',
          gui_element: 'item_playback_card',
          interaction: 'clicked',
          origin: 'lesson_player',
          locale: locale,
          learn_language_alpha3: learnLanguageAlpha3
        }
      });
      /* eslint-enable camelcase */
    }
  }

  handleAttempt(attempt) {
    const { attemptsCounter } = this.state;
    const { text, solved } = attempt;
    this.setState({
      attempt: {
        text,
        mistakes: solved ? 0 : 1
      },
      attemptsCounter: attemptsCounter + 1
    });

    return new Promise((resolve) => {
      const options = {
        onEnded: resolve
      };

      playFeedbackSound(FEEDBACK_SOUND.forItemSolved(solved), options);
    });
  }

  handleSpeechEnd() {
    const {
      speech: {
        transcript,
        solved,
        engineName,
        error
      }
    } = this.props;

    /*
     * with webspeech API we can ignore attempts when nothing was said
     */
    if (engineName === Engines.types.WEB_SPEECH && !transcript) return;

    if (error) return;

    const { items, currentIndex, attemptsCounter } = this.state;
    const item = items[currentIndex];

    this.handleAttempt({ text: transcript, solved }).then(() => {
      const { audio, mediaUrlService } = this.props;
      const itemSoundUrl = mediaUrlService.soundURL(item.sound.id, 'mp3');
      if (solved) {
        // if the trainer is already in the next item just show the info text
        // otherwise play sound and then show info text
        if (currentIndex !== this.state.currentIndex) {
          this.props.displayInfoText(item);
        } else {
          audio.playSoundWithState(
            itemSoundUrl,
            { onEnded: () => this.props.displayInfoText(item) }
          );
        }
      }
    });

    this.props.attemptItem(item, {
      text: transcript,
      solved,
      number: attemptsCounter
    });
  }

  handleSpeechError() {
    const { items, currentIndex } = this.state;
    const item = items[currentIndex];

    const { speech: { error, engineName } } = this.props;

    this.props.attemptItem(item, {
      solved: false,
      engineName,
      error
    });
  }

  handleAttemptRetry() {
    this.props.speech.reset();
    this.setState({ attempt: undefined }, () => {
      !this.tapAndHoldToSpeak && this.startSpeech();
    });
  }

  handleContinueClick() {
    const { items, currentIndex, attempt } = this.state;
    const mistakes = this.props.speech ? attempt.mistakes : 0;
    const item = items[currentIndex];

    this.props.completeItem(item, mistakes);
    if (this.props.speech) {
      this.props.speech.reset();
    }
    this.props.audio.stop();
    this.props.audio.cleanup();
    this.props.clearInfoTextUI();

    this.setState({ attempt: undefined, hasSoundPlayed: false, attemptsCounter: 1 });

    if (currentIndex < items.length - 1) {
      const nextIndex = currentIndex + 1;
      this.setState({
        currentIndex: nextIndex
      });
    } else {
      this.props.onFinish();
    }
  }

  handleSkipClick() {
    const { trainer, speech: { engineName } } = this.props;
    const { items, currentIndex, attemptsCounter, attempt } = this.state;
    const item = items[currentIndex];

    const itemAttempt = {
      ...attempt,
      solved: false,
      engineName,
      number: attemptsCounter
    };

    const trainerData = {
      interaction_mode: trainer.interaction,
      item_position_in_trainer: currentIndex + 1,
      number_of_items_in_trainer: items.length,
      translation_mode: ''
    };

    this.props.skipItem(item, itemAttempt, trainerData);
    this.handleContinueClick();
  }

  render() {
    const { items, currentIndex, hasSoundPlayed } = this.state;
    const item = items[currentIndex];
    const title = this.props.trainer.title ? markupStringToHTML(this.props.trainer.title) : this.props.trainer.title;

    return <VocabularySpeak
      shouldShowToolbar={this.props.shouldShowToolbar}
      item={item}
      mediaUrlService={this.props.mediaUrlService}
      speech={this.props.speech}
      audio={this.props.audio}
      onMicButtonClick={!this.tapAndHoldToSpeak ? this.handleMicButtonInteraction : undefined}
      onMicButtonTouchStart={this.tapAndHoldToSpeak ? this.handleMicButtonInteraction : undefined}
      onMicButtonTouchEnd={this.tapAndHoldToSpeak ? this.props.speech.stop : undefined}
      onSoundPlayEnded={this.handleSoundPlayEnded}
      onRetry={this.handleAttemptRetry}
      onContinue={this.handleContinueClick}
      onSkip={this.handleSkipClick}
      attempt={this.state.attempt}
      onItemPlaybackCardClick={this.handleItemPlaybackCardClick}
      title={title}
      hasSoundPlayed={hasSoundPlayed}
    />;
  }
}

const mapStateToProps = ({ session, account }) => ({
  learnLanguageBCP47: learnLanguageAlpha3toBCP47(session.learnLanguageAlpha3),
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale,
  shallUserPass: shallUserPass(account.data.uuid)
});

const mapDispatchToProps = {
  track,
  skipItem: sequenceActions.skipItem,
  attemptItem: sequenceActions.attemptItem,
  completeItem: sequenceActions.completeItem
};

VocabularySpeakContainer.propTypes = {
  shouldShowToolbar: PropTypes.bool.isRequired,
  trainer: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  mediaUrlService: PropTypes.any.isRequired,
  audio: audioPropTypes.isRequired,
  speech: speechPropTypes,
  learnLanguageBCP47: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  shallUserPass: PropTypes.bool.isRequired,
  attemptItem: PropTypes.func.isRequired,
  skipItem: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  isMicEnabled: PropTypes.bool,
  currentTrainerItemIndex: PropTypes.number,
  displayInfoText: PropTypes.func.isRequired,
  clearInfoTextUI: PropTypes.func.isRequired
};

VocabularySpeakContainer.defaultProps = {
  currentTrainerItemIndex: 0
};

export default compose(
  withInfoText,
  withServices(['mediaUrlService']),
  withConditionalHOC(
    compose(withSpeech, withSpeechMessages),
    /*
     * If speech engine is supported, and mic is enabled:
     * withSpeech & withSpeechMessages HOC will be added,
     * otherwise they will be left off.
     */
    (props) => Boolean(props.speechEngineName) && props.isMicEnabled
  ),
  withAudio(),
  connect(mapStateToProps, mapDispatchToProps)
)(VocabularySpeakContainer);
