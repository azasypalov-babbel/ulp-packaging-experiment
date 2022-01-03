import * as types from '../../../../../src/components/Interactions/shared/scene/types';
import reducer, { createInitialState } from '../../../../../src/components/Interactions/shared/scene/reducer';
import initialState from './__fixtures__/initialState';
import { RESULTS } from '../../../../../src/lib/matchingUtils/evaluate';

describe('create initial state', () => {
  const state = createInitialState({
    type: 'phrase',
    learnLanguageText: '((Schöner|*Guten)) Morgen, lieber Cousin'
  });

  it('should make no gap active', () => {
    expect(state.activeNodeIndex).toBe(-1);
  });

  it('should mark the scene as not yet completed', () => {
    expect(state.completed).toBe(false);
  });

  describe('phrase item', () => {
    const state = createInitialState({
      type: 'phrase',
      learnLanguageText: '((Schöner|*Guten)) Morgen, lieber Cousin'
    });
    it('should store items in the state', () => {
      expect(state.item.text).toBe('((Schöner|*Guten)) Morgen, lieber Cousin');
    });
  });

  describe('task item', () => {
    const state = createInitialState({
      type: 'task',
      displayLanguageText: 'That is ((*right|*correct|wrong|totallywrong)).'
    });
    it('should store items in the state', () => {
      expect(state.item.text).toBe('That is ((*right|*correct|wrong|totallywrong)).');
    });
  });

  it('should populate attempt state for gap nodes', () => {
    const nodes = state.item.nodes;
    expect(nodes).toHaveLength(2);

    expect(nodes[0].type).toBe('gap');
    expect(nodes[0].targetChoices).toEqual(expect.arrayContaining([
      expect.objectContaining({ correct: false, sentence: 'Schöner' }),
      expect.objectContaining({ correct: true, sentence: 'Guten' })
    ]));

    expect(nodes[0].attempt).toEqual({
      number: null,
      text: null,
      pending: false,
      solved: false,
      mistaken: false,
      feedbackType: null,
      selection: null
    });
  });

  it('should populate text field for text nodes', () => {
    const nodes = state.item.nodes;
    expect(nodes).toHaveLength(2);

    expect(nodes[1].type).toBe('text');
    expect(nodes[1].text).toBe(' Morgen, lieber Cousin');
  });
});

describe('scene reducer', () => {
  describe('before any gap is active', () => {
    describe('the play action', () => {
      const action = {
        type: types.PLAY
      };
      const state = {
        ...initialState
      };
      const newState = reducer(state, action);

      it('should make next gap active', () => {
        expect(newState.activeNodeIndex).toBe(1);
      });

      it('should set active flag on the node', () => {
        // Given activeNodeIndex is already stored in the state this flag is redundant
        // Better to populate this as part of a selector
        expect(newState.item.nodes[1].active).toBe(true);
      });

      it('should not mark the scene as completed', () => {
        expect(newState.completed).toBe(false);
      });
    });
  });

  describe('when there are no more gaps or items', () => {
    describe('the play action', () => {
      const action = {
        type: types.PLAY
      };
      const state = {
        ...initialState,
        activeNodeIndex: 1
      };
      it('should mark the scene as completed', () => {
        const newState = reducer(state, action);
        expect(newState.completed).toBe(true);
      });
    });
  });

  describe('making an attempt', () => {
    const action = {
      type: types.REQUEST_PROMPT,
      payload: {
        attemptText: 'Guten Tag'
      }
    };
    const state = {
      ...initialState,
      activeNodeIndex: 1
    };
    it('should store attempt in state', () => {
      const newState = reducer(state, action);
      const attempt = newState.item.nodes[1].attempt;
      expect(attempt.pending).toBe(true);
      expect(attempt.number).toBe(1);
      expect(attempt.text).toBe('Guten Tag');
    });
  });

  describe('result of the attempt', () => {
    const action = {
      type: types.RECEIVE_PROMPT,
      payload: {
        text: 'Guten Tag',
        solved: true,
        feedbackType: RESULTS.CORRECT
      }
    };
    const state = {
      ...initialState,
      activeNodeIndex: 1
    };
    it('should store result of the attempt in state', () => {
      const newState = reducer(state, action);
      const attempt = newState.item.nodes[1].attempt;
      expect(attempt.pending).toBe(false);
      expect(attempt.solved).toBe(true);
      expect(attempt.text).toBe('Guten Tag');
      expect(attempt.feedbackType).toBe(RESULTS.CORRECT);
    });

    it('mark the whole item as solved', () => {
      const newState = reducer(state, action);
      const item = newState.item;
      expect(item.solved).toBe(true);
    });
  });
});
