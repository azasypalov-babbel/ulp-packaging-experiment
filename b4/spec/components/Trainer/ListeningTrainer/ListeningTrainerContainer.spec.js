import React from 'react';
import { shallow } from 'enzyme';
import {
  ListeningTrainerContainer
} from '../../../../src/components/Trainer/ListeningTrainer/ListeningTrainerContainer';

import shuffle from '../../../../src/lib/shuffle';

import { formatDL, formatLL } from '../../../../src/lib/markupFormatter';
jest.mock('../../../../src/lib/markupFormatter', () => ({
  formatLL: jest.fn((arg) => arg),
  formatDL: jest.fn((arg) => arg)
}));

jest.mock('../../../../src/lib/shuffle', () => jest.fn(({ array }) => array));

import playFeedbackSound from '../../../../src/lib/playFeedbackSound';
jest.mock('../../../../src/lib/playFeedbackSound');

playFeedbackSound.mockImplementation((soundId, { onEnded }) => {
  if (onEnded) onEnded();
});

jest.useFakeTimers();

const mockAudio = {
  playSound: jest.fn(),
  playSoundWithState: jest.fn(),
  preload: jest.fn(),
  reset: jest.fn(),
  register: jest.fn(),
  cleanup: jest.fn(),
  stop: jest.fn()
};

