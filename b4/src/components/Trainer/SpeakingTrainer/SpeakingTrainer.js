import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from '../../shared/Text';
import { StyledWrapper } from './styles';
import Title from '../../shared/Title';
import SoundPlayer from '../../shared/SoundPlayer';
import { audioPropTypes } from '../../shared/withAudio';
import MicButton from '../../shared/MicButton/MicButton';
import { speechPropTypes } from '../../shared/withSpeech';
import ItemPlaybackCard from '../../shared/ItemPlaybackCard';
import FeedbackAttemptCard from '../../shared/FeedbackAttemptCard';
import FeedbackSheet from '../../shared/FeedbackSheet/FeedbackSheet';
import { replaceMatches } from '../../../lib/matchingUtils/normalise';
import StyledTrainerLayout from '../../TrainerLayout';
import pickRandom from '../../../lib/pickRandom';
import withTranslations from '../../shared/withTranslations';

const StyledUserInteractionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledMicButtonWrapper = styled.div`
  margin: 1rem;
`;

const isCorrectAttempt = (attempt) => attempt.mistakes < 1;

export class SpeakingTrainer extends Component {
  constructor() {
    super();
    this.renderSoundPlayer = this.renderSoundPlayer.bind(this);
    this.renderUserSoundPlayer = this.renderUserSoundPlayer.bind(this);
    this.handleSoundPlayEnded = this.handleSoundPlayEnded.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.state = {
      isUserAllowedToSpeak: false
    };
  }

  handleSoundPlayEnded() {
    const { isUserAllowedToSpeak } = this.state;
    if (!isUserAllowedToSpeak) {
      this.props.onSoundPlayEnded();
      this.setState({
        isUserAllowedToSpeak: true
      });
    }
  }

  handleContinueClick() {
    this.setState({
      isUserAllowedToSpeak: false
    }, () => this.props.onContinue());
  }

  renderSoundPlayer(props) {
    const { speech, recordingService, onItemPlaybackCardClick, item } = this.props;

    const triggerSound = () => {
      if (speech.listening || speech.recording) {
        recordingService.stop();
        speech.stop();
      }
      props.triggerSound();
      onItemPlaybackCardClick();
    };

    return (
      <ItemPlaybackCard
        {...item}
        {...props}
        onClick={triggerSound}
      />
    );
  }

  renderUserSoundPlayer(props) {
    const {
      speech: { transcript, lookupTableEntries },
      attempt,
      item,
      onFeedbackAttemptCardClick
    } = this.props;

    const triggerSound = () => {
      props.triggerSound();
      onFeedbackAttemptCardClick();
    };

    return (
      <FeedbackAttemptCard
        {...props}
        positive={isCorrectAttempt(attempt)}
        negative={!isCorrectAttempt(attempt)}
        onClick={triggerSound}
      >
        {isCorrectAttempt(attempt)
          ? item.learnLanguageText
          : replaceMatches(transcript, lookupTableEntries)}
      </FeedbackAttemptCard>
    );
  }

  renderFeedbackSheet() {
    const { onRetry, attempt, translations } = this.props;
    const isCorrect = isCorrectAttempt(attempt);

    const feedbackMessage = isCorrect
      ? translations.attemptFeedback.positiveFeedback
      : translations.attemptFeedback.negativeFeedback;
    const retryHandler = !isCorrect ? onRetry : null;

    return (
      <FeedbackSheet
        key="feedback-sheet"
        feedbackMessage={feedbackMessage}
        onContinueClick={this.handleContinueClick}
        onTryAgainClick={retryHandler}
      />
    );
  }

