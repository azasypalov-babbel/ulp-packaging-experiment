import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { DialogTrainerContainer } from '../../../../src/components/Trainer/DialogTrainer/DialogTrainerContainer';
import ContinueSheet from '../../../../src/components/ContinueSheet';
import DialogTrainer from '../../../../src/components/Trainer/DialogTrainer/DialogTrainer';
import { defaultPropsDialogContainer as defaultProps, items } from './defaultProps';
import useTrainerItemSounds from '../../../../src/components/Trainer/shared/useTrainerItemSounds';
import { wait } from '../../../../src/components/shared/wait';

jest.mock('../../../../src/components/Trainer/DialogTrainer/DialogTrainer', () => 'DialogTrainer');
jest.mock('../../../../src/components/Trainer/shared/useTrainerItemSounds');
jest.mock('../../../../src/components/shared/wait');

const flushPromises = () => new Promise(setTimeout);
const mockPlayItemSound = jest.fn();

describe('DialogTrainerContainer', () => {
  beforeEach(() => {
    wait.mockImplementation(() => new Promise(() => {}));
    mockPlayItemSound.mockImplementation(() => new Promise(() => {}));
    useTrainerItemSounds.mockImplementation(() => [
      mockPlayItemSound,
      false
    ]);
  });

  it('renders DialogTrainer component', async () => {
    const wrapper = shallow(<DialogTrainerContainer {...defaultProps} />);
    expect(wrapper.find(DialogTrainer).exists()).toEqual(true);
  });

  it('calls onStart method when mounting', () => {
    shallow(<DialogTrainerContainer {...defaultProps} />);

    expect(defaultProps.onStart).toHaveBeenCalledWith({
      scorableItemsCount: 2
    });
  });

  describe('when an attempt is made', () => {
    it('should track attempt with item and trainer data', () => {
      const wrapper = shallow(
        <DialogTrainerContainer {...defaultProps} />
      );
      const { onAttempt } = wrapper.find(DialogTrainer).props();

      const mockItem = items[0];
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
          number_of_items_in_trainer: items.length,
          translation_mode: defaultProps.trainer.translationVisibility
          /* eslint-enable camelcase */
        }
      );
    });
  });

  describe('when one item is completed', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<DialogTrainerContainer {...defaultProps} />);
      mockPlayItemSound.mockImplementation(() => Promise.resolve());
      const { onItemComplete } = wrapper.find(DialogTrainer).props();
      onItemComplete(0);
    });

    it('should call completeItem', async () => {
      expect(defaultProps.completeItem).toHaveBeenCalledTimes(1);
    });

    it('should call completeItem with paramters', async () => {
      const item1 = defaultProps.trainer.itemGroups[0].items[0];
      expect(defaultProps.completeItem).toHaveBeenCalledWith(item1, 0);
    });

    it('shouldn\'t display continue sheet', async () => {
      expect(wrapper.find(ContinueSheet).exists()).toEqual(false);
    });
  });

  describe('when all items are completed', () => {
    let wrapper;
    beforeEach(() => {
      const props = {
        ...defaultProps,
        currentTrainerItemIndex: defaultProps.trainer.itemGroups[0].items.length - 1
      };
      wrapper = shallow(<DialogTrainerContainer {...props} />);
      mockPlayItemSound.mockImplementation(() => Promise.resolve());
      const { onItemComplete } = wrapper.find(DialogTrainer).props();
      onItemComplete(0);
    });

    it('should display continue sheet', async () => {
      expect(wrapper.find(ContinueSheet).exists()).toEqual(true);
    });
  });

  describe('when an item is skipped', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<DialogTrainerContainer {...defaultProps} />);
      mockPlayItemSound.mockImplementation(() => Promise.resolve());
      const { onItemComplete } = wrapper.find(DialogTrainer).props();
      onItemComplete();
    });

    it('should not complete the item', async () => {
      expect(defaultProps.completeItem).not.toHaveBeenCalled();
    });
  });

  describe('complete item with mistakes', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<DialogTrainerContainer {...defaultProps} />);
      mockPlayItemSound.mockImplementation(() => Promise.resolve());
      const { onItemComplete } = wrapper.find(DialogTrainer).props();
      onItemComplete(2);
    });

    it('should call completeItem', async () => {
      const item1 = defaultProps.trainer.itemGroups[0].items[0];
      expect(defaultProps.completeItem).toHaveBeenCalledWith(item1, 2);
    });
  });

  describe('info text', () => {
    afterEach(() => {
      defaultProps.displayInfoText.mockClear();
    });

    describe('an interactive item', () => {
      describe('when followed by another interactive item', () => {
        let wrapper;
        beforeEach(async () => {
          const item1 = defaultProps.trainer.itemGroups[0].items[0];
          const item2 = {
            ...defaultProps.trainer.itemGroups[0].items[2],
            infoText: 'an additional info text',
            learnLanguageText: 'This item ((is)) interactive'
          };
          const props = {
            ...defaultProps,
            trainer: {
              title: null,
              interaction: 'write',
              translationVisibility: 'full',
              itemGroups: [{
                items: [item1, item2]
              }]
            }
          };
          mockPlayItemSound.mockImplementation(() => Promise.reject());
          wait.mockImplementation(() => Promise.resolve());

          await act(async () => {
            wrapper = shallow(<DialogTrainerContainer {...props} />);
          });
        });

        describe('when item is not completed', () => {
          it('should not display any info text', () => {
            expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(0);
          });
        });

        describe('when item is completed', () => {
          beforeEach(async () => {
            mockPlayItemSound.mockImplementation(() => Promise.resolve());
            const { onItemComplete } = wrapper.find(DialogTrainer).props();
            await onItemComplete(0);
          });

          it('should only display the first item\'s info text', () => {
            expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(1);
            expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
              expect.objectContaining({
                infoText: 'Testing 123'
              })
            );
          });
        });
      });

      describe('when followed by a non interactive item without sound', () => {
        let wrapper;
        beforeEach(async () => {
          const item1 = defaultProps.trainer.itemGroups[0].items[0];
          const item2 = defaultProps.trainer.itemGroups[0].items[1];
          const props = {
            ...defaultProps,
            trainer: {
              title: null,
              interaction: 'write',
              translationVisibility: 'full',
              itemGroups: [{
                items: [item1, item2]
              }]
            }
          };
          mockPlayItemSound.mockImplementation(() => Promise.reject());
          wait.mockImplementation(() => Promise.resolve());

          await act(async () => {
            wrapper = shallow(<DialogTrainerContainer {...props} />);
          });
        });

        describe('when item is not completed', () => {
          it('should not display any info text', () => {
            expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(0);
          });
        });

        describe('when item is completed', () => {
          beforeEach(async () => {
            const { onItemComplete } = wrapper.find(DialogTrainer).props();
            await onItemComplete(0);
          });

          it('should display both items\' info texts', () => {
            expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(2);
            expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
              expect.objectContaining({
                infoText: 'Testing 123'
              })
            );
            expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
              expect.objectContaining({
                infoText: 'Useful Info'
              })
            );
          });
        });
      });
    });

    describe('non interactive item without sound but with info text', () => {
      describe('when followed by a non interactive item without sound but with info text', () => {
        beforeEach(async () => {
          const item1 = defaultProps.trainer.itemGroups[0].items[1];
          const item2 = {
            ...defaultProps.trainer.itemGroups[0].items[4],
            infoText: 'another interesting information'
          };
          delete item2.sound;
          delete item2.speakerRole;
          const props = {
            ...defaultProps,
            trainer: {
              title: null,
              interaction: 'write',
              translationVisibility: 'full',
              itemGroups: [{
                items: [item1, item2]
              }]
            }
          };
          mockPlayItemSound.mockImplementation(() => Promise.reject());
          wait.mockImplementation(() => Promise.resolve());

          await act(async () => {
            shallow(<DialogTrainerContainer {...props} />);
          });
        });

        it('should call twice displayInfoText', () => {
          expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(2);
        });

        it('should display both items\' info texts on render', () => {
          expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
            expect.objectContaining({ infoText: 'Useful Info' })
          );
          expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
            expect.objectContaining({ infoText: 'another interesting information' })
          );
        });
      });

      describe('when followed by an interactive item', () => {
        let item1;
        beforeEach(async () => {
          item1 = defaultProps.trainer.itemGroups[0].items[1];
          const item2 = defaultProps.trainer.itemGroups[0].items[0];
          const props = {
            ...defaultProps,
            trainer: {
              title: null,
              interaction: 'write',
              translationVisibility: 'full',
              itemGroups: [{
                items: [item1, item2]
              }]
            }
          };
          mockPlayItemSound.mockImplementation(() => Promise.reject());
          wait.mockImplementation(() => Promise.resolve());

          await act(async () => {
            shallow(<DialogTrainerContainer {...props} />);
          });
        });

        it('should only display the first item\'s info text on render', () => {
          expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(1);
          expect(defaultProps.displayInfoText).toHaveBeenCalledWith(item1);
          expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
            expect.objectContaining({ infoText: 'Useful Info' })
          );
        });
      });
    });

    describe('non interactive item', () => {
      describe('when item has no sound and no info text', () => {
        beforeEach(async () => {
          const item = {
            id: 'a',
            type: 'task',
            displayLanguageText: 'Jetzt gehen Hänsel und Gretel in den Wald.'
          };
          const props = {
            ...defaultProps,
            trainer: {
              title: null,
              interaction: 'write',
              translationVisibility: 'full',
              itemGroups: [{
                items: [item]
              }]
            }
          };
          mockPlayItemSound.mockImplementation(() => Promise.reject());
          wait.mockImplementation(() => Promise.resolve());

          await act(async () => {
            shallow(<DialogTrainerContainer {...props} />);
          });
        });

        it('should not call displayInfoText', () => {
          expect(defaultProps.displayInfoText).not.toHaveBeenCalled();
        });
      });

      describe('when item has no sound but info text', () => {
        beforeEach(async () => {
          const item = defaultProps.trainer.itemGroups[0].items[1];
          const props = {
            ...defaultProps,
            trainer: {
              title: null,
              interaction: 'write',
              translationVisibility: 'full',
              itemGroups: [{
                items: [item]
              }]
            }
          };
          mockPlayItemSound.mockImplementation(() => Promise.reject());
          wait.mockImplementation(() => Promise.resolve());

          await act(async () => {
            shallow(<DialogTrainerContainer {...props} />);
          });
        });

        it('should call displayInfoText', () => {
          expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(1);
        });
      });

      describe('when item has sound but no info text', () => {
        beforeEach(async () => {
          const item = defaultProps.trainer.itemGroups[0].items[4];
          const props = {
            ...defaultProps,
            trainer: {
              title: null,
              interaction: 'write',
              translationVisibility: 'full',
              itemGroups: [{
                items: [item]
              }]
            }
          };
          mockPlayItemSound.mockImplementation(() => Promise.resolve());
          wait.mockImplementation(() => Promise.resolve());

          await act(async () => {
            shallow(<DialogTrainerContainer {...props} />);
          });
        });

        it('should not call displayInfoText', () => {
          expect(defaultProps.displayInfoText).not.toHaveBeenCalled();
        });
      });

      describe('when item has sound and info text', () => {
        beforeEach(async () => {
          const item = {
            ...defaultProps.trainer.itemGroups[0].items[4],
            infoText: 'This is good information'
          };
          const props = {
            ...defaultProps,
            trainer: {
              title: null,
              interaction: 'write',
              translationVisibility: 'full',
              itemGroups: [{
                items: [item]
              }]
            }
          };
          mockPlayItemSound.mockImplementation(() => Promise.resolve());
          wait.mockImplementation(() => Promise.resolve());

          await act(async () => {
            shallow(<DialogTrainerContainer {...props} />);
          });
        });

        it('should call displayInfoText', () => {
          expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('item playback sounds', () => {
    describe('interactive row', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = shallow(<DialogTrainerContainer
          {...defaultProps}
          trainer={{
            ...defaultProps.trainer,
            itemGroups: [{ items: [items[0]] }]
          }}
        />);
      });

      it('should not play automatically', () => {
        expect(mockPlayItemSound).not.toHaveBeenCalled();
      });

      it('should play item sound after item completion', () => {
        const { onItemComplete } = wrapper.find(DialogTrainer).props();
        mockPlayItemSound.mockClear();
        onItemComplete(0);
        expect(mockPlayItemSound).toHaveBeenCalledWith(
          expect.objectContaining({ sound: { id: 'aa' } })
        );
      });
    });

    describe('non interactive row', () => {
      it('should play automatically', () => {
        shallow(<DialogTrainerContainer
          {...defaultProps}
          trainer={{
            ...defaultProps.trainer,
            itemGroups: [{ items: [items[4]] }]
          }}
        />);
        expect(mockPlayItemSound).toHaveBeenCalledWith(
          expect.objectContaining({ sound: { id: 'ee' } })
        );
      });
    });

    describe('when in dictate mode', () => {
      describe('interactive row', () => {
        let wrapper;
        beforeEach(() => {
          wrapper = shallow(<DialogTrainerContainer
            {...defaultProps}
            trainer={{
              ...defaultProps.trainer,
              dictate: true,
              itemGroups: [{ items: [items[0]] }]
            }}
          />);
        });

        it('should play automatically', () => {
          expect(mockPlayItemSound).toHaveBeenCalledWith(
            expect.objectContaining({ sound: { id: 'aa' } })
          );
        });

        it('should not play item sound after item completion', () => {
          const { onItemComplete } = wrapper.find(DialogTrainer).props();
          mockPlayItemSound.mockClear();
          onItemComplete(0);
          expect(mockPlayItemSound).not.toHaveBeenCalled();
        });
      });

      it('should not continue to next item until item sound is done', async () => {
        let resolveItemPlayback;
        mockPlayItemSound.mockImplementation(() => new Promise((resolve) => { resolveItemPlayback = resolve; }));
        wait.mockImplementation(() => Promise.resolve());
        const wrapper = shallow(<DialogTrainerContainer
          {...defaultProps}
          trainer={{
            ...defaultProps.trainer,
            dictate: true
          }}
        />);
        const { currentItem: initialCurrentItem } = wrapper.find(DialogTrainer).props();
        const { onItemComplete } = wrapper.find(DialogTrainer).props();
        onItemComplete(0);

        const { currentItem } = wrapper.find(DialogTrainer).props();
        expect(currentItem).toEqual(initialCurrentItem);

        resolveItemPlayback();
        await flushPromises();
        const { currentItem: finalCurrentItem } = wrapper.find(DialogTrainer).props();
        expect(finalCurrentItem).not.toEqual(initialCurrentItem);
      });
    });
  });

  describe('proceeding to the next item', () => {
    describe('when item is non interactive', () => {
      let wrapper;
      let item3;
      beforeEach(async () => {
        const item1 = defaultProps.trainer.itemGroups[0].items[1];
        const item2 = defaultProps.trainer.itemGroups[0].items[1];
        item3 = defaultProps.trainer.itemGroups[0].items[0];
        const props = {
          ...defaultProps,
          trainer: {
            title: null,
            interaction: 'write',
            translationVisibility: 'full',
            itemGroups: [{
              items: [item1, item2, item3]
            }]
          }
        };
        mockPlayItemSound.mockImplementation(() => Promise.reject());
        wait.mockImplementation(() => Promise.resolve());

        await act(async () => {
          wrapper = shallow(<DialogTrainerContainer {...props} />);
        });
      });

      it('should not track current non interactive item as completed', () => {
        expect(defaultProps.completeItem).not.toHaveBeenCalled();
      });

      it('should automatically advance to the next interactive item', () => {
        const { currentItem } = wrapper.find(DialogTrainer).props();
        expect(currentItem).toEqual(item3);
      });
    });

    describe('when item is interactive', () => {
      let wrapper;
      let item3;
      beforeEach(async () => {
        mockPlayItemSound.mockImplementation(() => Promise.resolve());
        const item1 = defaultProps.trainer.itemGroups[0].items[0];
        const item2 = defaultProps.trainer.itemGroups[0].items[1];
        item3 = defaultProps.trainer.itemGroups[0].items[0];
        const props = {
          ...defaultProps,
          trainer: {
            title: null,
            interaction: 'write',
            translationVisibility: 'full',
            itemGroups: [{
              items: [item1, item2, item3]
            }]
          }
        };
        mockPlayItemSound.mockImplementationOnce(() => Promise.resolve());
        mockPlayItemSound.mockImplementationOnce(() => Promise.reject());
        wait.mockImplementation(() => Promise.resolve());

        await act(async () => {
          wrapper = shallow(<DialogTrainerContainer {...props} />);
        });

        const { onItemComplete } = wrapper.find(DialogTrainer).props();
        await onItemComplete(0);
      });

      it('should track first item as completed', () => {
        const numberOfMistakes = 0;
        expect(defaultProps.completeItem).toHaveBeenCalledTimes(1);
        expect(defaultProps.completeItem).toHaveBeenCalledWith(
          expect.objectContaining(items[0]),
          numberOfMistakes
        );
      });

      it('should advance to the next interactive item', () => {
        const { currentItem } = wrapper.find(DialogTrainer).props();
        expect(currentItem).toEqual(item3);
      });
    });
  });
});
