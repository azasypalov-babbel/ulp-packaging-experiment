import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { markupStringToHTML, getFirstCorrectSolution } from '@lessonnine/babbel-markup-helper.js';
import rollbar from '../../../services/rollbarService';

import { useTheme } from '../../../providers/theme.js';
import styled from 'styled-components';
import { rem } from 'polished';
import MessageBlock from './MessageBlock';
import ContextualInfo from '../../shared/ContextualInfo';

import withTranslations from '../../shared/withTranslations';
import StyledTrainerLayout from '../../TrainerLayout';
import TranslationVisibilityToggle from '../shared/TranslationVisibilityToggle';
import TrainerTitle from '../shared/TrainerTitle';

import getComponentFromInteractionType from '../../../lib/getComponentFromInteractionType';
import usePositionMap from './usePositionMap';
import useItemGrouping from './useItemGrouping';
import Text from '../../shared/Text';
import { isInteractive, isTask } from '../../shared/itemSelectors';
import { useBackgroundColor } from '../../shared/hooks/useBackgroundColor';


const StyledWrapper = styled.div`
  margin: 0 auto;
  max-width: ${rem('700px')};
  padding: 0 ${rem('16px')};
  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xxsmall}) {
    padding: 0 ${rem('24px')};
  }
  & > * + * {
    margin-top: ${rem('12px')};
    scroll-padding: ${rem('12px')};
  }
`;

const StyledContextualInfoWrapper = styled.div`
  &:not(:first-of-type) {
    margin-top: ${rem('24px')};
  }
`;

export const DialogTrainer = ({
  active,
  visibleItems: items,
  currentItem,
  learnLanguageAlpha3,
  onAttempt,
  onItemComplete,
  onToggleTranslationVisibility,
  playItemSound,
  isItemSoundPlaying,
  title,
  interaction,
  translations,
  translationVisibility,
  translationVisible
}) => {
  useEffect(() => {
    if (!currentItem.learnLanguageText && !currentItem.displayLanguageText) {
      rollbar.warning('Dialog Trainer: item with no text', { item: currentItem });
    }
  }, [currentItem]);

  const theme = useTheme();
  useBackgroundColor(theme.cascada.iceGrayW50);

  const Interaction = getComponentFromInteractionType(interaction);

  const { isFirstInGroup, getItemsInGroup } = useItemGrouping(items);
  const [getPosition] = usePositionMap(items);

  const renderRowContent = (item) => {
    const isActiveItem = active && item === currentItem;
    if (isTask(item)) {
      if (!item.displayLanguageText) return null;

      return (
        <StyledContextualInfoWrapper key={item.id}>
          <ContextualInfo
            active={isActiveItem}
            dataItemType={item.type}
            markupString={item.displayLanguageText} />
        </StyledContextualInfoWrapper>
      );
    } else {
      const hideItemWhileActive = isInteractive(item) && isActiveItem && interaction === 'speak';
      return (
        <MessageBlock
          key={item.id}
          dataItemType={item.type}
          hasAvatar={isFirstInGroup(item)}
          avatarIsSpeaking={getItemsInGroup(item).some(isItemSoundPlaying)}
          isSpeaking={isItemSoundPlaying(item)}
          speakerRole={item.speakerRole}
          secondaryText={!hideItemWhileActive && translationVisible ? item.displayLanguageText : undefined}
          position={getPosition(item)}
          onClick={item.sound && !items.some(isItemSoundPlaying) ? () => playItemSound(item) : undefined}
          active={isActiveItem}
        >
          {isInteractive(item) ?
            <div data-selector="interactive">
              <Interaction
                active={isActiveItem}
                item={item}
                onFinish={onItemComplete}
                onAttempt={onAttempt}
                learnLanguageAlpha3={learnLanguageAlpha3}
              />
            </div>
            :
            <Text
              color="spaceGray"
              data-selector="non-interactive"
              dangerouslySetInnerHTML={{
                __html: markupStringToHTML(getFirstCorrectSolution(item.learnLanguageText || ''))
              }}
            />
          }
        </MessageBlock>
      );
    }
  };

  return (
    <>
      <TranslationVisibilityToggle
        translationVisibility={translationVisibility}
        onClick={onToggleTranslationVisibility}
      />
      <StyledTrainerLayout>
        <TrainerTitle text={title || translations.trainerTitle[interaction]} />
        <StyledWrapper data-selector={`dialog-${interaction}`}>
          {items.map(renderRowContent)}
        </StyledWrapper>
      </StyledTrainerLayout>
    </>
  );
};

DialogTrainer.propTypes = {
  active: PropTypes.bool.isRequired,
  currentItem: PropTypes.object.isRequired,
  translationVisibility: PropTypes.string.isRequired,
  translationVisible: PropTypes.bool.isRequired,
  translations: PropTypes.shape({
    trainerTitle: PropTypes.shape({
      fillin: PropTypes.string.isRequired,
      puzzlehelper: PropTypes.string.isRequired,
      choose: PropTypes.string.isRequired
    })
  }).isRequired,
  title: PropTypes.string,
  visibleItems: PropTypes.array,
  interaction: PropTypes.string.isRequired,
  onAttempt: PropTypes.func.isRequired,
  onItemComplete: PropTypes.func.isRequired,
  onToggleTranslationVisibility: PropTypes.func.isRequired,
  isItemSoundPlaying: PropTypes.func.isRequired,
  playItemSound: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired
};

const getTranslations = (translate) => {
  return {
    trainerTitle: {
      fillin: translate('b3.page_dialog.complete_the_dialogue'),
      puzzlehelper: translate('b3.page_dialog.complete_the_dialogue'),
      choose: translate('b3.page_dialog.complete_the_dialogue_choicebuttons'),
      speak: translate('b3.page_dialog.title_speak_phase1')
    }
  };
};

export default withTranslations(getTranslations)(DialogTrainer);
