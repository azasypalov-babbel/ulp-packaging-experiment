import React from 'react';
import { shallow } from 'enzyme';

import { ChoicebuttonsInteraction } from
  '../../../../src/components/Interactions/Choicebuttons/ChoicebuttonsInteraction';
import ChoicebuttonsInteractionNode from
  '../../../../src/components/Interactions/Choicebuttons/ChoicebuttonsInteractionNode';

import useFeedbackSounds from '../../../../src/components/Interactions/shared/useFeedbackSounds';
import { matchResult } from '../../../../src/components/Interactions/Choicebuttons/matchResult';
import { RESULTS } from '../../../../src/lib/matchingUtils/evaluate';

jest.mock('../../../../src/components/Interactions/Choicebuttons/ChoicebuttonsInteractionNode',
  () => 'ChoicebuttonsInteractionNode');
jest.mock('../../../../src/components/Interactions/shared/useFeedbackSounds', () => jest.fn());
jest.mock('../../../../src/components/Interactions/Choicebuttons/matchResult');

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
    learnLanguageText: '((die|*der|das|*yes))'
  },
  learnLanguageAlpha3: 'DEU',
  onAttempt: jest.fn(),
  onFinish: jest.fn()
};

describe('Choicebuttons Interaction', () => {
  describe('renders', () => {
    test('html', () => {
      const component = shallow(<ChoicebuttonsInteraction {...defaultProps} />);
      expect(component).toMatchSnapshot();
    });

    test('a ChoicebuttonsInteractionNode', () => {
      const component = shallow(<ChoicebuttonsInteraction {...defaultProps} />);
      const gap = component.find('ChoicebuttonsInteractionNode');
      expect(gap.exists()).toBe(true);
    });
  });

  describe('should pass props', () => {
    test('to ChoicebuttonsInteractionNode', () => {
      const component = shallow(<ChoicebuttonsInteraction {...defaultProps} />);
      const gap = component.find('ChoicebuttonsInteractionNode');

      expect(gap.prop('node')).toBeDefined();
      expect(gap.prop('interactionState')).toBeDefined();
      expect(gap.prop('onAttempt')).toBeDefined();
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
        const component = shallow(<ChoicebuttonsInteraction {...defaultProps} />);
        const { onAttempt } = component.find(ChoicebuttonsInteractionNode).props();

        onAttempt('der');
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
        const component = shallow(<ChoicebuttonsInteraction {...defaultProps} />);
        const { onAttempt } = component.find(ChoicebuttonsInteractionNode).props();

        onAttempt('das');
        await flushPromises();

        expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
        expect(mockPlayFeedback).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('making attempts', () => {
    it('should track attempt', async () => {
      const component = shallow(<ChoicebuttonsInteraction {...defaultProps} />);
      const { onAttempt } = component.find(ChoicebuttonsInteractionNode).props();

      matchResult.mockImplementationOnce(({ text }) =>
        Promise.resolve({
          text: 'der',
          inputText: text,
          feedbackType: RESULTS.INCORRECT,
          solved: false
        })
      );
      onAttempt('die');
      await flushPromises();

      expect(defaultProps.onAttempt).toHaveBeenCalledTimes(1);
      expect(defaultProps.onAttempt).toHaveBeenCalledWith(
        expect.objectContaining({
          attempt: {
            text: 'der',
            number: 1,
            solved: false,
            inputText: 'die',
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
      component = shallow(<ChoicebuttonsInteraction {...defaultProps} />);
      const { onAttempt } = component.find(ChoicebuttonsInteractionNode).props();
      const { onProceed } = component.find(ChoicebuttonsInteractionNode).props();

      matchResult.mockImplementationOnce(({ text }) =>
        Promise.resolve({
          text: 'der',
          inputText: text,
          feedbackType: RESULTS.CORRECT,
          solved: true
        })
      );

      onAttempt('der');
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
