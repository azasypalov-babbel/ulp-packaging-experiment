import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { StyledMatchingItem, StyledMatchingItemWrapper, StyledToggleContainer, StyledText } from './styles';
import withAnimations from '../../../shared/withAnimations';
import { APPEARANCE_TYPE } from './constants';
import { ITEM_FRAGMENT_TYPE } from '../constants';
import ToolTip from '../../../shared/ToolTip';
import TranslationToggleInline from '../../../shared/TranslationToggleInline';
import { useSoundPlayer } from '../../shared/useSoundPlayer';
import { ServiceContext } from '../../../shared/withServices';

export const MATCHING_ITEM_WRAPPER_ID = 'matching-item-wrapper';

export const MatchingItem = React.forwardRef((props, ref) => {
  const {
    appearance,
    isClickable,
    id,
    isHidden,
    isMatched,
    isOption,
    itemText,
    onOptionClick,
    order,
    position,
    tooltipPosition,
    trainerActive,
    translation,
    showTranslation,  /* this is the translation visibility field coming from CAT */
    soundId,
    ...rest
  } = props;

  const { mediaUrlService } = useContext(ServiceContext);
  const audioUrl = soundId && mediaUrlService.soundURL(soundId)
  const { play } = useSoundPlayer(audioUrl);
  const [translationVisible, setTranslationVisible] = useState(false);
  const showTranslationToggle = showTranslation && translation && isOption;
  const style = { order };

  const handleClick = !isOption && !isMatched ? null : () => {
    // without the clickable here, the trainer can get stuck when one does wild clicking
    if (!isClickable) { return; }
    if (isMatched && soundId) play();
    if (isOption && !isMatched) onOptionClick(id);
  }

  const styledMatchingItem = (
    <StyledMatchingItem
      appearance={appearance}
      position={position}
      isMatched={isMatched}
      disabled={!isClickable}
      onClick={handleClick}
      trainerActive={trainerActive}
      translationAndTrainerInactive={translation && !trainerActive}
      data-selector={MATCHING_ITEM_WRAPPER_ID}
      data-item-type={isOption ? "option" : "base"}
      data-clickable-item={isClickable}
      data-matched-item={isMatched}
    >
      <StyledText
        fontFamily="fontMilliardBook"
        color="spaceGray"
        translationAndTrainerInactive={translation && !trainerActive}
        dangerouslySetInnerHTML={{ __html: itemText }}
        {...rest}
      />
      {showTranslationToggle &&
        <StyledToggleContainer
          trainerActive={trainerActive}
          isMatched={isMatched}
        >
          <TranslationToggleInline onClick={setTranslationVisible} translationVisible={translationVisible} />
        </StyledToggleContainer>
      }
    </StyledMatchingItem>
  );

  return (
    <StyledMatchingItemWrapper
      ref={ref}
      style={style}
      trainerActive={trainerActive}
      appearance={appearance}
      isMatched={isMatched}
      isHidden={isHidden}
      position={position}
    >
      {translation ?
        <ToolTip
          text={translation}
          position={tooltipPosition}
          visible={translationVisible}
          isInline
        >
          {styledMatchingItem}
        </ToolTip>
        : styledMatchingItem
      }
    </StyledMatchingItemWrapper>
  );
});

MatchingItem.displayName = 'MatchingItem';

MatchingItem.propTypes = {
  appearance: PropTypes.oneOf(Object.values(APPEARANCE_TYPE)),
  isClickable: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isHidden: PropTypes.bool,
  isMatched: PropTypes.bool,
  isOption: PropTypes.bool,
  itemText: PropTypes.string.isRequired,
  onOptionClick: PropTypes.func,
  order: PropTypes.number,
  position: PropTypes.oneOf(Object.values(ITEM_FRAGMENT_TYPE)).isRequired,
  showTranslation: PropTypes.bool.isRequired,
  soundId: PropTypes.string,
  tooltipPosition: ToolTip.propTypes.position,
  trainerActive: PropTypes.bool,
  translation: PropTypes.string
};

export const flipMoveDuration = 250;

// @todo timings to be tweaked before final release
export default withAnimations({
  flip: {
    transition: {
      default: {
        type: 'tween',
        duration: flipMoveDuration
      }
    }
  },
  enter: {
    opacity: 1,
    delay: flipMoveDuration
  },
  exit: {
    opacity: 0,
    transition: {
      duration: flipMoveDuration
    }
  }
})(MatchingItem);
