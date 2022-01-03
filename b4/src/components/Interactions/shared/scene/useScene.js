import { useEffect, useReducer } from 'react';
import { receivePrompt } from './actions';
import reducer, { createInitialState } from './reducer';
import { getActiveNode } from './selectors';

export const INTERACTION_STATES = {
  INACTIVE: 'INACTIVE',
  INPUT: 'INPUT',
  FEEDBACK: 'FEEDBACK'
};

const useScene = ({ item, learnLanguageAlpha3, matchResult }) => {
  const [state, dispatch] = useReducer(reducer, item, createInitialState);

  const activeNode = getActiveNode(state);
  const pending = activeNode ? activeNode.attempt.pending : false;
  const text = activeNode ? activeNode.attempt.text : false;

  useEffect(() => {
    if (pending) {
      const { targetChoices } = activeNode;
      const targetTexts = targetChoices
        .filter((choice) => choice.correct)
        .map((choice) => choice.sentence);

      matchResult({ targetTexts, text, learnLanguageAlpha3 }).then((match) =>
        dispatch(receivePrompt(match))
      );
    }
  }, [text, pending, activeNode, learnLanguageAlpha3, matchResult]);

  return [state, dispatch];
};

export default useScene;
