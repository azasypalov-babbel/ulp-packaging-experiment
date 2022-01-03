import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { formatDL } from '../../../lib/markupFormatter';
import playFeedbackSound, { FEEDBACK_SOUND } from '../../../lib/playFeedbackSound';
import {
  formatParentheses,
  getFirstCorrectSolution,
  removeGapFormatting,
  markupStringToPlainText,
  stripCurlyBracesAndContent
} from '@lessonnine/babbel-markup-helper.js';

import * as sequenceActions from '../../../dux/sequence/actions';
import { track } from '../../../dux/tracker/actions';

import withAudio, { audioPropTypes } from '../../shared/withAudio';
import withSpeech, {
  speechPropTypes,
  recognitionHasEnded,
  recognitionHasError
} from '../../shared/withSpeech';
import { withServices } from '../../shared/withServices';

import { learnLanguageAlpha3toBCP47 } from '../../../lib/languageCodeConverter';
import SpeakingTrainer from './SpeakingTrainer';
import MotivationScreen from './MotivationScreen';

import withSpeechMessages from '../../shared/withSpeechMessages';
import { getLocalStorage } from '../../../lib/localStorage';


const stripParantheses = (text) => text.replace(/(\([\S]+\))/g, '').trim();

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
  learnLanguageText: formatLL(item.learn_language_text),
  displayLanguageText: formatDL(item.display_language_text)
});

const flattenItems = (trainer) => {
  return trainer.item_groups.reduce((acc, group) => {
    return acc.concat(group.items);
  }, []);
};

const SPEAKING_TRAINER_ONBOARDING_COMPLETE_KEY = 'SPEAKING_TRAINER_ONBOARDING_COMPLETE';
const LOCALSTORAGE_NAMESPACE = 'SPEAKING';
const localStorage = getLocalStorage(LOCALSTORAGE_NAMESPACE);

export class SpeakingTrainerContainer extends React.Component {
  constructor(props) {
    super(props);

    const items = flattenItems(props.trainer).map(formatTrainerItem);

    this.state = {
      items,
      attempt: undefined,
      currentIndex: 0,
      userAudioUrl: null,
      onboardingCompleted: localStorage.get(SPEAKING_TRAINER_ONBOARDING_COMPLETE_KEY) === true
    };

    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.handleAttempt = this.handleAttempt.bind(this);
    this.handleSpeechEnd = this.handleSpeechEnd.bind(this);
    this.handleSpeechError = this.handleSpeechError.bind(this);
    this.startSpeech = this.startSpeech.bind(this);
    this.handleAttemptRetry = this.handleAttemptRetry.bind(this);
    this.handleMicButtonClick = this.handleMicButtonClick.bind(this);
    this.handleFeedbackAttemptCardClick = this.handleFeedbackAttemptCardClick.bind(this);
    this.handleItemPlaybackCardClick = this.handleItemPlaybackCardClick.bind(this);
    this.handleOnboardingComplete = this.handleOnboardingComplete.bind(this);
    this.handleSoundPlayEnded = this.handleSoundPlayEnded.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { items } = this.state;
    this.props.onStart({ scorableItemsCount: items.length });
  }

  handleFeedbackAttemptCardClick() {
    if (!this.state.onboardingComplete && this.state.currentIndex === 0) {
      const { track, locale, learnLanguageAlpha3 } = this.props;

      /* eslint-disable camelcase */
      track({
        event: 'gui:interacted',
        version: 1,
        payload: {
          gui_container: 'speaking_trainer',
          gui_element: 'feedback_attempt_card',
          interaction: 'clicked',
          origin: 'lesson_player',
          locale: locale,
          learn_language_alpha3: learnLanguageAlpha3
        }
      });
      /* eslint-enable camelcase */
    }
  }

  componentDidUpdate(prevProps) {
    if (recognitionHasEnded(prevProps.speech, this.props.speech)) this.handleSpeechEnd();
    if (recognitionHasError(prevProps.speech, this.props.speech)) this.handleSpeechError();
  }

