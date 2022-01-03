import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import useScene from '../shared/scene/useScene';

import Wordorder from './Wordorder';
import { isInteractionKey } from '../../../lib/keyboardEvents';
import InlineTextGap from './InlineTextGap';
import * as markup from '../../../lib/matchingUtils/markup';
import { stripDiacritics } from '../../../lib/matchingUtils/normalise';
import { matchResult } from './matchResult';
import useFeedbackSounds from '../shared/useFeedbackSounds';
import { getActiveNode, getItem, getMistakeCount, isGap } from '../shared/scene/selectors';
import { play, requestPrompt } from '../shared/scene/actions';

const normaliseText = (string) => stripDiacritics(string).toLowerCase();

export const WordorderInteraction = ({
  active: initialActive,
  item,
  onAttempt,
  onFinish,
  learnLanguageAlpha3
}) => {
  const [active] = useState(initialActive);

  const [scene, dispatch] = useScene({
    item,
    learnLanguageAlpha3,
    matchResult
  });

  const [playFeedback, isFeedbackSoundDone] = useFeedbackSounds({
    resetDependencies: [getActiveNode(scene)]
  });
  const { completed } = scene;

  const currentItem = getItem(scene);
  const activeNode = getActiveNode(scene);
  const mistakeCount = getMistakeCount(scene);
  const attempt = activeNode?.attempt;

  const nodeSelection = useMemo(() => {
    if (!currentItem) {
      return [];
    }
    return markup.filterNodeSelection(currentItem.nodes);
  }, [currentItem]);

  const latestText = useMemo(() => {
    return nodeSelection.map(markup.nodeToAttemptString).join('');
  }, [nodeSelection]);

  const targetText = useMemo(() => {
    return currentItem.nodes.map(markup.nodeToTargetString).join('');
  }, [currentItem.nodes]);

  useEffect(() => {
    if (attempt?.number && !attempt?.pending) {
      const trackingAttempt = {
        number: mistakeCount + 1,
        solved: attempt.solved,
        inputText: `${latestText}${attempt.mistaken ? attempt.text : ''}`,
        text: currentItem.text
      };

      if (!attempt.solved || activeNode.isLastInteractiveNode) {
        playFeedback(attempt.solved);
        onAttempt({ attempt: trackingAttempt });
      }
    }
  }, [attempt, onAttempt, activeNode, playFeedback, latestText, mistakeCount]);

  useEffect(() => {
    if (!activeNode) {
      dispatch(play());
    }
  }, [activeNode, dispatch]);

  useEffect(() => {
    if (completed && isFeedbackSoundDone) {
      onFinish(mistakeCount);
    }
  }, [completed, onFinish, mistakeCount, isFeedbackSoundDone, attempt]);

  useEffect(() => {
    if (attempt?.solved) {
      dispatch(play());
    }
  }, [attempt, dispatch]);

  const allChoices = useMemo(() => {
    if (!currentItem) return;

    return currentItem.nodes
      .filter(isGap)
      .map(({ targetChoices, attempt }, index) => ({
        token: targetChoices[0].sentence,
        used: attempt?.solved,
        id: index
      }));
  }, [currentItem]);

  const mistakenIndex = useMemo(() =>
    allChoices.findIndex((choice) =>
      !attempt?.pending &&
      attempt?.mistaken &&
      attempt?.inputText === choice.token
    )
  , [allChoices, attempt]);

  const handleAttempt = (id) => {
    dispatch(requestPrompt(allChoices[id].token));
  };

  const handleKeyDown = (event) => {
    if (isInteractionKey(event, ['Shift+Escape'])) {
      event.preventDefault();
      if (!completed) {
        const [{ sentence }] = activeNode.targetChoices.filter(
          ({ correct }) => correct
        );
        dispatch(requestPrompt(sentence));
      }

      return;
    }

    const index = allChoices.findIndex(({ used, token }) =>
      !used &&
      normaliseText(token[0]) === normaliseText(event.key)
    );

    if (index >= 0) {
      event.preventDefault();
      handleAttempt(index);
    }
  };

  if (!currentItem || !active) {
    return null;
  }

  return (
    <div>
      <InlineTextGap
        active={!completed}
        data-focus-on-key="Shift+Escape"
        onKeyDown={handleKeyDown}
        targetText={targetText}
      >
        {latestText}
      </InlineTextGap>
      {!completed && (
        <Wordorder
          onAttempt={handleAttempt}
          allChoices={allChoices}
          mistakenIndex={mistakenIndex}
        />
      )}
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  shouldShowTransliteration: session.transliterationSettings.shouldShow
});

WordorderInteraction.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onAttempt: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired
};

WordorderInteraction.trainerConfig = {

};

export default connect(mapStateToProps)(WordorderInteraction);
