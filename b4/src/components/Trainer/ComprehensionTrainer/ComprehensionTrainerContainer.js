import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import withInfoText from '../../shared/withInfoText';
import ContinueSheet from '../../ContinueSheet';
import { useSoundsPreload } from '../shared/useSoundsPreload';
import { QuestionWithChoicebuttonsInteraction } from '../../Interactions/QuestionWithChoicebuttons';
import { useSequence } from '../../shared/useSequence';
import * as sequenceActions from '../../../dux/sequence/actions';
import withNormalisedTrainerData from '../withNormalisedTrainerData';
import ComprehensionTrainer from './ComprehensionTrainer';
import TranslationVisibilityToggle from '../shared/TranslationVisibilityToggle';
import { useBackgroundColor } from '../../shared/hooks/useBackgroundColor';
import { useTheme } from '../../../providers/theme';

export const TRAINER_STATE = {
  READY: 'READY',
  DONE: 'DONE'
};

export const ComprehensionTrainerContainer = ({
  currentTrainerItemIndex: initialItemIndex,
  learnLanguageAlpha3,
  trainer,
  attemptItem,
  completeItem,
  onStart,
  onFinish
}) => {
  const contentItems = trainer.itemGroups[0]?.items || [];
  const questionItems = trainer.itemGroups[1]?.items || [];
  const initialQuestionIndex = initialItemIndex - contentItems.length;
  const {
    element: currentItem,
    next: nextItem,
    isLast: isLastItem,
    index: itemIndex
  } = useSequence(questionItems, initialQuestionIndex < 0 ? 0 : initialQuestionIndex);
  useSoundsPreload(contentItems);
  const theme = useTheme();
  useBackgroundColor(theme.cascada.iceGrayW50);
  const [state, setState] = useState(TRAINER_STATE.READY);
  const [translationsVisible, setTranslationsVisible] = useState(false);
  const [highlighted, setHightlighted] = useState(false);

  useEffect(() => {
    onStart({ scorableItemsCount: questionItems.length });
  }, [onStart, trainer, questionItems.length]);

  const handleAttempt = useCallback(
    ({ attempt }) => {
      const trainerData = {
        /* eslint-disable camelcase */
        interaction_mode: trainer.interaction,
        item_position_in_trainer: itemIndex,
        number_of_items_in_trainer: questionItems.length
        /* eslint-enable camelcase */
      };

      const trackingAttempt = {
        ...attempt,
        text: attempt.inputText,
        targetText: attempt.text
      };
      delete trackingAttempt.inputText;

      attemptItem(currentItem, trackingAttempt, trainerData);
    },
    [
      trainer,
      attemptItem,
      itemIndex,
      currentItem,
      questionItems.length
    ]
  );
  const handleItemComplete = useCallback(
    (mistakeCount) => {
      completeItem(currentItem, mistakeCount);
      if (isLastItem) setState(TRAINER_STATE.DONE);
      else nextItem();
    },
    [completeItem, currentItem, isLastItem, nextItem]
  );
  const handleAllItemsComplete = useCallback(() => {
    setHightlighted(true);
  }, []);

  return (
    <div
      data-trainer-type="comprehension"
      data-trainer-interaction={trainer.interaction}
      data-trainer-dictate={trainer.dictate}
    >
      {!trainer.dictate && trainer.translationVisibility !== 'none' && (
        <TranslationVisibilityToggle
          translationVisibility="partial"
          onClick={() => setTranslationsVisible((current) => !current)}
        />
      )}
      <ComprehensionTrainer
        items={contentItems}
        title={trainer.title}
        description={trainer.description}
        dictate={trainer.dictate}
        translationsVisible={translationsVisible}
        onAllItemsComplete={handleAllItemsComplete}
      />
      {state === TRAINER_STATE.READY && (
        <QuestionWithChoicebuttonsInteraction
          key={currentItem.id}
          item={currentItem}
          highlighted={highlighted}
          onAttempt={handleAttempt}
          onFinish={handleItemComplete}
          defaultOpened={contentItems.length === 0}
          learnLanguageAlpha3={learnLanguageAlpha3}
          amountOfQuestions={questionItems.length}
          currentQuestionOrder={itemIndex + 1}
        />
      )}
      {state === TRAINER_STATE.DONE && <ContinueSheet onClick={onFinish} />}
    </div>
  );
};

ComprehensionTrainerContainer.propTypes = {
  attemptItem: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired,
  currentTrainerItemIndex: PropTypes.number.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  trainer: PropTypes.object.isRequired
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale
});

const mapDispatchToProps = {
  skipItem: sequenceActions.skipItem,
  attemptItem: sequenceActions.attemptItem,
  completeItem: sequenceActions.completeItem
};

const wrapper = compose(
  withInfoText,
  withNormalisedTrainerData,
  connect(mapStateToProps, mapDispatchToProps)
);

export default wrapper(ComprehensionTrainerContainer);
