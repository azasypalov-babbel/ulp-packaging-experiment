import PropTypes from 'prop-types';
import { markupStringToHTML } from '@lessonnine/babbel-markup-helper.js';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import withTranslations from '../../shared/withTranslations';
import StyledTrainerLayout from '../../TrainerLayout';
import TranslationVisibilityToggle from '../shared/TranslationVisibilityToggle';
import Text from '../../shared/Text';
import TrainerTitle from '../shared/TrainerTitle';

import {
  StyledImage,
  StyledTextWrapper,
  StyledWrapper
} from './styles';
import { scrollIntoSafeArea } from '../../shared/scrollIntoSafeArea';
import { TrainerPlayButton } from './TrainerPlayButton';
import { useAutoRateSoundPlayer } from '../shared/useAutoRateSoundPlayer';
import { TRAINER_STATE } from './constants';
import { ServiceContext } from '../../shared/withServices';
import { checks, PlayStates } from '../../../services/soundService';

export const VocabularyTrainer = ({
  item,
  dictate,
  trainerState,
  onSoundPlayComplete,
  onToggleTranslationVisibility,
  title,
  interaction,
  interactionType,
  translations,
  translationVisibility,
  translationVisible
}) => {
  const { mediaUrlService, focusService } = useContext(ServiceContext);
  const audioUrl = item.sound?.id && mediaUrlService.soundURL(item.sound.id);
  const imageUrl = item.image?.id && mediaUrlService.imageURL(
    item.image.id, '200x200'
  );
  const ref = useRef();
  const {
    getDuration,
    play,
    playAutoRate,
    getState,
    reset,
    isSlowPlayback
  } = useAutoRateSoundPlayer(audioUrl);
  const playState = getState ? getState() : PlayStates.STOPPED;
  const duration = getDuration ? getDuration() : 0;
  const handleClick = useCallback(() => {
    focusService.returnFocus();
    playAutoRate();
  }, [focusService, playAutoRate]);
  // if 2 subsequent items have the same url
  // after finishing one item the state remains completed
  // so we need to reset the sound state whenever we get a new one
  useEffect(() => {
    reset();
  }, [item, reset]);

  const active = trainerState === TRAINER_STATE.READY;
  const waitSound = trainerState === TRAINER_STATE.AWAITING_SOUND_PLAY;
  useEffect(() => {
    if (active) {
      scrollIntoSafeArea(ref.current);
      if (dictate) {
        // autoplay sound on mount for dictate
        play({ skipOnFreeze: true });
      }
    }
    if (waitSound && !dictate) {
      // play sound after complete for vocab
      play({ skipOnFreeze: true });
    }
  }, [trainerState, dictate, play]);
  useEffect(() => {
    if (checks.hasPlayed(playState)) onSoundPlayComplete();
  }, [playState, onSoundPlayComplete]);

  const renderImage = () => {
    if (!imageUrl) {
      return null;
    }
    return (
      <StyledImage
        src={imageUrl}
        data-selector={audioUrl ? 'image-with-sound' : 'image-without-sound'}
        onClick={handleClick}
      />
    );
  };

  const renderSoundPlayer = () => {
    return (
      <TrainerPlayButton
        playSound={handleClick}
        isPlaying={playState === PlayStates.PLAYING}
        isSlowPlayback={isSlowPlayback}
        duration={duration}
      />
    );
  };

  const itemTranslation = <Text
    data-selector="item-translation"
    as="p"
    className="item-translation"
    color="spaceGrayW28"
    fontSize="base"
    dangerouslySetInnerHTML={{ __html: markupStringToHTML(item.displayLanguageText) }}
  />;

  const isCompleted = trainerState !== TRAINER_STATE.READY;
  const translationVisibleWithDictate = dictate ? isCompleted && translationVisible : translationVisible;
  const showTranslation = translationVisibility === 'partial' ? translationVisible : translationVisibleWithDictate;
  const trainerTitleKey = dictate ? `dictate${interactionType}` : interactionType;
  // vocabulary trainer has only phrase items
  return (
    <>
      <TranslationVisibilityToggle
        translationVisibility={translationVisibility}
        onClick={onToggleTranslationVisibility}
      />
      <StyledTrainerLayout ref={ref}>
        <StyledWrapper data-selector={`vocabulary-${interactionType}`}>
          <TrainerTitle text={title || translations.trainerTitle[trainerTitleKey]} />
          {dictate ? renderSoundPlayer() : renderImage()}
          <StyledTextWrapper>
            <div data-item-type="phrase">
              <div data-selector="interactive">
                {interaction}
              </div>
            </div>
          </StyledTextWrapper>
          {showTranslation && itemTranslation}
        </StyledWrapper>
      </StyledTrainerLayout>
    </>
  );
};

VocabularyTrainer.propTypes = {
  item: PropTypes.object.isRequired,
  dictate: PropTypes.bool.isRequired,
  trainerState: PropTypes.oneOf(Object.values(TRAINER_STATE)).isRequired,
  translationVisibility: PropTypes.string.isRequired,
  translations: PropTypes.shape({
    trainerTitle: PropTypes.shape({
      fillin: PropTypes.string.isRequired,
      puzzlehelper: PropTypes.string.isRequired,
      wordorder: PropTypes.string.isRequired
    })
  }).isRequired,
  title: PropTypes.string,
  interactionType: PropTypes.string.isRequired,
  interaction: PropTypes.node.isRequired,
  onSoundPlayComplete: PropTypes.func.isRequired,
  onToggleTranslationVisibility: PropTypes.func.isRequired,
  translationVisible: PropTypes.bool.isRequired
};

const getTranslations = (translate) => {
  const writeTranslationKey = 'b3.page_vocabulary_gap.type_the_missing_characters';
  return {
    trainerTitle: {
      dictatefillin: translate('b3.page_dictate.title'),
      dictatepuzzlehelper: translate('b3.page_dictate.title'),
      dictatechoose: translate('b3.page_dictate.choice_title'),
      dictatewordorder: translate('b3.page_dictate.word_order_title'),
      fillin: translate(writeTranslationKey),
      puzzlehelper: translate(writeTranslationKey),
      choose: translate('b3.page_card.title_choicebuttons'),
      wordorder: translate('b3.vocabulary_word_order.click_on_the_parts_of_the_sentence_in_the_correct_order')
    }
  };
};

export default withTranslations(getTranslations)(VocabularyTrainer);
