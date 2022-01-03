import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { markupStringToHTML, getFirstCorrectSolution } from '@lessonnine/babbel-markup-helper.js';
import withTranslations from '../../shared/withTranslations';
import StyledTrainerLayout from '../../TrainerLayout';
import TranslationVisibilityToggle from '../shared/TranslationVisibilityToggle';
import CardTrainerLayout from '../shared/CardTrainerLayout';
import FillinInteraction from '../../Interactions/Fillin/FillinInteraction';
import rollbar from '../../../services/rollbarService';

import Text from '../../shared/Text';
import { Row } from '../shared/Row';
import TransliterationInstructions from '../../Interactions/shared/Transliteration/TransliterationInstructions';
import { isWebview } from '../../../lib/features';
import { isInteractive, isTask } from '../../shared/itemSelectors';

export const KeyboardTrainer = ({
  active,
  visibleItems: items,
  currentItem,
  image,
  learnLanguageAlpha3,
  description,
  targetCharacter,
  onAttempt,
  onItemComplete,
  onToggleTranslationVisibility,
  playItemSound,
  currentItemIndex,
  title,
  translations,
  translationVisibility,
  translationVisible,
  getIndexInGroup
}) => {
  useEffect(() => {
    if (!currentItem.learnLanguageText && !currentItem.displayLanguageText) {
      rollbar.warning('Keyboard Trainer: item with no text', { item: currentItem });
    }
  }, [currentItem]);

  const renderRowContent = (item) => {
    const primaryText = isTask(item)
      ? item.displayLanguageText
      : item.learnLanguageText;

    if (!primaryText) {
      return null;
    }

    return isInteractive(item) ? (
      <div data-selector="interactive">
        <FillinInteraction
          active={active && currentItem === item}
          item={item}
          onFinish={onItemComplete}
          onAttempt={onAttempt}
          learnLanguageAlpha3={learnLanguageAlpha3}
        />
      </div>
    ) : (
      <Text
        data-selector="non-interactive"
        color="spaceGray"
        dangerouslySetInnerHTML={{
          __html: markupStringToHTML(getFirstCorrectSolution(primaryText))
        }}
      />
    );
  };

  const renderTranslation = (item) => {
    const translation = isTask(item)
      ? null
      : item.displayLanguageText;

    return translation && (
      <Text
        data-selector="item-translation"
        fontSize="small"
        color="spaceGrayW28"
        dangerouslySetInnerHTML={{ __html: markupStringToHTML(translation) }}
      />
    );
  };

  const renderRow = (item, index) => {
    const playSound = () => {
      playItemSound(items[index]).catch(() => {});
    };

    const handleClick = (index < currentItemIndex || currentItemIndex === null)
      && item.sound ? playSound : null;

    return (
      <Row
        active={active && currentItem === item}
        type={item.type}
        key={item.id}
        onClick={handleClick}
        delayIndex={getIndexInGroup(item)}
      >
        {renderRowContent(item)}
        {translationVisible && renderTranslation(item)}
      </Row>
    );
  };

  return (
    <>
      <TranslationVisibilityToggle
        translationVisibility={translationVisibility}
        onClick={onToggleTranslationVisibility}
      />
      <StyledTrainerLayout>
        <CardTrainerLayout
          data-selector="keyboard"
          titleText={title || translations.title}
          imageId={image.id}
        >
          <Text
            data-selector="description"
            as="p"
            color="spaceGray"
            dangerouslySetInnerHTML={{ __html: markupStringToHTML(description) }}
          />
          { // Transliteration instructions are only implemented for web.
            !isWebview() && <TransliterationInstructions
              learnLanguageAlpha3={learnLanguageAlpha3}
              targetCharacter={targetCharacter}
            />
          }
          {items.map(renderRow)}
        </CardTrainerLayout>
      </StyledTrainerLayout>
    </>
  );
};

KeyboardTrainer.propTypes = {
  getIndexInGroup: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  currentItem: PropTypes.object.isRequired,
  translationVisibility: PropTypes.string.isRequired,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired,
  description: PropTypes.string.isRequired,
  targetCharacter: PropTypes.string.isRequired,
  title: PropTypes.string,
  visibleItems: PropTypes.array,
  image: PropTypes.object.isRequired,
  currentItemIndex: PropTypes.number,
  onAttempt: PropTypes.func.isRequired,
  onItemComplete: PropTypes.func.isRequired,
  onToggleTranslationVisibility: PropTypes.func.isRequired,
  playItemSound: PropTypes.func.isRequired,
  translationVisible: PropTypes.bool.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired
};

const getTranslations = (translate) => ({
  title: translate('b3.page_keyboard.title')
});

export default withTranslations(getTranslations)(KeyboardTrainer);
