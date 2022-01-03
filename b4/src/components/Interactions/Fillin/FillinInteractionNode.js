import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as features from '../../../lib/features';
import { attemptType, interactiveNodeType } from '../shared/scene/scenePropTypes';
import NativeButtonSheet from './NativeButtonSheet';
import WebButtonSheet from './WebButtonSheet';
import { useInputHint } from './useInputHint';
import { isiOS } from '../../../lib/features';
import Text from '../../shared/Text';
import Gap from './Gap';
import FillinFeedback from './FillinFeedback';
import { useTransliterationReplace } from '../shared/Transliteration/replace';
import { useTransliterationUIState } from '../shared/Transliteration/UIState';
import TransliterationTable from '../shared/Transliteration/TransliterationTable';
import { INTERACTION_STATES } from '../shared/scene/useScene';
import withTranslations from '../../shared/withTranslations';

const FillinInteractionNode = ({
  node,
  interactionState,
  onAttempt,
  shouldShowTransliteration,
  toggleTransliterationVisibility,
  learnLanguageAlpha3,
  translations,
  onRetry,
  onProceed
}) => {
  const gapRef = useRef();
  const { hintLevel, nextHintLevel, onHint } = useInputHint();

  const transliterationEnabled = features.get('is_transliteration');

  const [
    onTransliteration,
    activeTransliterations
  ] = useTransliterationUIState();

  const [handleKeyPress, isTransliterationLoading] = useTransliterationReplace(
    learnLanguageAlpha3,
    onTransliteration,
    transliterationEnabled
  );

  const handleHint = useCallback(() => {
    gapRef.current?.focus();
    onHint();
  }, [gapRef, onHint]);

  const handleRetry = useCallback(() => {
    gapRef.current?.deleteAll();
    onRetry();
  }, [gapRef, onRetry]);

  const handleToggleTransliterationVisibility = useCallback(() => {
    gapRef.current?.focus();
    toggleTransliterationVisibility();
  }, [gapRef, toggleTransliterationVisibility]);

  const isTransliterationTableSupported =
    transliterationEnabled && !isTransliterationLoading;

  return <>
    <Text color="spaceGray">
      <Gap
        ref={gapRef}
        submitHint={translations.submitHint}
        active={interactionState !== INTERACTION_STATES.INACTIVE}
        targetChoices={node.targetChoices}
        attempt={node?.attempt}
        handleKeyPress={handleKeyPress}
        interactionState={interactionState}
        hintLevel={hintLevel}
        learnLanguageAlpha3={learnLanguageAlpha3}
        onReturn={onAttempt}
        shouldShowTransliteration={shouldShowTransliteration}
        toggleTransliterationVisibility={handleToggleTransliterationVisibility}
        onRetry={onRetry}
      />
    </Text>

    {interactionState === INTERACTION_STATES.INPUT &&
      <>
        {isTransliterationTableSupported &&
        shouldShowTransliteration && (
          <TransliterationTable
            active={activeTransliterations}
            learnLanguageAlpha3={learnLanguageAlpha3}
          />
        )}

        {isiOS() ? (
          <NativeButtonSheet
            nextHintLevel={nextHintLevel}
            onHint={handleHint}
          />
        ) : (
          <WebButtonSheet
            nextHintLevel={nextHintLevel}
            onHint={handleHint}
            isTransliterationTableSupported={isTransliterationTableSupported}
            onTransliterationToggled={handleToggleTransliterationVisibility}
          />
        )}
      </>
    }

    {interactionState === INTERACTION_STATES.FEEDBACK &&
      <FillinFeedback
        attempt={node?.attempt}
        learnLanguageAlpha3={learnLanguageAlpha3}
        onRetry={handleRetry}
        onProceed={onProceed}
      />
    }
  </>;
};

FillinInteractionNode.propTypes = {
  node: interactiveNodeType.isRequired,
  attempt: attemptType,
  toggleTransliterationVisibility: PropTypes.func.isRequired,
  interactionState: PropTypes.string.isRequired,
  shouldShowTransliteration: PropTypes.bool.isRequired,
  onAttempt: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    submitHint: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => {
  return {
    submitHint: translate('b3.pop_over.enter_reminder_content')
  };
};

export default withTranslations(getTranslations)(FillinInteractionNode);
