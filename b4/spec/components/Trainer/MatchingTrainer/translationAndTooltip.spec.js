import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import defaultProps, { MOCK_SOUND_ID, trainerType2 } from './defaultProps';
import { matchingBaseDefaultProps, matchingOptionDefaultProps } from './defaultProps';
import { mountWithTheme } from '../../shared/themeMock';
import { MatchingItem } from '../../../../src/components/Trainer/MatchingTrainer/MatchingItem/MatchingItem';
import ToolTip from '../../../../src/components/shared/ToolTip';
import TranslationToggleInline from '../../../../src/components/shared/TranslationToggleInline';
import ContinueSheet from '../../../../src/components/ContinueSheet';
import { ITEM_FRAGMENT_TYPE } from '../../../../src/components/Trainer/MatchingTrainer/constants';
import { MatchingTrainerContainer } from '../../../../src/components/Trainer/MatchingTrainer/MatchingTrainerContainer';
import MatchingTrainer from '../../../../src/components/Trainer/MatchingTrainer/MatchingTrainer';
import useFeedbackSounds from '../../../../src/components/Interactions/shared/useFeedbackSounds'
import { withServicesProvider } from '../../../../src/components/shared/withServices';
import mockSoundService from '../../../../src/services/soundService';

jest.mock('../../../../src/services/soundService');
jest.mock(
  '../../../../src/components/Trainer/MatchingTrainer/MatchingTrainer',
  () => { const MatchingTrainer = () => <></>; return MatchingTrainer; }
);
jest.mock(
  '../../../../src/components/ContinueSheet',
  () => { const ContinueSheet = () => <></>; return ContinueSheet; }
);
jest.mock('../../../../src/components/Interactions/shared/useFeedbackSounds', () => jest.fn());

const mockPlayFeedback = jest.fn();

const services = {
  mediaUrlService: {
    soundURL: (id) => id
  },
  soundService: mockSoundService,
};

const MatchingComponent = withServicesProvider(() => services)(MatchingTrainerContainer);

const selectBaseAndOptions = (wrapper) => {
  const grid = wrapper.find(MatchingTrainer).prop('grid');
  const bases = grid.filter((item) => item.type === ITEM_FRAGMENT_TYPE.BASE);
  const options = grid.filter((item) => item.type === ITEM_FRAGMENT_TYPE.OPTION);

  return { bases, options };
};

