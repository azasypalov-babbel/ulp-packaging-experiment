import React from 'react';

import { normalizeScriptedString, getFirstCorrectSolution } from '@lessonnine/babbel-markup-helper.js';
import VocabularyTrainer from '../../../../src/components/Trainer/VocabularyTrainer/VocabularyTrainer';
import { VocabularyTrainerContainer }
  from '../../../../src/components/Trainer/VocabularyTrainer/VocabularyTrainerContainer';
import { TRAINER_STATE } from '../../../../src/components/Trainer/VocabularyTrainer/constants';
import { mountWithTheme } from '../../shared/themeMock';
import getComponentFromInteractionType from '../../../../src/lib/getComponentFromInteractionType';
import { act } from 'react-dom/test-utils';
import { withServicesProvider } from '../../../../src/components/shared/withServices';

jest.mock(
  '../../../../src/components/Trainer/VocabularyTrainer/VocabularyTrainer',
  // eslint-disable-next-line react/prop-types
  () => ({ interaction }) => <>{interaction}</>
);
jest.mock('../../../../src/components/shared/wait', () => ({
  wait: jest.fn(() => Promise.resolve())
}));
jest.mock('../../../../src/lib/getComponentFromInteractionType', () => jest.fn());
const ContinueSheet = () => null;
jest.mock('../../../../src/components/ContinueSheet', () => ContinueSheet);

jest.mock('@lessonnine/babbel-markup-helper.js', () => ({
  normalizeScriptedString: jest.fn((s) => s),
  getFirstCorrectSolution: jest.fn((s) => s)
}));

jest.mock('../../../../src/components/Trainer/shared/useTrainerItemSounds');
const MockInteraction = () => null;
getComponentFromInteractionType.mockReturnValue(MockInteraction);

