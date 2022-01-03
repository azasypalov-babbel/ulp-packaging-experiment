import React from 'react';
import PropTypes from 'prop-types';
import { StyledFlashCardContainer, StyledButtonGroup, StyledTextWrapper } from './styles';
import languageNameInterpolations from '@lessonnine/pidgin.js/dist/interpolations.js';
import Title from '../../shared/Title';
import FlashCard from './Flashcard/FlashCard';
import Text from '../../shared/Text';
import TextReveal from '../../shared/TextReveal';
import SoundPlayer from '../../shared/SoundPlayer';
import { audioPropTypes } from '../../shared/withAudio';
import IconButton from '../../shared/IconButton/IconButton';
import PlayButton from '../../shared/PlayButton';
import Toolbar from '../../shared/Toolbar';

import { PoseGroup } from 'react-pose';

import * as features from '../../../lib/features';
import StyledTrainerLayout from '../../TrainerLayout';
import withTranslations from '../../shared/withTranslations';
import withShortcutHint from '../../shared/withShortcutHint';

const IconButtonWithHint = withShortcutHint(IconButton);

const initialState = {
  reveal: false,
  known: undefined
};

export class FlashCardTrainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.handleFlashCardClick = this.handleFlashCardClick.bind(this);
    this.renderFlashCard = this.renderFlashCard.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { item } = this.props;
    if (item.id !== prevProps.item.id) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(initialState);
    }
  }

  handleContinueClick(known) {
    const { onContinue, item } = this.props;

    this.setState({ known }, () => {
      onContinue(item, { mistakes: known ? 0 : 2 });
    });
  }

  handleFlashCardClick({ triggerSound }) {
    this.setState({ reveal: true });
    triggerSound && triggerSound();
  }

  renderFlashCard({ triggerSound, ...other } = {}) {
    const { item, mediaUrlService } = this.props;
    const { reveal, known } = this.state;

    const revealPlayButton = triggerSound && reveal;

    return (
      <PoseGroup preEnterPose="preEnter" flipMove={false} animateOnMount>
        <FlashCard
          animationExitLeft={!known}
          key={item.id}
          imageUrl={item.image ? mediaUrlService.imageURL(item.image.id) : ''}
          listenToKey="1"
          onClick={() => this.handleFlashCardClick({ triggerSound })}
          imageChildren={revealPlayButton && <PlayButton {...other} />}
        >
          <StyledTextWrapper>
            <Text
              data-selector="display-language-text"
              textAlign="center"
              color="spaceGray">
              {item.displayLanguageText}
            </Text>
          </StyledTextWrapper>
          <StyledTextWrapper>
            <TextReveal reveal={reveal}>
              <span data-selector="learn-language-text">{item.learnLanguageText}</span>
            </TextReveal>
          </StyledTextWrapper>
        </FlashCard>
      </PoseGroup>
    );
  }

  render() {
    const { item, translations, onToggleShortcuts, audio } = this.props;
    const { title, buttonUnknown, buttonKnown } = translations;
    const { reveal } = this.state;
    return (
      <StyledTrainerLayout>
        <Title data-selector="flashcard-title" fontSize="big">{title}</Title>
        <StyledFlashCardContainer>
          {item.sound ?
            <SoundPlayer
              audio={audio}
              url={this.props.mediaUrlService.soundURL(item.sound.id)}
              render={this.renderFlashCard}
            />
            : this.renderFlashCard()
          }
        </StyledFlashCardContainer>
        <StyledButtonGroup>
          {reveal &&
            <>
              <IconButtonWithHint
                iconName="CrossIcon"
                listenToKey="2"
                negative
                data-solution="No"
                onClick={() => this.handleContinueClick(false)}>
                {buttonUnknown}
              </IconButtonWithHint>
              <IconButtonWithHint
                iconName="CheckIcon"
                listenToKey="3"
                positive
                data-solution="Yes"
                onClick={() => this.handleContinueClick(true)}>
                {buttonKnown}
              </IconButtonWithHint>
            </>
          }
        </StyledButtonGroup>
        {
          !features.isWebview() && (
            <Toolbar>
              <IconButton
                data-selector="reveal-shortcuts-button"
                iconName="KeyboardIcon"
                onClick={onToggleShortcuts}
              />
            </Toolbar>
          )
        }
      </StyledTrainerLayout>
    );
  }
}

FlashCardTrainer.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    sound: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    learnLanguageText: PropTypes.string.isRequired,
    displayLanguageText: PropTypes.string.isRequired
  }),
  mediaUrlService: PropTypes.any.isRequired,
  onContinue: PropTypes.func.isRequired,
  onToggleShortcuts: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    buttonKnown: PropTypes.string.isRequired,
    buttonUnknown: PropTypes.string.isRequired
  }).isRequired,
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  audio: audioPropTypes.isRequired
};

const getTranslations = (translate, { locale, learnLanguageAlpha3 }) => ({
  title: translate('flash_card_trainer.title', languageNameInterpolations({ locale, learnLanguageAlpha3 })),
  buttonUnknown: translate('flash_card_trainer.button_forgot'),
  buttonKnown: translate('flash_card_trainer.button_remember')
});

export default withTranslations(getTranslations)(FlashCardTrainer);