  render() {
    const {
      item,
      onMicButtonClick,
      attempt,
      speech: {
        listening,
        recording,
        ended
      },
      audio,
      userAudio,
      userAudioUrl,
      translations
    } = this.props;

    const showUserAttempt = attempt && userAudioUrl;

    const { isUserAllowedToSpeak } = this.state;

    const shouldRenderSpeakNowLabel = isUserAllowedToSpeak && (listening || recording);
    const shouldRenderClickToSpeakLabel = isUserAllowedToSpeak && !(listening || recording) && ended;

    return (
      <StyledTrainerLayout
        data-trainer-type="spokenreview"
        data-interaction-type="speak"
      >
        <StyledWrapper>
          <Title fontSize="big">{translations.trainerTitle}</Title>
          <StyledUserInteractionWrapper>
            <SoundPlayer
              playOnMount
              key={item.id}
              audio={audio}
              url={this.props.mediaUrlService.soundURL(item.sound.id)}
              render={this.renderSoundPlayer}
              onEnded={this.handleSoundPlayEnded}
              onError={this.handleSoundPlayEnded}
            />

            {showUserAttempt && (
              <SoundPlayer
                audio={userAudio}
                url={userAudioUrl}
                render={this.renderUserSoundPlayer}
              />
            )}
            {!attempt &&
              <>
                <StyledMicButtonWrapper>
                  <MicButton
                    isListening={listening}
                    isUserSpeaking={recording}
                    onClick={onMicButtonClick}
                    disabled={!isUserAllowedToSpeak}
                  />
                </StyledMicButtonWrapper>
                <Text fontFamily="fontMilliardMedium" color="spaceGrayW15" fontSize="base">
                  {shouldRenderSpeakNowLabel && translations.micButton.speak}
                  {shouldRenderClickToSpeakLabel && translations.micButton.pressToSpeak}
                </Text>
              </>}
          </StyledUserInteractionWrapper>
          {attempt && this.renderFeedbackSheet()}
        </StyledWrapper>
      </StyledTrainerLayout>
    );
  }
}

SpeakingTrainer.propTypes = {
  onRetry: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sound: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    learnLanguageText: PropTypes.string.isRequired,
    displayLanguageText: PropTypes.string.isRequired
  }).isRequired,
  recordingService: PropTypes.any.isRequired,
  mediaUrlService: PropTypes.shape({
    soundURL: PropTypes.func.isRequired
  }).isRequired,
  onMicButtonClick: PropTypes.func,
  attempt: PropTypes.shape({
    mistakes: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }),
  audio: audioPropTypes.isRequired,
  speech: speechPropTypes.isRequired,
  onContinue: PropTypes.func.isRequired,
  userAudioUrl: PropTypes.object,
  userAudio: audioPropTypes,
  translations: PropTypes.shape({
    micButton: PropTypes.shape({
      pressToSpeak: PropTypes.string.isRequired,
      speak: PropTypes.string.isRequired
    }).isRequired,
    trainerTitle: PropTypes.string.isRequired,
    attemptFeedback: PropTypes.shape({
      negativeFeedback: PropTypes.string.isRequired,
      positiveFeedback: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onFeedbackAttemptCardClick: PropTypes.func.isRequired,
  onItemPlaybackCardClick: PropTypes.func.isRequired,
  onSoundPlayEnded: PropTypes.func
};

const getTranslations = (translate, props, instanceId) => {
  const positiveFeedbackMessages = [
    'speech_recognition.feedback.positive.1',
    'speech_recognition.feedback.positive.2',
    'speech_recognition.feedback.positive.3'
  ].map(translate);

  return {
    trainerTitle: translate('speech_recognition.trainer_item.title'),
    micButton: {
      pressToSpeak: translate('speech_recognition.mic_button.press_to_speak'),
      tapToSpeak: translate('speech_recognition.mic_button.tap_to_speak'),
      speak: `${translate('speech_recognition.mic_button.speak')}...`
    },
    attemptFeedback: {
      positiveFeedback: pickRandom(positiveFeedbackMessages, instanceId),
      negativeFeedback: translate('speech_recognition.feedback.negative.1')
    }
  };
};

SpeakingTrainer.defaultProps = {
  onSoundPlayEnded: () => { }
};

export default withTranslations(getTranslations)(SpeakingTrainer);
