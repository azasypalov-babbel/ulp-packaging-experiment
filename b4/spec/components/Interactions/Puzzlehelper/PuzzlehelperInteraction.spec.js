import React from 'react';
import { shallow } from 'enzyme';

import { PuzzlehelperInteraction } from '../../../../src/components/Interactions/Puzzlehelper/PuzzlehelperInteraction';
import PuzzlehelperInteractionNode from
  '../../../../src/components/Interactions/Puzzlehelper/PuzzlehelperInteractionNode';

import useFeedbackSounds from '../../../../src/components/Interactions/shared/useFeedbackSounds';

import { matchResult } from '../../../../src/components/Interactions/shared/Write/helpers';
import { RESULTS } from '../../../../src/lib/matchingUtils/evaluate';

jest.mock('../../../../src/components/Interactions/Puzzlehelper/PuzzlehelperInteractionNode',
  () => 'PuzzlehelperInteractionNode');
jest.mock('../../../../src/components/Interactions/shared/Write/helpers');
jest.mock('../../../../src/components/Interactions/shared/useFeedbackSounds', () => jest.fn());

const mockPlayFeedback = jest.fn();
useFeedbackSounds.mockImplementation(() => [
  mockPlayFeedback,
  false
]);

const flushPromises = () => new Promise(setTimeout);

const defaultProps = {
  active: true,
  item: {
    type: 'phrase',
    learnLanguageText: '((dog)) der'
  },
  onFinish: jest.fn(),
  onAttempt: jest.fn(),
  learnLanguageAlpha3: 'DEU',
  shouldShowTransliteration: true
};

describe('Puzzlehelper Interaction', () => {
  describe('renders', () => {
    test('html', () => {
      const component = shallow(<PuzzlehelperInteraction {...defaultProps} />);
      expect(component).toMatchSnapshot();
    });

    test('a PuzzlehelperInteractionNode', () => {
      const component = shallow(<PuzzlehelperInteraction {...defaultProps} />);
      const gap = component.find('PuzzlehelperInteractionNode');
      expect(gap.exists()).toBe(true);
    });
  });

  describe('should pass props', () => {
    test('to PuzzlehelperInteractionNode', () => {
      const component = shallow(<PuzzlehelperInteraction {...defaultProps} />);
      const gap = component.find('PuzzlehelperInteractionNode');

      expect(gap.prop('node')).toBeDefined();
      expect(gap.prop('interactionState')).toBeDefined();
    });
  });

  describe('feedback sounds', () => {
    describe('with no mistake', () => {
      beforeEach(() => {
        matchResult.mockImplementationOnce(({ text }) =>
          Promise.resolve({
            text,
            inputText: text,
            feedbackType: RESULTS.CORRECT,
            solved: true
          })
        );
      });

      test('should play sound for correct attempt', async () => {
        const component = shallow(<PuzzlehelperInteraction {...defaultProps} />);
        const { onAttempt } = component.find(PuzzlehelperInteractionNode).props();

        onAttempt('dog');
        await flushPromises();

        expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
        expect(mockPlayFeedback).toHaveBeenCalledWith(true);
      });
    });

    describe('when a mistake is made', () => {
      beforeEach(() => {
        matchResult.mockImplementationOnce(({ text }) =>
          Promise.resolve({
            text,
            inputText: text,
            feedbackType: RESULTS.INCORRECT,
            solved: false
          })
        );
      });

      test('should play sound for incorrect attempt', async () => {
        const component = shallow(<PuzzlehelperInteraction {...defaultProps} />);
        const { onAttempt } = component.find(PuzzlehelperInteractionNode).props();

        onAttempt('test');
        await flushPromises();

        expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
        expect(mockPlayFeedback).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('making attempts', () => {
    it('should track attempt', async () => {
      const component = shallow(<PuzzlehelperInteraction {...defaultProps} />);
      const { onAttempt } = component.find(PuzzlehelperInteractionNode).props();

      matchResult.mockImplementationOnce(({ text }) =>
        Promise.resolve({
          text: '((dog)) der',
          inputText: text,
          feedbackType: RESULTS.INCORRECT,
          solved: false
        })
      );
      onAttempt('user input');
      await flushPromises();

      expect(defaultProps.onAttempt).toHaveBeenCalledTimes(1);
      expect(defaultProps.onAttempt).toHaveBeenCalledWith(
        expect.objectContaining({
          attempt: {
            text: '((dog)) der',
            number: 1,
            solved: false,
            inputText: 'user input',
            feedbackType: RESULTS.INCORRECT,
            mistaken: true,
            pending: false,
            selection: undefined
          }
        })
      );
      defaultProps.onAttempt.mockClear();
    });
  });

  describe('on completion', () => {
    let component;
    beforeEach(async () => {
      component = shallow(<PuzzlehelperInteraction {...defaultProps} />);
      const { onAttempt } = component.find(PuzzlehelperInteractionNode).props();
      const { onProceed } = component.find(PuzzlehelperInteractionNode).props();

      matchResult.mockImplementationOnce(({ text }) =>
        Promise.resolve({
          text: '((dog)) der',
          inputText: text,
          feedbackType: RESULTS.CORRECT,
          solved: true
        })
      );

      onAttempt('der dog');
      await flushPromises();
      onProceed();
    });

    describe('before feedback sound is complete', () => {
      it('should not call onFinish', () => {
        expect(defaultProps.onFinish).not.toHaveBeenCalled();
      });
    });

    describe('after feedback sound is complete', () => {
      beforeEach(async () => {
        useFeedbackSounds.mockImplementation(() => [
          mockPlayFeedback,
          true
        ]);
        // Hack to update the component so it uses the above mocked value
        component.setProps({});
      });

      it('should call onFinish with mistakeCount', () => {
        const mistakeCount = 0;
        expect(defaultProps.onFinish).toHaveBeenCalledTimes(1);
        expect(defaultProps.onFinish).toHaveBeenCalledWith(mistakeCount);
      });
    });
  });
});
