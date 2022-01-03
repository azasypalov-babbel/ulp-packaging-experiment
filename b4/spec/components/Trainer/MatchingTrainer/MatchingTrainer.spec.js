import React from 'react';
import { shallow } from 'enzyme';
import { MatchingTrainer } from '../../../../src/components/Trainer/MatchingTrainer/MatchingTrainer';
import TrainerTitle from '../../../../src/components/Trainer/shared/TrainerTitle';
import MatchGrid from '../../../../src/components/Trainer/MatchingTrainer/MatchGrid';
import { ITEM_FRAGMENT_TYPE } from '../../../../src/components/Trainer/MatchingTrainer/constants';
import { MATCHING_TRAINER_STATE } from '../../../../src/components/Trainer/MatchingTrainer/constants';

jest.mock('../../../../src/components/shared/hooks/useBreakpoint');

const defaultProps = {
  title: 'Match it',
  trainerState: MATCHING_TRAINER_STATE.READY,
  grid: [
    {
      id: '162d2e047d4a2badc81e00aa574b15e0',
      text: { children: [], isLeaf: false, toHTML: jest.fn(() => 'the fruit') },
      isActive: true,
      isHidden: false,
      isMatched: false,
      type: ITEM_FRAGMENT_TYPE.BASE
    },
    {
      id: 0,
      correspondingBaseId: '162d2e047d4a2badc81e00aa574b15e0',
      text: { children: [], isLeaf: false, toHTML: jest.fn(() => 'das Obst') },
      translation: { children: [], isLeaf: false, toHTML: jest.fn(() => 'translation') },
      isSuccess: false,
      isMatched: false,
      isError: false,
      type: ITEM_FRAGMENT_TYPE.OPTION
    },
    {
      id: '33df6f3aa74afbe4d6f541825f6e758d',
      text: { children: [], isLeaf: false, toHTML: jest.fn(() => 'the cheese') },
      isActive: false,
      isHidden: false,
      isMatched: false,
      type: ITEM_FRAGMENT_TYPE.BASE
    },
    {
      id: 1,
      correspondingBaseId: '33df6f3aa74afbe4d6f541825f6e758d',
      text: { children: [], isLeaf: false, toHTML: jest.fn(() => 'der Käse') },
      translation: { children: [], isLeaf: false, toHTML: jest.fn(() => 'translation cheese') },
      isSuccess: false,
      isMatched: false,
      isError: false,
      type: ITEM_FRAGMENT_TYPE.OPTION
    },
    {
      id: 'b9cf73d37e1dd788faa5bf3cfaf3fd44',
      text: { children: [], isLeaf: false, toHTML: jest.fn(() => 'the rhino') },
      isActive: false,
      isHidden: false,
      isMatched: false,
      type: ITEM_FRAGMENT_TYPE.BASE
    },
    {
      id: 2,
      correspondingBaseId: 'b9cf73d37e1dd788faa5bf3cfaf3fd44',
      text: { children: [], isLeaf: false, toHTML: jest.fn(() => 'das Rhinozeros') },
      translation: { children: [], isLeaf: false, toHTML: jest.fn(() => 'translation rhino') },
      isSuccess: false,
      isMatched: false,
      isError: false,
      type: ITEM_FRAGMENT_TYPE.OPTION
    }
  ],
  onOptionClick: jest.fn(),
  showTranslation: true
};

describe('<MatchingTrainer />', () => {
  it('renders a title', ()=> {
    const wrapper = shallow(<MatchingTrainer {...defaultProps}  />);
    const title = wrapper.find(TrainerTitle);
    expect(title.exists()).toBe(true);
    expect(title.prop('text')).toEqual('Match it');
  });

  it('renders a matching grid', () => {
    const wrapper = shallow(<MatchingTrainer {...defaultProps}  />);
    const grid = wrapper.find(MatchGrid);
    expect(grid.exists()).toBe(true);
    expect(grid.prop('grid')).toEqual(defaultProps.grid);
    expect(grid.prop('trainerState')).toEqual(defaultProps.trainerState);
    expect(grid.prop('onOptionClick')).toEqual(defaultProps.onOptionClick);
  });
});


describe('<MatchGrid />', () => {
  let wrapper;

  describe('while not giving feedback', () => {
    beforeEach(() => {
      wrapper = shallow(<MatchGrid
        grid={defaultProps.grid}
        trainerState={defaultProps.trainerState}
        onOptionClick={defaultProps.onOptionClick}
        showTranslation={defaultProps.showTranslation}
      />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have clickable options while not giving feedback', () => {
      wrapper.find('WithAnimations(MatchingItem)').forEach((item) => {
        expect(item.prop('isClickable')).toBeTruthy();
      });
    });
  });

  describe('while giving feedback', () => {
    beforeEach(() => {
      wrapper = shallow(<MatchGrid
        grid={defaultProps.grid}
        trainerState={MATCHING_TRAINER_STATE.FEEDBACK}
        onOptionClick={defaultProps.onOptionClick}
        showTranslation={defaultProps.showTranslation}
      />);
    });

    it('should not have a clickable option while giving feedback', () => {
      wrapper.find('WithAnimations(MatchingItem)').forEach((item) => {
        expect(item.prop('isClickable')).toBeFalsy();
      });
    });
  });
});
