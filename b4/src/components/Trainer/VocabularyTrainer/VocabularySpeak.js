import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { rem } from 'polished';
import styled from 'styled-components';

import * as features from '../../../lib/features';

import FeedbackSheet from '../../shared/FeedbackSheet/FeedbackSheet';
import ItemPlaybackCard from '../../shared/ItemPlaybackCard';
import SpeechMicButton from './SpeechMicButton';
import SoundPlayer from '../../shared/SoundPlayer';
import InteractionToggleToolbar from '../../shared/SpeechRecognition/InteractionToggleToolbar';
import StyledTrainerLayout from '../../TrainerLayout';
import withTranslations from '../../shared/withTranslations';
import pickRandom from '../../../lib/pickRandom';
import ContinueSheet from '../../ContinueSheet';
import Title from '../../shared/Title';
import HighlightedText from '../../shared/FeedbackSheet/HighlightedText';

const isCorrectAttempt = (attempt) => attempt.mistakes === 0;

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0 1rem;
  margin: 0 auto;

  max-width: ${rem(732)};
  width: 100%;

  box-sizing: border-box;

  height: 100%;

  ${() => {
    if (features.isWebview()) {
      return 'user-select: none;';
    }
  }};
`;

const StyledItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  height: 100%;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex: inherit;
    height: auto;
    margin: 0 0 2.5rem 0;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    ${() => {
    if (features.isWebview()) {
      return 'margin: 0';
    }
  }};
  }
`;

const StyledImage = styled.img`
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  width: 140px;
  height: 140px;
  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

export class VocabularySpeak extends Component {
  constructor(props) {
    super(props);

    this.renderSoundPlayer = this.renderSoundPlayer.bind(this);
    this.renderSpeechMicButton = this.renderSpeechMicButton.bind(this);
    this.renderFeedbackSheet = this.renderFeedbackSheet.bind(this);
    this.micButtonRef = createRef();
  }

  componentDidUpdate({ attempt, speech, audio }) {
    if ((speech && !attempt) && (!audio.isEnded && this.props.audio.isEnded)) {
      this.micButtonRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  renderFeedbackSheet() {
    const { attempt, translations } = this.props;

    if (this.props.speech) {
      const isCorrect = isCorrectAttempt(attempt);
      const feedbackMessage = isCorrect
        ? translations.attemptFeedback.positiveFeedback
        : translations.attemptFeedback.negativeFeedback;

      const feedbackDetail = (!isCorrect && attempt.text)
        ?
        <HighlightedText appearance="NEGATIVE">
          {attempt.text}
        </HighlightedText>
        : null;

      const onTryAgainClick = isCorrect ? null : this.props.onRetry;
      const onContinueClick = isCorrect ? this.props.onContinue : this.props.onSkip;

      return (
        <FeedbackSheet
          key="feedback-sheet"
          feedbackMessage={feedbackMessage}
          feedbackDetail={feedbackDetail}
          onContinueClick={onContinueClick}
          onTryAgainClick={onTryAgainClick}
        />
      );
    } else {
      return (
        <ContinueSheet
          key="continue-sheet"
          onClick={this.props.onContinue}
        />
      );
    }
  }

  renderTitle() {
    const { translations, title } = this.props;
    const titleProps = {
      'data-selector': 'title',
      textAlign: 'center',
      fontFamily: 'fontMilliardSemi',
      color: 'spaceGray',
      fontSize: 'big'
    };

    return (
      title ?
        <Title
          {...titleProps}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        :
        <Title
          {...titleProps}
        >
          {translations.trainerTitle}
        </Title>
    );
  }

  renderItem() {
    const {
      item,
      mediaUrlService,
      audio,
      attempt,
      onSoundPlayEnded
    } = this.props;

    const imageUrl = item.image ? mediaUrlService.imageURL(item.image.id, '200x200') : '';

    const audioUrl = mediaUrlService.soundURL(item.sound.id);
    const onSoundEnded = attempt ? () => {} : onSoundPlayEnded;

    return (
      <>
        {imageUrl ? <StyledImage src={imageUrl} /> : null}
        <SoundPlayer
          playOnMount
          key={`item-sound${item.id}`}
          audio={audio}
          url={audioUrl}
          render={this.renderSoundPlayer}
          onEnded={onSoundEnded}
          onError={onSoundEnded}
        />
      </>
    );
  }

  renderSpeechMicButton() {
    const {
      onMicButtonClick,
      onMicButtonTouchStart,
      onMicButtonTouchEnd,
      hasSoundPlayed,
      speech: {
        permissionsGranted,
        listening,
        recording
      },
      attempt,
      translations
    } = this.props;

    return (
      <SpeechMicButton
        ref={this.micButtonRef}
        visible={!attempt}
        isListening={listening}
        isRecording={recording}
        onMicButtonTouchEnd={onMicButtonTouchEnd}
        onMicButtonTouchStart={onMicButtonTouchStart}
        onMicButtonClick={onMicButtonClick}
        isMicEnabled={hasSoundPlayed && permissionsGranted}
        translations={translations}
      />
    );
  }

  renderSoundPlayer(props) {
    const { speech, item, onItemPlaybackCardClick, attempt } = this.props;
    const isCorrect = speech && attempt && isCorrectAttempt(attempt);

    const triggerSound = () => {
      if (speech) {
        speech.stop();
      }
      props.triggerSound();
      onItemPlaybackCardClick();
    };

    return (
      <ItemPlaybackCard
        positive={isCorrect}
        {...item}
        {...props}
        onClick={triggerSound}
      />
    );
  }

  render() {
    const { attempt, shouldShowToolbar, speech } = this.props;
    const showMicButton = speech;

    return (
      <>
        <StyledTrainerLayout>
          <StyledWrapper data-trainer-type="vocabulary" data-interaction-type="speak">
            {this.renderTitle()}
            <StyledItemWrapper>
              {this.renderItem()}
            </StyledItemWrapper>
            <div>
              {showMicButton && this.renderSpeechMicButton()}
            </div>
          </StyledWrapper>
        </StyledTrainerLayout>
        {shouldShowToolbar && !attempt && <InteractionToggleToolbar />}
        {attempt && this.renderFeedbackSheet()}
      </>
    );
  }
}

VocabularySpeak.propTypes = {
  shouldShowToolbar: PropTypes.bool.isRequired,
  onRetry: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  attempt: PropTypes.object,
  translations: PropTypes.shape({
    micButton: PropTypes.shape({
      pressToSpeak: PropTypes.string.isRequired,
      tapToSpeak: PropTypes.string.isRequired,
      speak: PropTypes.string.isRequired
    }).isRequired,
    trainerTitle: PropTypes.string.isRequired,
    attemptFeedback: PropTypes.shape({
      negativeFeedback: PropTypes.string.isRequired,
      positiveFeedback: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  title: PropTypes.string,
  item: PropTypes.object,
  mediaUrlService: PropTypes.object.isRequired,
  audio: PropTypes.object.isRequired,
  onSoundPlayEnded: PropTypes.func.isRequired,
  onMicButtonClick: PropTypes.func,
  onMicButtonTouchStart: PropTypes.func,
  onMicButtonTouchEnd: PropTypes.func,
  hasSoundPlayed: PropTypes.bool,
  speech: PropTypes.object,
  onItemPlaybackCardClick: PropTypes.func.isRequired
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

export default withTranslations(getTranslations)(VocabularySpeak);
