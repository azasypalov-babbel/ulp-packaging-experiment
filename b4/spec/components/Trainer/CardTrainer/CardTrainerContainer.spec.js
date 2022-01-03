import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { CardTrainerContainer } from '../../../../src/components/Trainer/CardTrainer/CardTrainerContainer';
import ContinueSheet from '../../../../src/components/ContinueSheet';
import CardTrainer from '../../../../src/components/Trainer/CardTrainer/CardTrainer';
import { defaultPropsCardContainer as defaultProps, items } from './defaultProps';
import useTrainerItemSounds from '../../../../src/components/Trainer/shared/useTrainerItemSounds';
import { wait } from '../../../../src/components/shared/wait';

jest.mock('../../../../src/components/Trainer/CardTrainer/CardTrainer', () => 'CardTrainer');
jest.mock('../../../../src/components/Trainer/shared/useTrainerItemSounds');
jest.mock('../../../../src/components/shared/wait');

const mockPlayItemSound = jest.fn(() => Promise.resolve());

describe('CardTrainerContainer', () => {
  beforeEach(() => {
    wait.mockImplementation(() => new Promise(() => {}));
    useTrainerItemSounds.mockImplementation(() => [
      mockPlayItemSound,
      false
    ]);
  });

  it('renders CardTrainer component', async () => {
    const wrapper = shallow(<CardTrainerContainer {...defaultProps} />);
    expect(wrapper.find(CardTrainer).exists()).toEqual(true);
  });

  it('calls onStart method when mounting', () => {
    shallow(<CardTrainerContainer {...defaultProps} />);

    expect(defaultProps.onStart).toHaveBeenCalledWith({
      scorableItemsCount: 4
    });
  });

  describe('when an attempt is made', () => {
    it('should track attempt with item and trainer data', () => {
      const wrapper = shallow(
        <CardTrainerContainer {...defaultProps} />
      );
      const onAttempt = (...args) =>
        wrapper.find(CardTrainer).prop('onAttempt')(...args);

      const mockItem = defaultProps.trainer.itemGroups[0].items[0];
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
          /* eslint-disable camelcase */
          interaction_mode: defaultProps.trainer.interaction,
          item_position_in_trainer: 0,
          number_of_items_in_trainer: defaultProps.trainer.itemGroups[0].items.length,
          translation_mode: defaultProps.trainer.translationVisibility
          /* eslint-enable camelcase */
        }
      );
    });
  });

  describe('when an item is completed', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<CardTrainerContainer {...defaultProps} />);

      // Complete first item with 0 mistakes
      wrapper.find(CardTrainer).prop('onItemComplete')(0);
    });

    it('shouldn\'t display continue sheet', async () => {
      expect(wrapper.find(ContinueSheet).exists()).toEqual(false);
    });

    it('should display infotext', () => {
      expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(1);
      expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
        expect.objectContaining({
          infoText: 'Testing 123'
        })
      );
    });
  });

  describe('info text for non interactive items', () => {
    beforeEach(() => {
      defaultProps.displayInfoText.mockClear();
      shallow(<CardTrainerContainer
        {...defaultProps}
        trainer={{
          ...defaultProps.trainer,
          itemGroups: [{
            items: items.filter(({ id }) => id === 'c')
          }]
        }}
      />);
    });
    it('should present infotext', () => {
      expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(1);
      expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
        expect.objectContaining({ infoText: 'More Useful Info' })
      );
    });
  });

  describe('item playback sounds', () => {
    describe('interactive row', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = shallow(<CardTrainerContainer
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
        wrapper.find(CardTrainer).prop('onItemComplete')(0);
        expect(mockPlayItemSound).toHaveBeenCalledWith(
          expect.objectContaining({ sound: { id: 'aa' } })
        );
      });
    });
    describe('non interactive row', () => {
      it('should play automatically', () => {
        shallow(<CardTrainerContainer
          {...defaultProps}
          trainer={{
            ...defaultProps.trainer,
            itemGroups: [{
              items: items.filter(({ id }) => id === 'e')
            }]
          }}
        />);

        expect(mockPlayItemSound).toHaveBeenCalledWith(
          expect.objectContaining({ sound: { id: 'bb' } })
        );
      });
    });
  });

  describe('proceeding to the next item', () => {
    let wrapper;
    describe('when there are items', () => {
      beforeEach(async () => {
        const props = {
          ...defaultProps,
          currentTrainerItemIndex: 0
        };
        mockPlayItemSound.mockImplementation(() => Promise.resolve());
        wait.mockImplementation(() => Promise.resolve());

        await act(async () => {
          wrapper = shallow(<CardTrainerContainer {...props} />);
        });

        const { onItemComplete } = wrapper.find(CardTrainer).props();
        await onItemComplete(0);
      });

      it('should track current item as completed', () => {
        const numberOfMistakes = 0;

        expect(defaultProps.completeItem).toHaveBeenCalledTimes(1);
        expect(defaultProps.completeItem).toHaveBeenCalledWith(
          expect.objectContaining(defaultProps.trainer.itemGroups[0].items[0]),
          numberOfMistakes
        );
      });

      it('should advance to the next item', () => {
        const { currentItem } = wrapper.find(CardTrainer).props();
        expect(currentItem).toEqual(items[1]);
      });
    });
  });
});