describe('<ListeningTrainerContainer />', () => {
  const mockTrack = jest.fn();
  const mockToggleHints = jest.fn();

   /* eslint-disable camelcase */
  const defaultProps = {
    trainer: {
      interaction: 'show',
      item_groups: [
        {
          items: [
            {
              id: 'a',
              sound: { id: 'aa' },
              learn_language_text: 'test a',
              display_language_text: 'TEST A'
            },
            {
              id: 'b',
              sound: { id: 'bb' },
              learn_language_text: 'test b',
              display_language_text: 'TEST B'
            },
            {
              id: 'c',
              sound: { id: 'cc' },
              learn_language_text: 'test c',
              display_language_text: 'TEST C'
            },
            {
              id: 'd',
              sound: { id: 'dd' },
              learn_language_text: 'test d',
              display_language_text: 'TEST D'
            }
          ]
        }
      ]
    },
    mediaUrlService: {
      soundURL: jest.fn()
    },
    audio: mockAudio,
    onStart: jest.fn(),
    onFinish: jest.fn(),
    track: mockTrack,
    locale: 'en',
    learnLanguageAlpha3: 'FRA',
    toggleHints: mockToggleHints,
    attemptItem: jest.fn(),
    completeItem: jest.fn(),
    skipItem: jest.fn(),
    addMessage: jest.fn()
  };
  /* eslint-enable camelcase */

  describe('#onSoundPlayerError', () => {
    let instance;
    let component;

    beforeEach(() => {
      component = shallow(<ListeningTrainerContainer {...defaultProps} />);
      instance = component.instance();

      instance.onSoundPlayerError('Mock Error: sound is broken');
    });

    test('skips item', () => {
      const item = expect.objectContaining({ id: 'a' });

      /* eslint-disable camelcase */
      const expectedTrainerData = {
        interaction_mode: 'show',
        item_position_in_trainer: 1,
        number_of_items_in_trainer: 4,
        translation_mode: ''
      };
      /* eslint-enable camelcase */

      expect(defaultProps.skipItem).toHaveBeenCalledTimes(1);
      expect(defaultProps.skipItem).toHaveBeenCalledWith(item, instance.state.attempt, expectedTrainerData);
    });

    test('resets attempt in the state', () => {
      expect(instance.state.attempt).toEqual(undefined);
    });

    test('hides choice items', () => {
      expect(instance.state.showChoiceItems).toEqual(false);
    });

    describe('when there are more items left', () => {
      test('removes item with broken sound from the state', () => {
        expect(instance.state.items).not.toContainEqual(expect.objectContaining({ item: { id: 'a' } }));
      });
    });

    describe('when there are no more items left', () => {
      let spyOnFinish;

      beforeEach(() => {
        spyOnFinish = jest.spyOn(instance.props, 'onFinish');

        instance.setState({ currentIndex: instance.state.items.length - 1 });
        instance.onSoundPlayerError('Mock Error: sound is broken');
      });

      afterEach(() => {
        spyOnFinish.mockClear();
      });

      test('calls onFinish callback prop', () => {
        expect(spyOnFinish).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#handleContinueClick', () => {
    let instance;
    let component;

    beforeEach(() => {
      component = shallow(<ListeningTrainerContainer {...defaultProps} />);
      instance = component.instance();
      shuffle.mockClear();
    });

    test('calls completeItem sequence action', () => {
      instance.handleContinueClick({ id: 'a' }, 0);

      expect(defaultProps.completeItem).toHaveBeenCalledTimes(1);
      expect(defaultProps.completeItem).toHaveBeenCalledWith({ id: 'a' }, 0);
    });

    test('should shuffle choice items', () => {
      const initialShuffledItems = component.state('currentShuffledItems');

      instance.handleContinueClick({ id: 'a' }, 0);
      component.update();
      const shuffledItems = component.state('currentShuffledItems');
      expect(shuffle).toHaveBeenCalledTimes(1);
      expect(shuffledItems).not.toBe(initialShuffledItems);
    });

    describe('when there are more item left', () => {
      test('increments the index', () => {
        instance.handleContinueClick({ id: 'a' }, 0);

        expect(instance.state.currentIndex).toEqual(1);
      });
    });

    describe('when there are not more items left', () => {
      test('calls onFinish callback prop', () => {
        const spyOnFinish = jest.spyOn(instance.props, 'onFinish');
        instance.setState({
          currentIndex: instance.state.items.length - 1
        });
        instance.handleContinueClick({ id: 'a' }, 0);

        jest.runAllTimers();
        expect(spyOnFinish).toHaveBeenCalledTimes(1);
      });

      test('stops audio to play', () => {
        instance.setState({
          currentIndex: instance.state.items.length - 1
        });
        instance.handleContinueClick({ id: 'a' }, 0);

        expect(mockAudio.stop).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#handleChoiceItemClick', () => {
    let instance;

    beforeEach(() => {
      const component = shallow(<ListeningTrainerContainer {...defaultProps} />);
      instance = component.instance();
      mockAudio.playSound.mockClear();
      mockAudio.playSoundWithState.mockClear();
    });

    test('calls attemptItem sequence action', () => {
      const item = {
        id: 'a',
        sound: { id: 'aa' },
        learnLanguageText: 'test a',
        displayLanguageText: 'TEST A'
      };
      const attempt = { text: 'One', solved: true };

      instance.handleChoiceItemClick({ text: 'One', mistakes: 0 });

      expect(defaultProps.attemptItem).toHaveBeenCalledTimes(1);
      expect(defaultProps.attemptItem).toHaveBeenCalledWith(item, attempt);
    });

    describe('when correct', () => {
      test('calls playSound AND playSoundWithState', () => {
        instance.handleChoiceItemClick({ text: 'One', mistakes: 0 });

        expect(playFeedbackSound).toHaveBeenCalledTimes(1);
        expect(mockAudio.playSoundWithState).toHaveBeenCalledTimes(1);
      });
    });

    describe('when incorrect', () => {
      test('calls playSound', () => {
        instance.handleChoiceItemClick({ text: 'One', mistakes: 1 });

        expect(playFeedbackSound).toHaveBeenCalledTimes(1);
        expect(mockAudio.playSoundWithState).not.toHaveBeenCalled();
      });
    });
  });

  describe('trainer item formatting', () => {
    let instance;

    beforeEach(() => {
      formatLL.mockClear();
      formatDL.mockClear();

      const component = shallow(<ListeningTrainerContainer {...defaultProps} />);
      instance = component.instance();
    });

    test('calls formatting methods', () => {
      expect(formatLL).toHaveBeenCalledTimes(instance.state.items.length);
      expect(formatDL).toHaveBeenCalledTimes(instance.state.items.length);
    });
  });

  describe('shuffles choiceItems', () => {
    beforeEach(() => {
      shuffle.mockClear();
    });

    test('does not shuffle items with new props', () => {
      const component = shallow(<ListeningTrainerContainer {...defaultProps} />);

      expect(shuffle).toHaveBeenCalledTimes(1);
      expect(component.state('currentShuffledItems')).toHaveLength(4);
    });
  });

  describe('handleToggleShortcuts', () => {
    let instance;

    beforeEach(() => {
      mockToggleHints.mockClear();
      mockTrack.mockClear();
      const component = shallow(<ListeningTrainerContainer {...defaultProps} />);
      instance = component.instance();
      instance.handleToggleShortcuts();
    });

    test('calls track with required payload', () => {
      expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
    });

    test('calls toggleHints', () => {
      expect(mockToggleHints).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleKeyboardTriggeredAttempt', () => {
    let instance;

    beforeEach(() => {
      mockTrack.mockClear();
      const component = shallow(<ListeningTrainerContainer {...defaultProps} />);
      instance = component.instance();
      instance.handleKeyboardTriggeredAttempt();
    });

    test('calls track with required payload', () => {
      expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
    });
  });
});
