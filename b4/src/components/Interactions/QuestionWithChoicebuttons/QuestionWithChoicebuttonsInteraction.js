import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import QuestionSheet from './QuestionSheet';
import { FullWidthChoicebutton } from '../Choicebuttons/Choicebuttons';
import useScene from '../shared/scene/useScene';
import { matchResult } from '../Choicebuttons/matchResult';
import useHasLatestAttempt from '../shared/Write/hasLatestAttempt';
import { play, requestPrompt } from '../shared/scene/actions';
import useFeedbackSounds from '../shared/useFeedbackSounds';
import { getActiveNode, getMistakeCount } from '../shared/scene/selectors';
import { isInteractionKey } from '../../../lib/keyboardEvents';

export const QuestionWithChoicebuttonsInteraction = ({
  item,
  learnLanguageAlpha3,
  highlighted,
  onAttempt,
  onFinish,
  defaultOpened,
  amountOfQuestions,
  currentQuestionOrder
}) => {
  const [scene, dispatch] = useScene({
    learnLanguageAlpha3,
    item,
    matchResult
  });
  const activeNode = getActiveNode(scene);
  const answers = scene.item.nodes.find((node) => node.type === 'gap');
  const questionNodes = scene.item.nodes.filter(
    (node) => node.text?.trim() && node !== answers
  );

  const latestAttempt = useHasLatestAttempt(activeNode?.attempt);

  const mistakeCount = getMistakeCount(scene);

  const [playFeedback, isFeedbackDone] = useFeedbackSounds({
    resetDependencies: [latestAttempt]
  });
  const [feedbackDismissed, setFeedbackDismissed] = useState(true);

  const handleAttempt = useCallback((attemptText) => {
    if (feedbackDismissed) dispatch(requestPrompt(attemptText));
  }, [feedbackDismissed]);
  const handleRetry = useCallback(() => { setFeedbackDismissed(true); }, []);
  const handleProceed = useCallback(() => { setFeedbackDismissed(true); dispatch(play()); }, []);

  const openedRef = useRef(false);
  const handleOpenChange = useCallback((opened) => { openedRef.current = opened; }, []);

  useEffect(() => {
    const callback = (event) => {
      if (openedRef.current && isInteractionKey(event, ['Shift+Escape'])) {
        event.preventDefault();
        const correctSolution = activeNode.targetChoices.find(({ correct }) => correct);
        handleAttempt(correctSolution.sentence);
      }
    };
    document.addEventListener('keydown', callback);
    return () => document.removeEventListener('keydown', callback);
  }, [handleAttempt, activeNode]);

  const afterFeedbackTimeoutRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(afterFeedbackTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (latestAttempt) {
      playFeedback(latestAttempt.solved);
      onAttempt({ attempt: latestAttempt });

      const isSolved = latestAttempt.solved;
      clearTimeout(afterFeedbackTimeoutRef.current);
      afterFeedbackTimeoutRef.current = setTimeout(() => {
        if (isSolved) {
          handleProceed();
        } else {
          handleRetry();
        }
      }, 1000);
    }
  }, [latestAttempt, onAttempt, handleProceed, playFeedback, handleRetry]);

  const attemptInitRef = useRef(false);
  useEffect(() => {
    if (!activeNode) {
      attemptInitRef.current = true;
      dispatch(play());
    }
  }, [activeNode]);

  useEffect(() => {
    if (scene.completed && isFeedbackDone) {
      onFinish(mistakeCount);
    }
  }, [scene.completed, onFinish, mistakeCount, isFeedbackDone]);

  useEffect(() => {
    if (!attemptInitRef.current) setFeedbackDismissed(false);
    attemptInitRef.current = false;
  }, [latestAttempt]);

  return (
    <QuestionSheet
      onOpenChange={handleOpenChange}
      question={(
        <>
          {questionNodes.map((node) => (
            <span key={node.text} dangerouslySetInnerHTML={{ __html: node.text }} />
          ))}
        </>
      )}
      activeQuestion={currentQuestionOrder}
      nrOfQuestions={amountOfQuestions}
      isHighlighted={highlighted}
      defaultOpened={defaultOpened || currentQuestionOrder > 1}
      interaction={
        <>
          {answers?.targetChoices?.map(({ correct, sentence }, idx) => (
            <FullWidthChoicebutton
              key={idx}
              showFeedback={!feedbackDismissed}
              attempt={latestAttempt}
              sentence={sentence}
              data-position={idx}
              data-choice={sentence}
              data-correct={correct}
              listenToKey={`${idx + 1}`}
              onClick={() => handleAttempt(sentence)}
            >
              {sentence}
            </FullWidthChoicebutton>
          ))}
        </>
      }
    />
  );
};

QuestionWithChoicebuttonsInteraction.propTypes = {
  onAttempt: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  item: PropTypes.shape({}),
  highlighted: PropTypes.bool,
  amountOfQuestions: PropTypes.number.isRequired,
  defaultOpened: PropTypes.bool,
  currentQuestionOrder: PropTypes.number.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired
};