  handleItemPlaybackCardClick() {
    if (!this.state.onboardingComplete && this.state.currentIndex === 0) {
      const { track, locale, learnLanguageAlpha3 } = this.props;

      /* eslint-disable camelcase */
      track({
        event: 'gui:interacted',
        version: 1,
        payload: {
          gui_container: 'speaking_trainer',
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

  handleMicButtonClick() {
    this.startSpeech();

    if (!this.state.onboardingCompleted && this.state.currentIndex === 0) {
      const { track, locale, learnLanguageAlpha3 } = this.props;

      /* eslint-disable camelcase */
      track({
        event: 'gui:interacted',
        version: 1,
        payload: {
          gui_container: 'speaking_trainer',
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

  handleSoundPlayEnded() {
    this.startSpeech();
  }

  handleAttemptRetry() {
    this.props.speech.reset();
    this.setState({ attempt: undefined, userAudioUrl: null }, () => {
      this.startSpeech();
    });
  }

  handleContinueClick() {
    const { items, currentIndex } = this.state;
    const item = items[currentIndex];
    const { attempt } = this.state;

    this.props.completeItem(item, attempt.mistakes);

    this.props.speech.reset();

    this.props.audio.stop();
    this.props.userAudio.stop();
    this.props.audio.cleanup();
    this.props.userAudio.cleanup();

    this.setState({ attempt: undefined, userAudioUrl: null });

    if (currentIndex < items.length - 1) {
      const nextIndex = currentIndex + 1;
      this.setState({
        currentIndex: nextIndex
      });
    } else {
      this.props.onFinish();
    }
  }

  handleAttempt(attempt) {
    const { text, solved } = attempt;

    this.setState({
      attempt: {
        text,
        mistakes: solved ? 0 : 2
      }
    });

    return new Promise((resolve) => {
      const options = {
        onEnded: resolve
      };
      playFeedbackSound(FEEDBACK_SOUND.forItemSolved(solved), options);
    });
  }

  startSpeech() {
    const { speech, learnLanguageBCP47, audio, recordingService } = this.props;

    if (audio.isPlaying) audio.stop();

    const { items, currentIndex } = this.state;
    const item = items[currentIndex];

    if (!(speech.listening || speech.recording)) {
      recordingService.start()
        .then((userAudioUrl) => {
          this.setState({ userAudioUrl });
        });

      speech.start({
        interimResults: true,
        lang: learnLanguageBCP47,
        continuous: true,
        targetText: item.learnLanguageText,
        itemUuid: item.id
      });
    }
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

  handleSpeechEnd() {
    const {
      speech: {
        transcript,
        solved,
        error
      }
    } = this.props;

    this.props.recordingService.stop();

    if (!transcript || error) return;

    const { items, currentIndex } = this.state;
    const item = items[currentIndex];

    this.handleAttempt({ text: transcript, solved }).then(() => {
      const { audio, mediaUrlService } = this.props;
      const itemSoundUrl = mediaUrlService.soundURL(item.sound.id, 'mp3');
      // play only if the user is still on the same item
      if (solved && this.state.currentIndex === currentIndex) {
        audio.playSoundWithState(itemSoundUrl);
      }
    });

    this.props.attemptItem(item, {
      text: transcript,
      solved
    });
  }

  handleOnboardingComplete() {
    this.setState({
      onboardingCompleted: true
    });
    localStorage.set(SPEAKING_TRAINER_ONBOARDING_COMPLETE_KEY, true);
  }

  render() {
    if (this.state.currentIndex === 1 && !this.state.onboardingCompleted) {
      return <MotivationScreen onFinish={this.handleOnboardingComplete} />;
    }

    const { items, currentIndex } = this.state;
    const item = items[currentIndex];

    return (
      <SpeakingTrainer
        item={item}
        mediaUrlService={this.props.mediaUrlService}
        recordingService={this.props.recordingService}
        speech={this.props.speech}
        audio={this.props.audio}
        attempt={this.state.attempt}
        onMicButtonClick={this.handleMicButtonClick}
        onSoundPlayEnded={this.handleSoundPlayEnded}
        onContinue={this.handleContinueClick}
        onRetry={this.handleAttemptRetry}
        userAudioUrl={this.state.userAudioUrl}
        userAudio={this.props.userAudio}
        onFeedbackAttemptCardClick={this.handleFeedbackAttemptCardClick}
        onItemPlaybackCardClick={this.handleItemPlaybackCardClick}
      />
    );
  }
}

SpeakingTrainerContainer.propTypes = {
  learnLanguageAlpha3: PropTypes.string.isRequired,
  learnLanguageBCP47: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  trainer: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  mediaUrlService: PropTypes.any.isRequired,
  recordingService: PropTypes.any.isRequired,
  speech: speechPropTypes.isRequired,
  track: PropTypes.func.isRequired,
  audio: audioPropTypes,
  userAudio: audioPropTypes,
  attemptItem: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired
};

export const mapStateToProps = ({ session, permissions }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  learnLanguageBCP47: learnLanguageAlpha3toBCP47(session.learnLanguageAlpha3),
  locale: session.locale,
  micPermission: permissions.micPermission
});

const mapDispatchToProps = {
  completeItem: sequenceActions.completeItem,
  attemptItem: sequenceActions.attemptItem,
  track
};

export default compose(
  withServices(['mediaUrlService', 'recordingService']),
  withAudio(),
  withAudio({ name: 'userAudio' }),
  withSpeech,
  withSpeechMessages,
  connect(mapStateToProps, mapDispatchToProps)
)(SpeakingTrainerContainer);
