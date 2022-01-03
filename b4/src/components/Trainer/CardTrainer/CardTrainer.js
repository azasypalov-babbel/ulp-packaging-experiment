import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { markupStringToHTML, getFirstCorrectSolution } from '@lessonnine/babbel-markup-helper.js';
import withTranslations from '../../shared/withTranslations';
import StyledTrainerLayout from '../../TrainerLayout';
import TranslationVisibilityToggle from '../shared/TranslationVisibilityToggle';
import CardTrainerLayout from '../shared/CardTrainerLayout';
import getComponentFromInteractionType from '../../../lib/getComponentFromInteractionType';
import rollbar from '../../../services/rollbarService';

import Text from '../../shared/Text';
import { Row } from '../shared/Row';
import { isInteractive, isTask } from '../../shared/itemSelectors';

export const CardTrainer = ({
  active,
  visibleItems: items,
  currentItem,
  image,
  learnLanguageAlpha3,
  onAttempt,
  onItemComplete,
  onToggleTranslationVisibility,
  playItemSound,
  currentItemIndex,
  title,
  interaction,
  translations,
  translationVisibility,
  translationVisible,
  getIndexInGroup
}) => {
  useEffect(() => {
    if (!currentItem.learnLanguageText && !currentItem.displayLanguageText) {
      rollbar.warning('Card Trainer: item with no text', { item: currentItem });
    }
  }, [currentItem]);

  const Interaction = getComponentFromInteractionType(interaction);

  const renderRowContent = (item) => {
    const primaryText = isTask(item)
      ? item.displayLanguageText
      : item.learnLanguageText;

    if (!primaryText) {
      return null;
    }

    return isInteractive(item) ? (
      <div data-selector="interactive">
        <Interaction
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
          data-selector={`card-${interaction}`}
          titleText={title || translations.trainerTitle[interaction]}
          imageId={image?.id}
        >
          {items.map(renderRow)}
        </CardTrainerLayout>
      </StyledTrainerLayout>
    </>
  );
};

CardTrainer.propTypes = {
  getIndexInGroup: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  currentItem: PropTypes.object.isRequired,
  translationVisibility: PropTypes.string.isRequired,
  translations: PropTypes.shape({
    trainerTitle: PropTypes.shape({
      fillin: PropTypes.string.isRequired,
      puzzlehelper: PropTypes.string.isRequired,
      wordorder: PropTypes.string.isRequired
    })
  }).isRequired,
  title: PropTypes.string,
  visibleItems: PropTypes.array,
  image: PropTypes.object,
  currentItemIndex: PropTypes.number,
  interaction: PropTypes.string.isRequired,
  onAttempt: PropTypes.func.isRequired,
  onItemComplete: PropTypes.func.isRequired,
  onToggleTranslationVisibility: PropTypes.func.isRequired,
  playItemSound: PropTypes.func.isRequired,
  translationVisible: PropTypes.bool.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired
};

const getTranslations = (translate) => {
  const writeTranslationKey =
    'b3.page_vocabulary_gap.type_the_missing_characters';
  return {
    trainerTitle: {
      fillin: translate(writeTranslationKey),
      puzzlehelper: translate(writeTranslationKey),
      choose: translate('b3.page_card.title_choicebuttons'),
      wordorder: translate(
        'b3.vocabulary_word_order.click_on_the_parts_of_the_sentence_in_the_correct_order'
      )
    }
  };
};

export default withTranslations(getTranslations)(CardTrainer);
