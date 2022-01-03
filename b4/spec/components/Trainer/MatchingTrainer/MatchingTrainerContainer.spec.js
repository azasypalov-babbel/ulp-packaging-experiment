import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import defaultProps, {
  MOCK_SOUND_ID,
  trainerWithMultipleCorrectOptionsReal,
  trainerWithMultipleCorrectOptionsSimple
} from './defaultProps';
import MatchingTrainer from '../../../../src/components/Trainer/MatchingTrainer/MatchingTrainer';
import {
  MatchingTrainerContainer,
  toItemPairs,
  matchingParserOptions
} from '../../../../src/components/Trainer/MatchingTrainer/MatchingTrainerContainer';

import ContinueSheet from '../../../../src/components/ContinueSheet';
import { parse, firstCorrectSolution } from '@lessonnine/babbel-markup-helper.js';
import underscore from 'underscore';
import { ITEM_FRAGMENT_TYPE } from '../../../../src/components/Trainer/MatchingTrainer/constants';
import useFeedbackSounds from '../../../../src//components/Interactions/shared/useFeedbackSounds';
import { withServicesProvider } from '../../../../src/components/shared/withServices';
import mockSoundService from '../../../../src/services/soundService';
import { withoutHooks } from 'jest-react-hooks-shallow';

jest.mock('../../../../src/services/soundService');

jest.mock(
  '../../../../src/components/Trainer/MatchingTrainer/MatchingTrainer',
  () => { const MatchingTrainer = () => <></>; return MatchingTrainer; }
);

jest.mock(
  '../../../../src/components/ContinueSheet',
  () => { const ContinueSheet = () => <></>; return ContinueSheet; }
);

jest.mock('../../../../src/components/Trainer/shared/useSoundsPreload', () => ({ useSoundsPreload: jest.fn() }));

jest.mock('../../../../src/components/Interactions/shared/useFeedbackSounds', () => jest.fn());
const mockPlayFeedback = jest.fn();
useFeedbackSounds.mockImplementation(({ resetDependencies }) => [
    mockPlayFeedback,
    resetDependencies[0] ? true : false
  ]);

const services = {
  mediaUrlService: {
    soundURL: (id) => id
  },
  soundService: mockSoundService,
};

const Component = withServicesProvider(() => services)(MatchingTrainerContainer);

describe('toItemPairs', () => {
  describe('items with underscore', () => {
    const item = {
      id: '1',
      learnLanguageText: 'text_solution',
      displayLanguageText: 'translation'
    };

    it('should split text and solution', () => {
      const result = toItemPairs(item);
      expect(result).toEqual({
        id: '1',
        baseMarkup: expect.anything(),
        optionMarkup: expect.anything(),
        translation: expect.anything()
      });
      expect(result.baseMarkup.toString()).toEqual('text');
      expect(result.optionMarkup.toString()).toEqual('solution');
      expect(result.translation).toEqual(parse('translation'));
    });
  });

  describe('items without underscore', () => {
    const item = {
      id: '1',
      learnLanguageText: 'text',
      displayLanguageText: 'translation'
    };

    it('should split text and translation', () => {
      const result = toItemPairs(item);
      expect(result).toEqual({
        id: '1',
        baseMarkup: expect.anything(),
        optionMarkup: expect.anything()
      });
      expect(result.baseMarkup.toString()).toEqual('text');
      expect(result.optionMarkup.toString()).toEqual('translation');
    });
  });

  describe('items with multiple answers', () => {
    const item = {
      id: '1',
      learnLanguageText: '((*firsttext|*secondtext))',
      displayLanguageText: 'translation'
    };

    it('should select the first correct solution without error', () => {
      const result = toItemPairs(item);
      expect(result).toEqual({
        id: '1',
        baseMarkup: expect.anything(),
        optionMarkup: expect.anything()
      });
      expect(result.baseMarkup.toString()).toEqual('firsttext');
    });
  });
});

