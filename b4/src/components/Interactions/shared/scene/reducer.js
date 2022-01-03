import * as types from './types';
import {
  nextGapNodeIndex,
  hasGapAfter,
  getItem,
  getGaps
} from './selectors';
import { parseNodesFromMarkup } from '../../../../lib/matchingUtils/markup';
import { isTask } from '../../../shared/itemSelectors';

const parseItem = (item) => {
  const text = isTask(item)
    ? item.displayLanguageText
    : item.learnLanguageText;

  return {
    ...item,
    text,
    nodes: text ? parseNodesFromMarkup(text) : undefined
  };
};

export const createInitialState = (item) => ({
  item: parseItem(item),
  activeNodeIndex: -1,
  completed: false
});

const mapIndex = (array, atIndex, fn) =>
  array.map((item, index) => (index === atIndex ? fn(item) : item));

const reducer = (state, action) => {
  switch (action.type) {
    case types.REQUEST_PROMPT: {
      const { attemptText } = action.payload;
      const currentItem = getItem(state);
      return {
        ...state,
        item: {
          ...currentItem,
          nodes: mapIndex(currentItem.nodes, state.activeNodeIndex, (node) => ({
            ...node,
            attempt: {
              ...node.attempt,
              number: node.attempt.number + 1,
              text: attemptText,
              pending: true
            }
          }))
        }
      };
    }

    case types.RECEIVE_PROMPT: {
      const {
        text,
        inputText,
        feedbackType,
        solved: solvedAttempt,
        selection
      } = action.payload;

      const currentItem = getItem(state);

      const nodes = mapIndex(
        currentItem.nodes,
        state.activeNodeIndex,
        (node) => ({
          ...node,
          attempt: {
            ...node.attempt,
            text,
            inputText,
            pending: false,
            solved: solvedAttempt,
            mistaken: !solvedAttempt,
            feedbackType,
            selection
          }
        })
      );

      const item = {
        ...currentItem,
        nodes
      };

      const solved = getGaps(item).every((gap) => gap.attempt.solved);

      return {
        ...state,
        item: {
          ...item,
          solved
        }
      };
    }

    case types.PLAY: {
      const { activeNodeIndex: previousActiveNodeIndex } = state;
      const currentItem = getItem(state);

      const activeNodeIndex = hasGapAfter(currentItem, previousActiveNodeIndex + 1)
        ? nextGapNodeIndex(currentItem, previousActiveNodeIndex + 1)
        : previousActiveNodeIndex;

      return {
        ...state,
        completed: previousActiveNodeIndex === activeNodeIndex,
        activeNodeIndex,
        item: {
          ...currentItem,
          nodes: currentItem.nodes.map((node, nodeIndex) => ({
            ...node,
            active: nodeIndex === activeNodeIndex,
            isLastInteractiveNode: !hasGapAfter(currentItem, nodeIndex + 1)
          }))
        }
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
