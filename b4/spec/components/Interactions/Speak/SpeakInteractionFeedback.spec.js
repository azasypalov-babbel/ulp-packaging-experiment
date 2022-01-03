import React from 'react';
import { shallow } from 'enzyme';
import { SpeakInteractionFeedback } from '../../../../src/components/Interactions/Speak/SpeakInteractionFeedback';

import useTrainerItemSounds from '../../../../src/components/Trainer/shared/useTrainerItemSounds';
import { RESULTS } from '../../../../src/lib/matchingUtils/evaluate';
import FeedbackSheet from '../../../../src/components/shared/FeedbackSheet/FeedbackSheet';
jest.mock('../../../../src/components/Trainer/shared/useTrainerItemSounds');

jest.useFakeTimers();

const shallowJSXProp = (wrapper, propName) => {
  let Prop = () => wrapper.prop(propName);
  return shallow(<Prop />);
};

describe('speak interaction feedback', () => {
  const defaultProps = {
    latestAttempt: {
      inputText: 'Hi bist du eine Cowboy oder',
      text: 'Hi, du bist Nicole, oder?',
      solved: false,
      feedbackType: 'INCORRECT'
    },
    item: {
      id: '54b0d60a168b9e9bdb979d5086e3c53f',
      type: 'phrase',
      displayLanguageText: null,
      learnLanguageText: '**Kani:** ((Hi, du bist Nicole, oder?))',
      infoText: null,
      image: null,
      sound: {
        id: 'd3572193477785b1bc030cdf61ec777c'
      },
      speakerRole: 'f1'
    },
    onProceed: jest.fn(),
    onRetry: jest.fn(),
    translations: {
      positiveFeedback: 'Nice!',
      negativeFeedback: 'Give it another shot...'
    }
  };

  let mockPlayItemSound = jest.fn();

  beforeEach(() => {
    useTrainerItemSounds.mockImplementation(() => [
      mockPlayItemSound,
      () => false
    ]);
  });

  describe('correct attempt', () => {
    let correctProps = {
      ...defaultProps,
      latestAttempt: {
        ...defaultProps.latestAttempt,
        solved: true,
        feedbackType: RESULTS.CORRECT
      }
    };

    it('should show positive feedback', () => {
      const wrapper = shallow(<SpeakInteractionFeedback {...correctProps} />);

      const { text, state } = shallowJSXProp(
        wrapper.find(FeedbackSheet),
        'feedbackDetail'
      ).props();

      expect(text).toEqual('Hi, du bist Nicole, oder?');
      expect(state).toEqual('success');
    });

    it('should not show any buttons', () => {
      const wrapper = shallow(<SpeakInteractionFeedback {...correctProps} />);

      let { onContinueClick, onTryAgainClick } = wrapper.find(FeedbackSheet).props();

      expect(onContinueClick).toBeUndefined();
      expect(onTryAgainClick).toBeUndefined();
    });

    it('should automatically proceed after 1000ms', () => {
      let onProceed = jest.fn();
      shallow(<SpeakInteractionFeedback {...correctProps} onProceed={onProceed} />);

      jest.runAllTimers();

      expect(onProceed).toHaveBeenCalled();
    });

    it('should not play item sound when clicking on speak item', () => {
      let wrapper = shallow(<SpeakInteractionFeedback {...correctProps} />);

      const { onClick } = shallowJSXProp(
        wrapper.find(FeedbackSheet),
        'feedbackDetail'
      ).props();

      expect(onClick).toBeUndefined();
    });
  });

  describe('incorrect attempt', () => {
    let incorrectProps = {
      ...defaultProps,
      latestAttempt: {
        ...defaultProps.latestAttempt,
        solved: false,
        feedbackType: RESULTS.INCORRECT
      }
    };

    it('should show positive feedback', () => {
      const wrapper = shallow(<SpeakInteractionFeedback {...incorrectProps} />);

      const { text, state } = shallowJSXProp(
        wrapper.find(FeedbackSheet),
        'feedbackDetail'
      ).props();

      expect(text).toEqual('Hi, du bist Nicole, oder?');
      expect(state).toEqual('error');
    });

    it('should not show any buttons', () => {
      let onProceed = jest.fn();
      let onRetry = jest.fn();
      const wrapper = shallow(<SpeakInteractionFeedback
        {...incorrectProps}
        onProceed={onProceed}
        onRetry={onRetry}
      />);

      let { onContinueClick, onTryAgainClick } = wrapper.find(FeedbackSheet).props();

      // press button 1
      onTryAgainClick();
      expect(onRetry).toHaveBeenCalled();

      // press button 2
      onContinueClick();
      expect(onProceed).toHaveBeenCalled();
    });

    it('should not automatically proceed after 1000ms', () => {
      let onProceed = jest.fn();

      shallow(<SpeakInteractionFeedback
        {...incorrectProps}
        onProceed={onProceed}
      />);

      jest.runAllTimers();

      expect(onProceed).not.toHaveBeenCalled();
    });

    it('should play item sound when clicking on speak item', () => {
      let wrapper = shallow(<SpeakInteractionFeedback {...incorrectProps} />);

      const { onClick } = shallowJSXProp(
        wrapper.find(FeedbackSheet),
        'feedbackDetail'
      ).props();

      onClick();

      expect(mockPlayItemSound).toHaveBeenCalledWith(incorrectProps.item);
    });
  });
});
