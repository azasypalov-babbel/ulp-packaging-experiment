import React from 'react';
import { mount } from 'enzyme';
import { useMatchLogic } from '../../../../src/components/Trainer/MatchingTrainer/useMatchLogic';
import { parse } from '@lessonnine/babbel-markup-helper.js';

const Consumer = () => null;

// eslint-disable-next-line react/prop-types
const TestFeedback = ({ itemPairs, attempts }) => {
  const [bases, matchedOptions, unmatchedOptions] = useMatchLogic(itemPairs, attempts);
  return <Consumer
    bases={bases}
    matchedOptions={matchedOptions}
    unmatchedOptions={unmatchedOptions}
  />;
};

const mountHook = (itemPairs, attemptsState) => {
  return mount(<TestFeedback
    itemPairs={itemPairs}
    attempts={attemptsState}
  />);
};

const selectMatchedOptions = (wrapper) => wrapper.find(Consumer).prop('matchedOptions');
const selectBases = (wrapper) => wrapper.find(Consumer).prop('bases');

const itemPairs = [
  {
    id: 'a1',
    baseMarkup: parse('ich'),
    optionMarkup: parse('darf')
  },
  {
    id: 'a2',
    baseMarkup: parse('du'),
    optionMarkup: parse('darfst')
  },
  {
    id: 'a3',
    baseMarkup: parse('er/sie/es'),
    optionMarkup: parse('darf')
  },
  {
    id: 'a4',
    baseMarkup: parse('ihr'),
    optionMarkup: parse('dürft')
  }
];

describe('matching logic', () => {
  describe('when an attempt made by its corresponding option', () => {
    const attemptsState = new Map(Object.entries({
      a1: [
        {
          isSolved: true,
          selectedOption: 0,
          text: 'darf',
          targetText: 'darf'
        }
      ]
    }));

    it('should mark the base and the selected option as matched', () => {
      const wrapper = mountHook(itemPairs, attemptsState);

      const matchedOptions = selectMatchedOptions(wrapper);

      // The selected option should be matched
      expect(matchedOptions).toEqual([
        expect.objectContaining({ id: 0, isMatched: true })
      ]);

      const bases = selectBases(wrapper);

      // The base should also be matched
      expect(bases).toEqual([
        expect.objectContaining({ id: 'a1', isMatched: true }),
        expect.objectContaining({ id: 'a2', isMatched: false  }),
        expect.objectContaining({ id: 'a3', isMatched: false }),
        expect.objectContaining({ id: 'a4', isMatched: false })
      ]);
    });
  });

  describe('when an attempt is made by selecting a different option', () => {
    describe('a correct attempt', () => {
      const attemptsState = new Map(Object.entries({
        a1: [
          {
            isSolved: true,
            selectedOption: 2,
            text: 'darf',
            targetText: 'darf'
          }
        ]
      }));
      it('should mark the base and the other option as solved', () => {
        const wrapper = mountHook(itemPairs, attemptsState);

        const matchedOptions = selectMatchedOptions(wrapper);

      // The selected option should be matched
        expect(matchedOptions).toEqual([
          expect.objectContaining({ id: 2, isMatched: true })
        ]);

        const bases = selectBases(wrapper);

      // The base should also be matched
        expect(bases).toEqual([
          expect.objectContaining({ id: 'a1', isMatched: true }),
          expect.objectContaining({ id: 'a2', isMatched: false  }),
          expect.objectContaining({ id: 'a3', isMatched: false }),
          expect.objectContaining({ id: 'a4', isMatched: false })
        ]);
      });
    });
  });

  describe('an incorrect attempt', () => {
    const attemptsState = new Map(Object.entries({
      a1: [
        {
          isSolved: false,
          selectedOption: 1,
          text: 'darfst',
          targetText: 'darfst'
        }
      ]
    }));
    it('should mark the base and the other option as unsolved', () => {
      const wrapper = mountHook(itemPairs, attemptsState);

      const matchedOptions = selectMatchedOptions(wrapper);

      // The selected option should be matched
      expect(matchedOptions).toEqual([]);

      const bases = selectBases(wrapper);

      // The base should also be matched
      expect(bases).toEqual([
        expect.objectContaining({ id: 'a1', isMatched: false }),
        expect.objectContaining({ id: 'a2', isMatched: false  }),
        expect.objectContaining({ id: 'a3', isMatched: false }),
        expect.objectContaining({ id: 'a4', isMatched: false })
      ]);
    });
  });

  describe('when multiple items are solved correctly', () => {
    const attemptsState = new Map(Object.entries({
      a1: [
        {
          isSolved: true,
          selectedOption: 2,
          text: 'darf',
          targetText: 'darf'
        }
      ],
      a2: [
        {
          isSolved: true,
          selectedOption: 1,
          text: 'darf',
          targetText: 'darfst'
        }
      ]
    }));
    it('should mark the base and the other option as solved', () => {
      const wrapper = mountHook(itemPairs, attemptsState);

      const matchedOptions = selectMatchedOptions(wrapper);

      // The selected options should be matched
      expect(matchedOptions).toEqual([
        // The option used to solve the first item should be in the first place
        expect.objectContaining({ id: 2, isMatched: true }),
        // Followed by the option used for the next item
        expect.objectContaining({ id: 1, isMatched: true })
      ]);

      const bases = selectBases(wrapper);

      // The base should also be matched
      expect(bases).toEqual([
        expect.objectContaining({ id: 'a1', isMatched: true }),
        expect.objectContaining({ id: 'a2', isMatched: true  }),
        expect.objectContaining({ id: 'a3', isMatched: false }),
        expect.objectContaining({ id: 'a4', isMatched: false })
      ]);
    });
  });
});

