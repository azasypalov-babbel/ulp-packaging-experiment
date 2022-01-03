import { getActiveNode, getMistakeCount } from '../../../../../src/components/Interactions/shared/scene/selectors';
import initialState from './__fixtures__/initialState';
import completedState from './__fixtures__/completedState';

describe('scene selectors', () => {
  describe('getting the active node', () => {
    describe('before there is a gap active', () => {
      it('should contain the item text', () => {
        const activeNode = getActiveNode({
          ...initialState,
          activeItemIndex: 0,
          activeNodeIndex: -1
        });
        expect(activeNode).toEqual(null);
      });
    });

    describe('once the gap becomes active', () => {
      it('should contain the item text', () => {
        const activeNode = getActiveNode({
          ...initialState,
          activeItemIndex: 0,
          activeNodeIndex: 1
        });
        expect(activeNode).toEqual(
          expect.objectContaining({
            type: 'gap',
            attempt: {
              number: null,
              text: null,
              pending: false,
              solved: false,
              mistaken: false,
              feedbackType: null,
              selection: null
            }
          })
        );
      });
    });
  });

  describe('counting mistakes', () => {
    it('provides correct mistake count', () => {
      const count = getMistakeCount(completedState);

      expect(count).toEqual(2);
    });
  });
});
