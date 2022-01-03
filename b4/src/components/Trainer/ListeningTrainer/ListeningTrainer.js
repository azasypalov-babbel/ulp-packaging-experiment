import React from 'react';
import PropTypes from 'prop-types';

import ChoiceList from './ChoiceList/ChoiceList';
import SoundPlayer from '../../shared/SoundPlayer';
import FeedbackSheet from '../../shared/FeedbackSheet/FeedbackSheet';
import { audioPropTypes } from '../../shared/withAudio';
import Title from '../../shared/Title';
import Toolbar from '../../shared/Toolbar';
import TrainerLayout from './TrainerLayout';
import IconButton from '../../shared/IconButton/IconButton';
import HighlightedText from '../../shared/FeedbackSheet/HighlightedText';

const isCorrectAttempt = (attempt) => attempt.mistakes === 0;

const getFeedbackMessage = (attemptFeedback, correct) =>
  correct ? attemptFeedback.positiveFeedback : attemptFeedback.negativeFeedback;

export class ListeningTrainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleChoiceItemClick = this.handleChoiceItemClick.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
  }

  handleChoiceItemClick(attemptedText, evt = {}) {
    const keyboardTriggered = evt.type !== 'click';
    const { attempt, item, onChoiceItemClick } = this.props;

    if (!attempt) {
      const itemText = item.displayLanguageText;
      const mistakes = (attemptedText === itemText) ? 0 : 2;

      onChoiceItemClick({
        mistakes,
        text: attemptedText
      }, keyboardTriggered);
    }
  }

  handleContinueClick() {
    const { attempt, onContinue, item } = this.props;

    if (!attempt) {
      // prevent user from clicking continue button several times
      return;
    }

    onContinue(item, attempt.mistakes);
  }

  render() {
    const {
      onSoundPlayerEnded,
      onSoundPlayerError,
      attempt,
      showChoiceItems,
      item,
      choiceItemsList,
      audio,
      onToggleShortcuts,
      translations
    } = this.props;

    const correctText = item.displayLanguageText;
    const choiceItemsTextList = choiceItemsList.map((item) => item.displayLanguageText);

    const highlightedText = (
      <div data-selector="learn-language-text">
        <HighlightedText appearance="POSITIVE">
          {item.learnLanguageText}
        </HighlightedText>
      </div>
    );

    return (
      <div>
        <TrainerLayout
          top={
            <>
              <Title data-selector="listening-title" fontSize="big">{translations.instruction}</Title>
              <SoundPlayer
                key={this.props.item.id}
                onEnded={onSoundPlayerEnded}
                onError={onSoundPlayerError}
                playOnMount
                audio={audio}
                url={this.props.mediaUrlService.soundURL(item.sound.id)}
              />
            </>
          }
          bottom={
            <ChoiceList
              showChoiceItems={showChoiceItems}
              items={choiceItemsTextList}
              attemptedText={attempt && attempt.text}
              correctText={correctText}
              onClick={this.handleChoiceItemClick}
            />
          }
        />
        {!attempt &&
          <Toolbar>
            <IconButton
              data-selector="reveal-shortcuts-button"
              iconName="KeyboardIcon"
              onClick={onToggleShortcuts}
            />
          </Toolbar>
        }
        {attempt &&
          <FeedbackSheet
            data-gap-feedback={true}
            data-solved={isCorrectAttempt(attempt)}
            data-mistaken={!isCorrectAttempt(attempt)}
            key="feedback-sheet"
            feedbackMessage={getFeedbackMessage(translations.attemptFeedback, isCorrectAttempt(attempt))}
            feedbackDetail={highlightedText}
            onContinueClick={this.handleContinueClick}
          />
        }
      </div>
    );
  }
}

ListeningTrainer.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sound: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    learnLanguageText: PropTypes.string.isRequired,
    displayLanguageText: PropTypes.string.isRequired
  }),
  choiceItemsList: PropTypes.array.isRequired,
  onContinue: PropTypes.func.isRequired,
  onChoiceItemClick: PropTypes.func.isRequired,
  audio: audioPropTypes.isRequired,
  attempt: PropTypes.shape({
    mistakes: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }),
  mediaUrlService: PropTypes.shape({
    soundURL: PropTypes.func.isRequired
  }).isRequired,
  showChoiceItems: PropTypes.bool.isRequired,
  onSoundPlayerEnded: PropTypes.func.isRequired,
  onSoundPlayerError: PropTypes.func.isRequired,
  onToggleShortcuts: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    attemptFeedback: PropTypes.shape({
      negativeFeedback: PropTypes.string.isRequired,
      positiveFeedback: PropTypes.string.isRequired
    }).isRequired,
    continueBtn: PropTypes.string.isRequired,
    instruction: PropTypes.string.isRequired
  }).isRequired
};

import pickRandom from '../../../lib/pickRandom';
import withTranslations from '../../shared/withTranslations';

const getTranslations = (translate, props, instanceId) => {
  const positiveFeedbackMessages = [
    'listening_trainer.feedback.positive.1',
    'listening_trainer.feedback.positive.2',
    'listening_trainer.feedback.positive.3',
    'listening_trainer.feedback.positive.4',
    'listening_trainer.feedback.positive.5',
    'listening_trainer.feedback.positive.6'
  ].map(translate);
  const negativeFeedbackMessages = [
    'listening_trainer.feedback.negative.1',
    'listening_trainer.feedback.negative.2',
    'listening_trainer.feedback.negative.3',
    'listening_trainer.feedback.negative.4',
    'listening_trainer.feedback.negative.5'
  ].map(translate);

  return {
    attemptFeedback: {
      positiveFeedback: pickRandom(positiveFeedbackMessages, instanceId),
      negativeFeedback: pickRandom(negativeFeedbackMessages, instanceId)
    },
    continueBtn: translate('listening_trainer.button.continue'),
    instruction: translate('listening_trainer.instruction.listen')
  };
};

export default withTranslations(getTranslations)(ListeningTrainer);
