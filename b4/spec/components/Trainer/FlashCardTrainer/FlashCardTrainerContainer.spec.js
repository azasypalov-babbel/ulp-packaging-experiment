import React from 'react';
import { shallow } from 'enzyme';
import {
  FlashCardTrainerContainer
} from '../../../../src/components/Trainer/FlashCardTrainer/FlashCardTrainerContainer';

import { formatDL, formatLL } from '../../../../src/lib/markupFormatter';
import playFeedbackSound from '../../../../src/lib/playFeedbackSound';


const mockAudio = {
  playSound: jest.fn(),
  playSoundWithState: jest.fn(),
  preload: jest.fn(),
  reset: jest.fn(),
  stop: jest.fn()
};

jest.mock('../../../../src/lib/markupFormatter', () => ({
  formatLL: jest.fn((arg) => arg),
  formatDL: jest.fn((arg) => arg)
}));

jest.mock('../../../../src/lib/playFeedbackSound');

jest.useFakeTimers();

describe('<FlashCardTrainerContainer />', () => {
 /* eslint-disable camelcase */
  const defaultProps = {
    trainer: {
      item_groups: [
        {
          items: [
            {
              id: 'a',
              sound: { id: 'aa-sound' },
              image: { id: 'aa-image' },
              learn_language_text: 'learn a',
              display_language_text: 'display a'
            },
            {
              id: 'b',
              sound: { id: 'bb-sound' },
              image: { id: 'bb-image' },
              learn_language_text: 'learn b',
              display_language_text: 'display b'
            }
          ]
        }
      ]
    },
    /* eslint-enable camelcase */
    onToggleShortcuts: jest.fn(),
    mediaUrlService: {},
    audio: mockAudio,
    locale: 'en',
    learnLanguageAlpha3: 'DEU',
    onStart: jest.fn(),
    onFinish: jest.fn(),
    store: {
      getState: () => ({
        session: {
          locale: 'en',
          learnLanguageAlpha3: 'FRA'
        }
      }),
      subscribe: () => {},
      dispatch: () => {}
    },
    completeItem: jest.fn(),
    attemptItem: jest.fn()
  };

  describe('trainer item formatting', () => {
    let instance;

    beforeEach(() => {
      formatDL.mockClear();
      formatDL.mockClear();

      const component = shallow(<FlashCardTrainerContainer {...defaultProps} />);
      instance = component.instance();
    });

    test('calls formatting methods', () => {
      expect(formatDL).toHaveBeenCalledTimes(instance.state.items.length);
      expect(formatLL).toHaveBeenCalledTimes(instance.state.items.length);
    });
  });

  describe('#handleContinueClick', () => {
    let instance;

    beforeEach(() => {
      const component = shallow(<FlashCardTrainerContainer {...defaultProps} />);
      instance = component.instance();
      defaultProps.completeItem.mockClear();
      defaultProps.attemptItem.mockClear();
    });

    test('calls attemptItem sequence action', () => {
      instance.handleContinueClick({ id: 'a' }, { text: 'a', mistakes: 0 });

      expect(defaultProps.attemptItem).toHaveBeenCalledTimes(1);
      expect(defaultProps.attemptItem).toHaveBeenCalledWith({ id: 'a' }, { solved: true });
    });

    test('calls completeItem sequence action', () => {
      instance.handleContinueClick({ id: 'a' }, { text: 'a', mistakes: 0 });

      expect(defaultProps.completeItem).toHaveBeenCalledTimes(1);
      expect(defaultProps.completeItem).toHaveBeenCalledWith({ id: 'a' }, 0);
    });

    test('calls playSound', () => {
      instance.handleContinueClick({ id: 'a' }, { text: 'a', mistakes: 0 });
      expect(playFeedbackSound).toHaveBeenCalledTimes(1);
    });

    describe('when there are more item left', () => {
      test('increments the index', () => {
        instance.handleContinueClick({ id: 'a' }, { text: 'a', mistakes: 0 });

        expect(instance.state.currentIndex).toEqual(1);
      });
    });

    describe('when there are no more items left', () => {
      test('calls onFinish callback prop', () => {
        const spyOnFinish = jest.spyOn(instance.props, 'onFinish');
        instance.setState({
          currentIndex: instance.state.items.length
        });
        instance.handleContinueClick({ id: 'a' }, { text: 'a', mistakes: 0 });

        jest.runAllTimers();
        expect(spyOnFinish).toHaveBeenCalledTimes(1);
      });
    });
  });
});
