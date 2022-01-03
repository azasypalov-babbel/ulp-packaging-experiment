import React from 'react';
import { shallow } from 'enzyme';
import { WordorderInteraction } from '../../../../src/components/Interactions/Wordorder/WordorderInteraction';
import Wordorder from '../../../../src/components/Interactions/Wordorder/Wordorder';
import InlineTextGap from '../../../../src/components/Interactions/Wordorder/InlineTextGap';
import { matchResult } from '../../../../src/components/Interactions/Wordorder/matchResult';
import { RESULTS } from '../../../../src/lib/matchingUtils/evaluate';

import useFeedbackSounds from '../../../../src/components/Interactions/shared/useFeedbackSounds';
jest.mock('../../../../src/components/Interactions/shared/useFeedbackSounds', () => jest.fn());

jest.mock('../../../../src/components/Interactions/Wordorder/matchResult');

const flushPromises = () => new Promise(setTimeout);

const defaultProps = {
  active: true,
  item: {
    type: 'phrase',
    learnLanguageText: '((*!Era)) ((*un)) ((*cumplido!))'
  },
  onFinish: jest.fn(),
  onAttempt: jest.fn(),
  learnLanguageAlpha3: 'DEU',
  shouldShowTransliteration: true
};

const mockPlayFeedback = jest.fn();

describe('Wordorder Interaction', () => {
  beforeEach(() => {
    matchResult.mockImplementation(({ text }) =>
      Promise.resolve({
        text,
        inputText: text,
        feedbackType: RESULTS.CORRECT,
        solved: true
      })
    );

    useFeedbackSounds.mockImplementation(() => [
      mockPlayFeedback,
      false
    ]);

    defaultProps.onAttempt.mockClear();
  });
  describe('before user interaction', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = shallow(<WordorderInteraction {...defaultProps} />);
    });

    it('should render the input as active', () => {
      const input = wrapper.find(InlineTextGap);
      expect(input.exists()).toBe(true);
      expect(input.prop('active')).toBe(true);
      expect(input.prop('targetText')).toBe('!Era un cumplido!');
    });

    it('should render wordorder buttons', () => {
      const wordorder = wrapper.find(Wordorder);
      expect(wordorder.exists()).toBe(true);
      expect(wordorder.prop('allChoices')).toEqual([
        { id: 0, used: false, token: '!Era' },
        { id: 1, used: false, token: 'un' },
        { id: 2, used: false, token: 'cumplido!' }
      ]);
    });
  });
  describe('feedback sounds', () => {
    describe('with no mistakes', () => {
      it('should play corrrect sound on last word', async () => {
        const wrapper = shallow(<WordorderInteraction {...defaultProps} />);
        const { onAttempt } = wrapper.find(Wordorder).props();

        onAttempt(0);
        await flushPromises();

        expect(mockPlayFeedback).not.toHaveBeenCalled();

        onAttempt(1);
        await flushPromises();

        expect(mockPlayFeedback).not.toHaveBeenCalled();

        onAttempt(2);
        await flushPromises();

        expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
        expect(mockPlayFeedback).toHaveBeenCalledWith(true);
      });
    });
    describe('when a mistake is made', () => {
      it('should play sound for incorrect attempt', async () => {
        const wrapper = shallow(<WordorderInteraction {...defaultProps} />);
        const { onAttempt } = wrapper.find(Wordorder).props();

        // Get first word correct
        onAttempt(0);
        await flushPromises();

        // Make a mistake on the next item
        matchResult.mockImplementationOnce(({ text }) =>
          Promise.resolve({
            text,
            inputText: text,
            feedbackType: RESULTS.INCORRECT,
            solved: false
          })
        );
        onAttempt(2);
        await flushPromises();

        expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
        expect(mockPlayFeedback).toHaveBeenCalledWith(false);
      });
    });
  });
  describe('making attempts', () => {
    describe('with no mistakes', () => {
      it('should only track attempt on last word', async () => {
        const wrapper = shallow(<WordorderInteraction {...defaultProps} />);
        const { onAttempt } = wrapper.find(Wordorder).props();

        onAttempt(0);
        await flushPromises();

        expect(defaultProps.onAttempt).not.toHaveBeenCalled();

        onAttempt(1);
        await flushPromises();

        expect(defaultProps.onAttempt).not.toHaveBeenCalled();

        onAttempt(2);
        await flushPromises();

        expect(defaultProps.onAttempt).toHaveBeenCalledTimes(1);
        expect(defaultProps.onAttempt).toHaveBeenCalledWith(
          expect.objectContaining({
            attempt: {
              text: '((*!Era)) ((*un)) ((*cumplido!))',
              number: 1,
              solved: true,
              inputText: '!Era un cumplido!'
            }
          })
        );
      });
    });

    describe('when a mistake is made', () => {
      it('should track attempt', async () => {
        const wrapper = shallow(<WordorderInteraction {...defaultProps} />);
        const { onAttempt } = wrapper.find(Wordorder).props();

        // Get first word correct
        onAttempt(0);
        await flushPromises();

        // Make a mistake on the next item
        matchResult.mockImplementationOnce(({ text }) =>
          Promise.resolve({
            text,
            inputText: text,
            feedbackType: RESULTS.INCORRECT,
            solved: false
          })
        );
        onAttempt(2);
        await flushPromises();

        expect(defaultProps.onAttempt).toHaveBeenCalledTimes(1);
        expect(defaultProps.onAttempt).toHaveBeenCalledWith(
          expect.objectContaining({
            attempt: {
              text: '((*!Era)) ((*un)) ((*cumplido!))',
              number: 2,
              solved: false,
              inputText: '!Era cumplido!'
            }
          })
        );
      });
    });
  });

  describe('completing all gaps', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = shallow(<WordorderInteraction {...defaultProps} />);
      const { onAttempt } = wrapper.find(Wordorder).props();

      onAttempt(0);
      await flushPromises();

      onAttempt(1);
      await flushPromises();

      onAttempt(2);
      await flushPromises();
    });

    describe('before feedback sound is complete', () => {
      it('should not call onFinish', () => {
        expect(defaultProps.onFinish).not.toHaveBeenCalled();
      });
    });

    describe('after feedback sound is complete', () => {
      beforeEach(() => {
        useFeedbackSounds.mockImplementation(() => [
          mockPlayFeedback,
          true
        ]);
        // Hack to update the component so it uses the above mocked value
        wrapper.setProps({});
      });
      it('should call onFinish with numberOfMistakes and attempt', () => {
        const numberOfMistakes = 0;
        expect(defaultProps.onFinish).toHaveBeenCalledTimes(1);
        expect(defaultProps.onFinish).toHaveBeenCalledWith(numberOfMistakes);
      });
    });

    it('should render the input as inactive', () => {
      const input = wrapper.find(InlineTextGap);
      expect(input.exists()).toBe(true);
      expect(input.prop('active')).toBe(false);
    });

    it('should not render wordorder buttons', () => {
      expect(wrapper.find(Wordorder).exists()).toBe(false);
    });
  });
});