describe('VocabularyTrainerContainer', () => {
  const defaultProps = {
    trainer: {
      title: null,
      interaction: 'wordorder',
      translation_visibility: 'full',
      item_groups: [
        {
          items: [
            {
              id: 'a',
              sound: { id: 'sound_id' },
              image: { id: '123' },
              info_text: 'Testing 123',
              learn_language_text: 'der ((Hibiskus))',
              display_language_text: 'the hibiskus'
            },
            {
              id: 'b',
              learn_language_text: 'one ((two)) ((three))',
              display_language_text: 'uno Dos TRES'
            }
          ]
        }
      ]
    },
    onStart: jest.fn(),
    onFinish: jest.fn(),
    track: jest.fn(),
    learnLanguageAlpha3: 'DEU',
    currentTrainerItemIndex: 0,
    attemptItem: jest.fn(),
    completeItem: jest.fn(),
    clearInfoTextUI: jest.fn(),
    displayInfoText: jest.fn()
  };

  const services = {
    mediaUrlService: {
      soundURL: (id) => id
    },
    soundService: {
      stop: jest.fn(),
      play: jest.fn(),
      preload: () => {}
    }
  };
  const Component = withServicesProvider(() => services)(VocabularyTrainerContainer);

  const getWrapper = (props = {}) => mountWithTheme(
    <Component {...defaultProps} {...props} />
  );
  const solveItem = async (wrapper) => {
    // Complete first item with 0 mistakes
    wrapper.find(MockInteraction).invoke('onFinish')(0, { solved: true });
    await act(() => {
      return wrapper.find(VocabularyTrainer).invoke('onSoundPlayComplete')();
    });
    wrapper.update();
    return wrapper;
  };
  const switchToNextItem = (wrapper) => {
    act(() => {
      // Click continue button
      wrapper.find(ContinueSheet).prop('onClick')();
    });
    /**
     * Relying on the application state for current item index is not a good practice
     * This should be kept locally in the trainer to remove this tight dependance.
     */
    wrapper.setProps({ currentTrainerItemIndex: 1 });
    wrapper.update();
    return wrapper;
  };

  it('renders VocabularyTrainer component', async () => {
    const wrapper = getWrapper();
    expect(wrapper.find(VocabularyTrainer).exists()).toEqual(true);
  });

  describe('trainer item formatting', () => {
    beforeEach(() => {
      getFirstCorrectSolution.mockClear();
      getWrapper();
    });

    it('formats the display language items', () => {
      expect(getFirstCorrectSolution).toHaveBeenCalledTimes(
        defaultProps.trainer.item_groups[0].items.length
      );
    });

    it('normalises the learn language items', () => {
      expect(normalizeScriptedString).toHaveBeenCalledTimes(
        defaultProps.trainer.item_groups[0].items.length
      );
    });
  });

  it('calls onStart method when mounting', () => {
    getWrapper();

    expect(defaultProps.onStart).toHaveBeenCalledWith({
      scorableItemsCount: defaultProps.trainer.item_groups[0].items.length
    });
  });

  describe('when an attempt is made', () => {
    it('should track attempt with item and trainer data', () => {
      const wrapper = getWrapper();
      const onAttempt = (...args) =>
        wrapper.find(MockInteraction).prop('onAttempt')(...args);

      const mockItem = defaultProps.trainer.item_groups[0].items[0];
      const mockAttempt = {
        number: 1,
        solved: true,
        text: 'der',
        inputText: ''
      };
      onAttempt({
        attempt: mockAttempt
      });

      expect(defaultProps.attemptItem).toHaveBeenCalledTimes(1);
      expect(defaultProps.attemptItem).toHaveBeenCalledWith(
        mockItem,
        {
          number: 1,
          solved: true,
          text: mockAttempt.inputText,
          targetText: mockAttempt.text
        },
        {
          interaction_mode: 'wordorder',
          item_position_in_trainer: 0,
          number_of_items_in_trainer: 2,
          translation_mode: 'full'
        }
      );
    });
  });

  describe('when an item is completed', () => {
    it('should display continue sheet', async () => {
      const wrapper = await solveItem(getWrapper());
      expect(wrapper.find(ContinueSheet).exists()).toEqual(true);
    });

    it('should render wordorder as inactive', async () => {
      const wrapper = await solveItem(getWrapper());
      expect(wrapper.find(VocabularyTrainer).prop('trainerState')).toEqual(TRAINER_STATE.AWAITING_CONTINUE);
    });

    it('should display infotext', async () => {
      await solveItem(getWrapper());
      expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
        expect.objectContaining({
          info_text: 'Testing 123'
        })
      );
    });
  });

  describe('proceeding to the next item', () => {
    describe('when there are items', () => {
      it('should track current item as completed', async () => {
        switchToNextItem(await solveItem(getWrapper()));
        const numberOfMistakes = 0;

        /**
         * For this action only item id is required, yet the object we recieve here
         * is an "item" except some keys are camel case and others snake case.
         * This could be come a problem
         */
        expect(defaultProps.completeItem).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'a' }),
          numberOfMistakes
        );
      });

      it('should hide the continue sheet', async () => {
        const wrapper = switchToNextItem(await solveItem(getWrapper()));
        expect(wrapper.find(ContinueSheet).exists()).toEqual(false);
      });

      it('should advance to the next item', async () => {
        const wrapper = switchToNextItem(await solveItem(getWrapper()));
        expect(wrapper.find(VocabularyTrainer).prop('item')).toEqual(
          expect.objectContaining({ id: 'b' })
        );
      });

      it('should render wordorder as active', async () => {
        const wrapper = switchToNextItem(await solveItem(getWrapper()));
        expect(wrapper.find(VocabularyTrainer).prop('trainerState')).toEqual(TRAINER_STATE.READY);
      });

      it('should stop playing sounds', async () => {
        switchToNextItem(await solveItem(getWrapper()));
        expect(services.soundService.stop).toHaveBeenCalledTimes(1);
      });
    });
  });
});