describe('translation toggle and tooltip', () => {
  let wrapper;

  beforeEach(() => {
    useFeedbackSounds.mockImplementation(() => [mockPlayFeedback, false])
  })

  const constructMatchingItems = (grid) => {
    const Component = withServicesProvider(() => services)(MatchingItem);
    const items = [];
    grid.forEach((item) => {
      if (item.type === ITEM_FRAGMENT_TYPE.BASE) {
        const props = {
          ...matchingBaseDefaultProps,
          isHidden: item.isHidden,
          isMatched: item.isMatched,
          translation: item.translation ? 'Some text' : undefined
        };
        items.push(mountWithTheme(<Component {...props} />).find(MatchingItem));
      } else {
        const props = {
          ...matchingOptionDefaultProps,
          isHidden: item.isHidden,
          isMatched: item.isMatched,
          translation: item.translation ? 'some text' : undefined
        };
        items.push(mountWithTheme(<Component {...props} />).find(MatchingItem));
      }
    });
    return items;
  };

  describe('in matching type 2', () => {
    jest.useFakeTimers();
    let items;

    describe('after loading the trainer', () => {
      beforeEach(() => {
        wrapper = mount(<MatchingComponent {...defaultProps} trainer={trainerType2} />);
        const grid = wrapper.find(MatchingTrainer).prop('grid');
        items = constructMatchingItems(grid);
      });

      it('should contain translations for all options', () => {
        const { options } = selectBaseAndOptions(wrapper);
        options.forEach((option) => {
          expect(option.translation).not.toBeUndefined();
          expect(option.translation).not.toBeNull();
        });
      });

      it('should only have unmatched options = translation toggle not shown', () => {
        [items[1], items[3], items[5]].forEach((item) => {
          expect(item.find(MatchingItem).prop('isMatched')).toBeFalsy();
        });
      });
    });

    describe('after completing the first item', () => {
      let items;

      beforeEach(() => {
        wrapper = mount(<MatchingComponent {...defaultProps} trainer={trainerType2} />);
        const { onOptionClick } = wrapper.find(MatchingTrainer).props();

        act(() => {
          jest.runAllTimers(); // Get past attempt blocker timeout
          onOptionClick(0);
          jest.runAllTimers(); // Get past timeout before next item
        });

        wrapper.update();
        const grid = wrapper.find(MatchingTrainer).prop('grid');
        items = constructMatchingItems(grid);
      });

      // the items list contains BASE items at indices 0, 2, and 4
      // and OPTION items at 1, 3, and  5
      it('should show translation toggle (isMatched = true) for 1st option', () => {
        // visibility of translation toggle is determined by isMatched prop
        // visibility: ${({ isMatched }) => isMatched ? 'visible' : 'hidden'};
        expect(items[1].find(MatchingItem).prop('isMatched')).toBeTruthy();
      });

      it('should not show translation toggle (isMatched = false) for 2nd and 3rd option', () => {
        [items[3], items[5]].forEach((item) => {
          expect(item.find(MatchingItem).prop('isMatched')).toBeFalsy();
        });
      });

      it('should contain the tooltips and translation toggles for all options items', () => {
        // they exist but are not shown (hidden by css property)
        [items[1], items[3], items[5]].forEach((item) => {
          expect(item.find(MatchingItem).prop('position')).toEqual(ITEM_FRAGMENT_TYPE.OPTION);
          expect(item.find(ToolTip).prop('text')).toBe('some text');
          expect(item.find(ToolTip).prop('visible')).toBeFalsy();
          expect(item.debug()).toContain('TranslationToggleInline');
        });
      });
    });

    describe('after completing an item without DL field', () => {
      let items;

      beforeEach(() => {
        const trainer = {
          ...trainerType2,
          itemGroups: [{
            items: [{
              id: 'd85a01bdf3bac689e7bc4808365dc5e6',
              type: 'phrase',
              displayLanguageText: null, // <- no display language text
              learnLanguageText: 'ich_laufe',
              infoText: null,
              image: null,
              sound: {
                id: MOCK_SOUND_ID
              },
              speakerRole: 'f1'
            }]
          }]
        };

        wrapper = mount(<MatchingComponent {...defaultProps} trainer={trainer} />);
        const { onOptionClick } = wrapper.find(MatchingTrainer).props();

        act(() => {
          jest.runAllTimers();
          onOptionClick(0);
          jest.runAllTimers();
        });

        wrapper.update();
        const grid = wrapper.find(MatchingTrainer).prop('grid');
        items = constructMatchingItems(grid);
      });

      it('should not contain a translation for the option', () => {
        const { options } = selectBaseAndOptions(wrapper);
        expect(options[0].translation).toBeNull();
      });

      it('should not show a translation toggle on option', () => {
        expect(items[1].find(MatchingItem).prop('position')).toEqual(ITEM_FRAGMENT_TYPE.OPTION);
        expect(items[1].find(MatchingItem).prop('isMatched')).toBeTruthy();

        // should not contain a tooltip
        expect(items[1].debug()).not.toContain('ToolTip');

        // and should not contain the Translation Toggle
        expect(items[1].debug()).not.toContain('TranslationToggle');
      });
    });

    describe('after completing all items', () => {
      let items;

      beforeEach(() => {
        wrapper = mount(<MatchingComponent {...defaultProps} trainer={trainerType2} />);

        [0, 1, 2].forEach((attemptId) => {
          act(() => {
            jest.runAllTimers();
            const { onOptionClick } = wrapper.find(MatchingTrainer).props();
            onOptionClick(attemptId);
          })
          act(() => {
            useFeedbackSounds.mockImplementation(() => [mockPlayFeedback, true])
            wrapper.update();
          })
          act(() => {
            const soundInstanceMock = services.soundService.getInstance(MOCK_SOUND_ID);
            soundInstanceMock.simulate('end');
            jest.runAllTimers();
          });

          wrapper.update();
        });

        const grid = wrapper.find(MatchingTrainer).prop('grid');
        items = constructMatchingItems(grid);
      });

      it('should show all translation toggles', () => {
        [items[1], items[3], items[5]].forEach((item) => {
          expect(item.find(MatchingItem).prop('position')).toEqual(ITEM_FRAGMENT_TYPE.OPTION);
          expect(item.find(MatchingItem).prop('isMatched')).toBeTruthy();
          expect(item.find(ToolTip).prop('text')).toBe('some text');
          expect(item.find(ToolTip).prop('visible')).toBeFalsy();

          // should contain the Translation Toggle
          expect(item.debug()).toContain('TranslationToggle');
        });
      });
    });

    describe('if translation visibility is none', () => {
      beforeEach(() => {
        const trainer = {
          ...trainerType2,
          translationVisibility: 'none'
        };
        wrapper = mount(<MatchingComponent {...defaultProps} trainer={trainer} />);
      });

      it('should have showTranslation prop set to false', () => {
        expect(wrapper.find(MatchingTrainer).prop('showTranslation')).toBeFalsy();
      });
    });
  });

  describe('in matching type 1', () => {
    jest.useFakeTimers();

    describe('after loading the trainer', () => {
      beforeEach(() => {
        wrapper = mount(<MatchingComponent {...defaultProps} />);
      });

      it('should not contain any translations', () => {
        const { options } = selectBaseAndOptions(wrapper);
        options.forEach((option) => {
          expect(option.translation).toBeUndefined();
        });
      });
    });

    describe('after completing the first item', () => {
      let items;

      beforeEach(() => {
        wrapper = mount(<MatchingComponent {...defaultProps} />);
        const { onOptionClick } = wrapper.find(MatchingTrainer).props();

        act(() => {
          jest.runAllTimers();
          onOptionClick(0);
          jest.runAllTimers();
        });

        wrapper.update();
        const grid = wrapper.find(MatchingTrainer).prop('grid');
        items = constructMatchingItems(grid);
      });

      it('should not contain any translations', () => {
        const { options } = selectBaseAndOptions(wrapper);
        options.forEach((option) => {
          expect(option.translation).toBeUndefined();
        });
      });

      it('should not have any translation toggles or tooltips rendered', () => {
        [items[1], items[3], items[5]].forEach((item) => {
          expect(item.find(MatchingItem).prop('position')).toEqual(ITEM_FRAGMENT_TYPE.OPTION);
          // should not contain the ToolTip
          expect(item.find(ToolTip).debug()).not.toContain('ToolTip');
          // and should not contain the Translation Toggle
          expect(item.find(TranslationToggleInline)).not.toContain('TranslationToggleInline');
        });
      });
    });

    describe('after completing all items', () => {
      let items;

      beforeEach(() => {
        wrapper = mount(<MatchingComponent {...defaultProps} />);

        [0, 1, 2].forEach((attemptId) => {
          act(() => {
            jest.runAllTimers(); // Get past attempt blocker timeout
            const { onOptionClick } = wrapper.find(MatchingTrainer).props();
            onOptionClick(attemptId);
          })
          act(() => {
            useFeedbackSounds.mockImplementation(() => [mockPlayFeedback, true])
            wrapper.update();
          })
          act(() => {
            const soundInstanceMock = services.soundService.getInstance(MOCK_SOUND_ID);
            soundInstanceMock.simulate('end');
            jest.runAllTimers(); // Get past timeout before next item
          });
          wrapper.update();
        });

        const grid = wrapper.find(MatchingTrainer).prop('grid');
        items = constructMatchingItems(grid);
      });

      it('should display the continue button', () => {
        expect(wrapper.find(ContinueSheet).exists()).toBe(true);
      });

      it('should not contain any translations', () => {
        const { options } = selectBaseAndOptions(wrapper);
        options.forEach((option) => {
          expect(option.translation).toBeUndefined();
        });
      });

      it('should not have any translation toggles or tooltips rendered', () => {
        [items[1], items[3], items[5]].forEach((item) => {
          expect(item.find(MatchingItem).prop('position')).toEqual(ITEM_FRAGMENT_TYPE.OPTION);
          // should not contain the ToolTip
          expect(item.find(ToolTip).debug()).not.toContain('ToolTip');
          // and should not contain the Translation Toggle
          expect(item.find(TranslationToggleInline)).not.toContain('TranslationToggleInline');
        });
      });
    });
  });

  describe('ToolTip', () => {
    let wrapper;
    beforeEach(() => {
      const item = {
        ...matchingOptionDefaultProps,
        translation: 'translation'
      };

      const Component = withServicesProvider(() => services)(MatchingItem);
      wrapper = mountWithTheme(<Component {...item} />);
    });

    describe('when clicking on the TT symbol', () => {
      beforeEach(() => {
        act(() => {
          wrapper.find('Button[data-selector="translation-toggle-inline"]')
            .prop('onClick')(new CustomEvent('click'));
        });
        wrapper.update();
      });

      it('opens a tooltip with the expected text', () => {
        expect(wrapper.find(ToolTip).prop('visible')).toBeTruthy();
      });

      describe('when clicking on the button again', () => {
        beforeEach(() => {
          act(() => {
            wrapper.find('Button[data-selector="translation-toggle-inline"]')
              .prop('onClick')(new CustomEvent('click'));
          });
          wrapper.update();
        });

        it('closes the tooltip', () => {
          expect(wrapper.find(ToolTip).prop('visible')).toBeFalsy();
        });
      });
    });

    describe('when mousing over the TT symbol', () => {
      beforeEach(() => {
        act(() => {
          wrapper.find('Button[data-selector="translation-toggle-inline"]')
            .prop('onMouseEnter')(new CustomEvent('mouseenter'));
        });
        wrapper.update();
      });

      it('opens a tooltip with the expected text', () => {
        expect(wrapper.find(ToolTip).prop('visible')).toBeTruthy();
      });

      describe('when mousing away from TT symbol', () => {
        beforeEach(() => {
          act(() => {
            wrapper.find('Button[data-selector="translation-toggle-inline"]')
              .prop('onMouseLeave')(new CustomEvent('mouseleave'));
          });
          wrapper.update();
        });

        it('closes the tooltip', () => {
          expect(wrapper.find(ToolTip).prop('visible')).toBeFalsy();
        });
      });
    });
  });
});