const selectBaseAndOptions = (wrapper) => {
  const grid = wrapper.find(MatchingTrainer).prop('grid');
  const bases = grid.filter((item) => item.type === ITEM_FRAGMENT_TYPE.BASE);
  const options = grid.filter((item) => item.type === ITEM_FRAGMENT_TYPE.OPTION);

  return { bases, options };
};

describe('MatchingTrainerContainer', () => {
  // this function will match the item with given (attempt)Id and play the sound
  // until finished, all timers are run, next item should be clickable, and
  // trainer should be in READY state again
  const successfullyClickOnItemWithId = (id, wrapper, soundInstanceMock) => {
    act(() => jest.runAllTimers());  // Get past attempt blocker timeout
    act(() => {
      const onOptionClick = wrapper.find(MatchingTrainer).prop('onOptionClick');
      onOptionClick(id);
    })

    // Simulate the feedback sound completing
    act(() => {
      useFeedbackSounds.mockImplementation(() => [mockPlayFeedback, true])
      wrapper.update();
    })
    // mock the feedback sound state to be done
    act(() => {
      soundInstanceMock.simulate('end')
    })
    // mock the end event on the item sound
    act(() => jest.runAllTimers());  // Get past timeout before next item
  };

  // this function will click on a wrong option, so nothing should change
  // compared to the previous state. no sound is played or ended
  const unsuccessfullyClickOnItemWithId = (id, wrapper) => {
    act(() => jest.runAllTimers());  // Get past attempt blocker timeout
    act(() => {
      const onOptionClick = wrapper.find(MatchingTrainer).prop('onOptionClick');
      onOptionClick(id);
    })

    act(() => {
      useFeedbackSounds.mockImplementation(() => [mockPlayFeedback, true])
      wrapper.update();
    })
    act(() => jest.runAllTimers());  // Get past timeout before next item
  };

  beforeEach(() => {
    useFeedbackSounds.mockImplementation(() => [mockPlayFeedback, false])
  })

  describe('after rendering the trainer', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(<Component {...defaultProps} />);
    });

    it('renders MatchingTrainer component', () => {
      expect(wrapper.find(MatchingTrainer).exists()).toEqual(true);
    });

    it('calls onStart method when mounting', () => {
      expect(defaultProps.onStart).toHaveBeenCalledWith({
        scorableItemsCount: 3
      });
    });

    it('should shuffle the options', () => {
      const shuffle = jest.spyOn(underscore, 'shuffle');
      mount(<Component {...defaultProps} />);
      expect(shuffle).toHaveBeenCalled();
    });

    it('should show the first base as active', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[0].isActive).toEqual(true);
    });

    it('should show the first base as unmatched', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[0].isMatched).toEqual(false);
    });

    it('should show all other bases as inactive', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      const allExceptFirstBase = bases.slice(1);
      expect(allExceptFirstBase.some(({ isActive }) => isActive)).toBeFalsy();
    });

    it('shows all options to not have the property active', () => {
      const { options } = selectBaseAndOptions(wrapper);
      options.forEach((option) => {
        expect(option.isActive).toBeFalsy();
      });
    });

    it('shows all options to be unmatched', () => {
      const { options } = selectBaseAndOptions(wrapper);
      options.forEach((option) => {
        expect(option.isMatched).toBeFalsy();
      });
    });

    it('should show all bases as unmatched', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      bases.forEach((base) => {
        expect(base.isMatched).toBeFalsy();
      });
    });
  });

  describe('after selecting the correct option', () => {
    jest.useFakeTimers();
    let wrapper;
    let soundInstanceMock;

    beforeEach(() => {
      soundInstanceMock = services.soundService.getInstance(MOCK_SOUND_ID);
      wrapper = mount(<Component {...defaultProps} />);
      const attemptId = 0;

      successfullyClickOnItemWithId(attemptId, wrapper, soundInstanceMock);
      wrapper.update();
    });

    it('should mark the first base item as inactive', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[0].isActive).toBe(false);
    });

    it('should mark the first base item as matched', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[0].isMatched).toBe(true);
    });

    it('should mark the first option item as matched', () => {
      const { options } = selectBaseAndOptions(wrapper);
      expect(options[0].isMatched).toBe(true);
    });

    it('should mark the second base item as active', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[1].isActive).toBe(true);
    });

    it('should show the last base item as inactive', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases.pop().isActive).toBeFalsy();
    });

    it('should show the last two base items as unmatched', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      bases.slice(1).forEach((base) => {
        expect(base.isMatched).toBeFalsy();
      });
    });

    it('should show the last two option items as unmatched', () => {
      const { options } = selectBaseAndOptions(wrapper);
      options.slice(1).forEach((option) => {
        expect(option.isMatched).toBeFalsy();
      });
    });

    it('should call playFeedbackSound with positive sound', () => {
      expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
      expect(mockPlayFeedback).toHaveBeenCalledWith(true); // true indicates 'solved'
    })

    it('should track the attempt', () => {
      expect(defaultProps.attemptItem).toHaveBeenCalledWith(
        defaultProps.trainer.itemGroups[0].items[0],
        {
          number: 1,
          solved: true,
          targetText: 'the fruit',
          text: 'the fruit'
        },
        {
          /* eslint-disable camelcase */
          interaction_mode: 'choose',
          item_position_in_trainer: 1,
          number_of_items_in_trainer: 3,
          translation_mode: 'partial'
          /* eslint-enable camelcase */
        }
      );
    });

    it('should track the item as completed', () => {
      expect(defaultProps.completeItem).toHaveBeenCalledWith(
        defaultProps.trainer.itemGroups[0].items[0],
        0
      );
    });

    it('should play the matched item\'s sound', () => {
      expect(soundInstanceMock.play).toHaveBeenCalledTimes(1);
    });

    it('should display the item\'s info text', () => {
      expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
        expect.objectContaining({
          infoText: 'Obst gibt es in vielen verschiedenen Farben'
        }
      ));
    });
  });

  describe('after selecting an incorrect option', () => {
    jest.useFakeTimers();
    let wrapper;
    let soundInstanceMock;

    beforeEach(() => {
      soundInstanceMock = services.soundService.getInstance(MOCK_SOUND_ID);
      wrapper = mount(<Component {...defaultProps} />);
      const attemptId = 1;

      unsuccessfullyClickOnItemWithId(attemptId, wrapper);
      wrapper.update();
    });

    it('should keep the first base item as active', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[0].isActive).toBe(true);
    });

    it('should not mark the first base item as matched', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[0].isMatched).toBe(false);
    });

    it('should not mark the first option item as matched', () => {
      const { options } = selectBaseAndOptions(wrapper);
      expect(options[0].isMatched).toBe(false);
    });

    it('should show the last two base items as inactive', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[1].isActive).toBeFalsy();
      expect(bases[2].isActive).toBeFalsy();
    });

    it('should call playFeedbackSound with negative sound', () => {
      expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
      expect(mockPlayFeedback).toHaveBeenCalledWith(false); // false indicates 'not solved'
    })

    it('should track the attempt', () => {
      expect(defaultProps.attemptItem).toHaveBeenCalledWith(
        defaultProps.trainer.itemGroups[0].items[0],
        {
          number: 1,
          solved: false,
          targetText: 'the fruit',
          text: 'the cheese'
        },
        {
          /* eslint-disable camelcase */
          interaction_mode: 'choose',
          item_position_in_trainer: 1,
          number_of_items_in_trainer: 3,
          translation_mode: 'partial'
          /* eslint-enable camelcase */
        }
      );
    });

    it('should not track the item as completed', () => {
      expect(defaultProps.completeItem).not.toHaveBeenCalled();
    });

    it('should not play any item sound', () => {
      expect(soundInstanceMock.play).not.toHaveBeenCalled();
    });
  });

  describe('replaying sounds', () => {
    // Using the SoundPlayer, sound states for the same sound id are global
    // The MatchingItem is responsible for replaying sounds, although the MatchingTrainerContainer
    // also subscribes to the sound of the active item in order to automatically play it.
    // Because the sound states are shared, the playstate will be updated in the container if
    // the active item is played elsewhere in the application.
    jest.useFakeTimers();
    let wrapper = null;
    let soundInstanceMock;
    let soundInstanceMockOther;
    let attemptId;

    const otherSoundId = 'other-sound-id';
    const trainer = {
      ...defaultProps.trainer,
      itemGroups: [{
        title: null,
        image: null,
        items: [
          defaultProps.trainer.itemGroups[0].items[0],
          {
            id: 'other-id',
            type: 'phrase',
            displayLanguageText: 'the cheese',
            learnLanguageText: 'der Käse',
            infoText: null,
            image: null,
            sound: {
              id: otherSoundId
            },
            speakerRole: 'f1'
          },
          defaultProps.trainer.itemGroups[0].items[1],
          defaultProps.trainer.itemGroups[0].items[2],
        ]
      }]
    };

    beforeEach(() => {
      soundInstanceMock = services.soundService.getInstance(MOCK_SOUND_ID);
      wrapper = mount(<Component {...defaultProps} trainer={trainer} />);
      attemptId = 0;

      // solve one item
      successfullyClickOnItemWithId(attemptId, wrapper, soundInstanceMock);
      wrapper.update();
    });

    it('should play a positive feedback sound (for 1st item)', () => {
      expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
      expect(mockPlayFeedback).toHaveBeenCalledWith(true); // true indicates 'solved'
    });

    it('should have active base 1', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[0].isActive).toBeFalsy();
      expect(bases[1].isActive).toBeTruthy();
      expect(bases[2].isActivd).toBeFalsy();
    });

    it('should have matched base 0', () => {
      const { bases } = selectBaseAndOptions(wrapper);
      expect(bases[0].isMatched).toBeTruthy();
      expect(bases[1].isMatched).toBeFalsy();
      expect(bases[2].isMatched).toBeFalsy();
    });

    it('should have matched option 0', () => {
      const { options } = selectBaseAndOptions(wrapper);
      expect(options[0].isMatched).toBeTruthy();
      expect(options[1].isMatched).toBeFalsy();
      expect(options[2].isMatched).toBeFalsy();
    });

    describe('solving next item while sound is replaying', () => {
      beforeEach(() => {
        attemptId = 0;
        // Simulate replay (this is triggered by MatchingItem)
        act(() => {
          soundInstanceMock.simulate('play');
        })
        wrapper.update();

        // and now click on next correct option
        act(() => {
          soundInstanceMockOther = services.soundService.getInstance(otherSoundId);
          const onOptionClick = wrapper.find(MatchingTrainer).prop('onOptionClick');
          onOptionClick(attemptId + 1);
        })
        // Simulate the feedback sound completing
        act(() => {
          useFeedbackSounds.mockImplementation(() => [mockPlayFeedback, true])
          wrapper.update();
        })
        // we finish 2nd item's sound
        act(() => {
          soundInstanceMockOther.simulate('end');
          jest.runAllTimers();
        });
        wrapper.update();
      });

      it('should stop and reset sound player', () => {
        expect(soundInstanceMock.reset).toHaveBeenCalledTimes(1);
      });

      it('should play positive feedback sounds (for 1st + 2nd item)', () => {
        expect(mockPlayFeedback).toHaveBeenCalledTimes(2);
        expect(mockPlayFeedback).toHaveBeenCalledWith(true); // true indicates 'solved'
      });

      it('should play sound of 2nd item', () => {
        expect(soundInstanceMockOther.play).toHaveBeenCalledTimes(1);
      });

      it('should have active base 2', () => {
        const { bases } = selectBaseAndOptions(wrapper);
        expect(bases[0].isActive).toBeFalsy();
        expect(bases[1].isActive).toBeFalsy();
        expect(bases[2].isActive).toBeTruthy();
      });

      it('should have matched bases 0 + 1', () => {
        const { bases } = selectBaseAndOptions(wrapper);
        expect(bases[0].isMatched).toBeTruthy();
        expect(bases[1].isMatched).toBeTruthy();
        expect(bases[2].isMatched).toBeFalsy();
      });

      it('should have matched option 0 + 1', () => {
        const { options } = selectBaseAndOptions(wrapper);
        expect(options[0].isMatched).toBeTruthy();
        expect(options[1].isMatched).toBeTruthy();
        expect(options[2].isMatched).toBeFalsy();
      });
    });

    describe('wrong answer while sound, with same soundId, is replaying', () => {
      beforeEach(() => {
        // progress to last base that has same soundId as item before it
         [1, 2].forEach((attemptId) => {
          const soundMock = attemptId === 1 ? services.soundService.getInstance(otherSoundId) : soundInstanceMock;
          successfullyClickOnItemWithId(attemptId, wrapper, soundMock);
          wrapper.update();
         })

        // Simulate replay (this is triggered by MatchingItem)
        act(() => {
          soundInstanceMock.simulate('play');
        })
        wrapper.update();

        act(() => {
          const onOptionClick = wrapper.find(MatchingTrainer).prop('onOptionClick');
          // reset stop() mock in order to test
          soundInstanceMock.stop.mockReset();
          soundInstanceMock.reset.mockReset();
          // and now click on the next option
          onOptionClick(3);
          jest.runAllTimers();
        })
      });

      it('should stop and reset sound player', () => {
        expect(soundInstanceMock.reset).toHaveBeenCalledTimes(1);
        expect(soundInstanceMock.stop).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('after matching the final item', () => {
    jest.useFakeTimers();
    let wrapper = null;
    let soundInstanceMock;

    beforeEach(() => {
      soundInstanceMock = services.soundService.getInstance(MOCK_SOUND_ID);
      wrapper = mount(<Component {...defaultProps} />);

      [0, 1, 2].forEach((attemptId) => {
        successfullyClickOnItemWithId(attemptId, wrapper, soundInstanceMock);
        wrapper.update();
      });
    });

    it('should display the continue button', () => {
      expect(wrapper.find(ContinueSheet).exists()).toBe(true);
    });

    it('should display two items\' info texts', () => {
      expect(defaultProps.displayInfoText).toHaveBeenCalledTimes(2);
      expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
        expect.objectContaining({
          infoText: 'Obst gibt es in vielen verschiedenen Farben'
        }
      ));
      expect(defaultProps.displayInfoText).toHaveBeenCalledWith(
        expect.objectContaining({
          infoText: 'Käse hat manchmal Löcher'
        }
      ));
    });
  });

  describe('matching different items with the same value', () => {
    jest.useFakeTimers();
    let wrapper;
    let soundInstanceMock;

    beforeEach(() => {
      soundInstanceMock = services.soundService.getInstance(MOCK_SOUND_ID);
      wrapper = mount(<Component {...defaultProps} trainer={trainerWithMultipleCorrectOptionsSimple} />);
    });

    describe('should accept it when making ONE attempt using the "other" correct option', () => {
      const attemptId = 1;
      let options;
      let bases;

      beforeEach(() => {
        successfullyClickOnItemWithId(attemptId, wrapper, soundInstanceMock);
        wrapper.update();

        let someObject = selectBaseAndOptions(wrapper);
        options = someObject.options;
        bases = someObject.bases;
      });

      it('should render first BASE as no longer active', () => {
        expect(bases[0].isActive).toBe(false);
      });

      it('should display the other item\'s translation', () => {
        expect(options[0].id).toEqual(attemptId);
        expect(options[0].correspondingBaseId).toEqual('er-darf-id');
        expect(options[0].translation.toHTML()).toEqual('I may');
        expect(options[0].text.toHTML()).toEqual('darf');
      });

      it('should move the option with the id used for the attempt to 1st position', () => {
        expect(options[0].id).toBe(attemptId);
      });

      it('should also mark this option as matched', () => {
        expect(options[0].isMatched).toBe(true);
      });

      it('should mark the 2nd base as active', () => {
        expect(bases[1].isActive).toBe(true);
      });

      it('should play a positive feedback sound', () => {
        expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
        expect(mockPlayFeedback).toHaveBeenCalledWith(true); // true indicates 'solved'
      });

      describe('should not accept when making SUCCESSIVE attempts using the same option', () => {
        beforeEach(() => {
          mockPlayFeedback.mockReset()
          // now we click on it again - and nothing should happen
          unsuccessfullyClickOnItemWithId(attemptId, wrapper);
          wrapper.update();
          const someObject = selectBaseAndOptions(wrapper);
          options = someObject.options;
          bases = someObject.bases;
        });

        it('should keep the 2nd base active', () => {
          expect(bases[1].isActive).toBe(true);
        });

        it('should not trigger feedback sound', () => {
          expect(mockPlayFeedback).not.toHaveBeenCalled();
        });
      });

      describe('match next option', () => {
        const otherAttemptId = 0;

        beforeEach(() => {
          mockPlayFeedback.mockReset()
          successfullyClickOnItemWithId(otherAttemptId, wrapper, soundInstanceMock);
          wrapper.update();

          const someObject = selectBaseAndOptions(wrapper);
          options = someObject.options;
          bases = someObject.bases;
        });

        it('both options should display the other item\'s translations', () => {
          expect(options[0].id).toEqual(attemptId);
          expect(options[0].correspondingBaseId).toEqual('er-darf-id');
          expect(options[0].translation.toHTML()).toEqual('I may');
          expect(options[0].text.toHTML()).toEqual('darf');

          expect(options[1].id).toEqual(otherAttemptId);
          expect(options[1].correspondingBaseId).toEqual('ich-darf-id');
          expect(options[1].translation.toHTML()).toEqual('he may');
          expect(options[1].text.toHTML()).toEqual('darf');
        });
      });
    });
  });

  describe('matching different items with the same value (real content)', () => {
    const shuffle = jest.spyOn(underscore, 'shuffle');
    jest.useFakeTimers();
    let wrapper;
    let soundInstanceMock;

    beforeEach(() => {
      soundInstanceMock = services.soundService.getInstance(MOCK_SOUND_ID);
      shuffle.mockImplementation((list) => list);
      wrapper = mount(<Component {...defaultProps} trainer={trainerWithMultipleCorrectOptionsReal} />);
    });

    describe('first attempt flow - should present options in the correct order', () => {
      const firstAttemptId = 2;
      const secondAttemptId = 1;

      let bases;
      let options;

      beforeEach(() => {
        successfullyClickOnItemWithId(firstAttemptId, wrapper, soundInstanceMock);

        wrapper.update();
        const someObject = selectBaseAndOptions(wrapper);
        bases = someObject.bases;
        options = someObject.options;
      });

      it('first base is no longer active', () => {
        expect(bases[0].isActive).toBe(false);
      });

      it('second base is active', () => {
        expect(bases[1].isActive).toBe(true);
      });

      it('the selected option should move to be the first option', () => {
        expect(options).toEqual([
          expect.objectContaining({ id: firstAttemptId }),
          expect.objectContaining({ id: 0 }),
          expect.objectContaining({ id: 1 })
        ]);
      });

      describe('second attempt flow - make an attempt using the corresponding option', () => {
        beforeEach(() => {
          successfullyClickOnItemWithId(secondAttemptId, wrapper, soundInstanceMock);

          wrapper.update();
          const someObject = selectBaseAndOptions(wrapper);
          bases = someObject.bases;
          options = someObject.options;
        });

        it('first BASE is no longer active', () => {
          expect(bases[1].isActive).toBe(false);
        });

        it('Final BASE is active', () => {
          expect(bases[2].isActive).toBe(true);
        });

        it('the selected option should move to the second position', () => {
          expect(options[0].id).toEqual(firstAttemptId);
          expect(options[1].id).toEqual(secondAttemptId);
          expect(options[2].id).toEqual(0);
        });
      });
    });
  });

  describe('when the trainer is unmounted', () => {
    it('should stop all playing sounds', () => {
      withoutHooks(() => {
        const wrapper = mount(<Component {...defaultProps} />);

        act(() => {
          wrapper.unmount()
        })

        expect(mockSoundService.stop).toHaveBeenCalled();
      })
    })
  });
});
