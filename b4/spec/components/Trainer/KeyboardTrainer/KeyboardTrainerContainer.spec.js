import React from 'react';
import { shallow } from 'enzyme';
import { KeyboardTrainerContainer } from '../../../../src/components/Trainer/KeyboardTrainer/KeyboardTrainerContainer';
import ContinueSheet from '../../../../src/components/ContinueSheet';
import KeyboardTrainer from '../../../../src/components/Trainer/KeyboardTrainer/KeyboardTrainer';
import { defaultPropsKeyboardContainer as defaultProps, items } from './defaultProps';
import useTrainerItemSounds from '../../../../src/components/Trainer/shared/useTrainerItemSounds';

jest.mock('../../../../src/components/Trainer/KeyboardTrainer/KeyboardTrainer', () => 'KeyboardTrainer');
jest.mock('../../../../src/components/Trainer/shared/useTrainerItemSounds');

const mockPlayItemSound = jest.fn(() => Promise.resolve());

describe('KeyboardTrainerContainer', () => {
  beforeEach(() => {
    useTrainerItemSounds.mockImplementation(() => [
      mockPlayItemSound,
      false
    ]);
  });
  it('renders KeyboardTrainer component', async () => {
    const wrapper = shallow(<KeyboardTrainerContainer {...defaultProps} />);
    expect(wrapper.find(KeyboardTrainer).exists()).toEqual(true);
  });

  it('calls onStart method when mounting', () => {
    shallow(<KeyboardTrainerContainer {...defaultProps} />);

    expect(defaultProps.onStart).toHaveBeenCalledWith({
      scorableItemsCount: 4
    });
  });

  describe('when an attempt is made', () => {
    it('should track attempt with item and trainer data', () => {
      const wrapper = shallow(<KeyboardTrainerContainer {...defaultProps} />);
      const onAttempt = (...args) => wrapper.find(KeyboardTrainer).prop('onAttempt')(...args);
      const mockItem = defaultProps.trainer.itemGroups[0].items[0];
      const mockAttempt = {
        number: 1,
        solved: true,
        text: '((ш))',
        inputText: ''
      };
      /* eslint-disable max-len */
      const numberOfItemsInTrainer = defaultProps.trainer.itemGroups[0].items.length + defaultProps.trainer.itemGroups[1].items.length;
      /* eslint-enable max-len */

      // make attempt
      onAttempt({ attempt: mockAttempt });

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
          /* eslint-disable camelcase */
          interaction_mode: defaultProps.trainer.interaction,
          item_position_in_trainer: 0,
          number_of_items_in_trainer: numberOfItemsInTrainer,
          translation_mode: defaultProps.trainer.translationVisibility
          /* eslint-enable camelcase */
        }
      );
    });
  });

  describe('when an item is completed', () => {
    let wrapper;
    beforeEach(() => {
      const props = {
        ...defaultProps,
        currentTrainerItemIndex: 2
      };
      wrapper = shallow(<KeyboardTrainerContainer {...props} />);

      // Complete first item with 0 mistakes
      const { onItemComplete } = wrapper.find(KeyboardTrainer).props();
      onItemComplete(0);
    });

    it('shouldn\'t display continue sheet', async () => {
      expect(wrapper.find(ContinueSheet).exists()).toEqual(false);
    });

    it('should display infotext', () => {
      expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(1);
      expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
        expect.objectContaining({
          infoText: items[2].infoText
        })
      );
    });
  });

  describe('item playback sounds', () => {
    describe('interactive row', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = shallow(<KeyboardTrainerContainer
          {...defaultProps}
          trainer={{
            ...defaultProps.trainer,
            itemGroups: [{
              items: items.filter(({ id }) => id === 'a')
            }]
          }}
        />);
      });
      it('should not play automatically', () => {
        expect(mockPlayItemSound).not.toHaveBeenCalled();
      });
      it('should play item sound after attempt', () => {
        const { onItemComplete } = wrapper.find(KeyboardTrainer).props();
        onItemComplete(0);
        expect(mockPlayItemSound).toHaveBeenCalledWith(
          expect.objectContaining({ sound: { id: 'aa' } })
        );
      });
    });
  });

  describe('proceeding to the next item', () => {
    let wrapper;
    describe('when there are items', () => {
      beforeEach(() => {
        const props = {
          ...defaultProps,
          currentTrainerItemIndex: 1
        };
        wrapper = shallow(<KeyboardTrainerContainer {...props} />);

        // Complete item at index 1 with 0 mistakes
        const { onItemComplete } = wrapper.find(KeyboardTrainer).props();
        onItemComplete(0);
      });

      it('should track current item as completed', () => {
        const numberOfMistakes = 0;

        expect(defaultProps.completeItem).toHaveBeenCalledWith(
          expect.objectContaining(defaultProps.trainer.itemGroups[1].items[0]),
          numberOfMistakes
        );
      });

      it('should provide the current active item', () => {
        const item = wrapper.find(KeyboardTrainer).prop('currentItem');
        expect(item).toBe(items[2]);
      });
    });
  });
});

