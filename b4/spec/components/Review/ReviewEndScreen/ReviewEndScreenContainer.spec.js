import {
  mapStateToProps,
  mergeProps,
  getGrade
} from '../../../../src/components/Review/ReviewEndScreen/ReviewEndScreenContainer';

import { formatLL } from '../../../../src/lib/markupFormatter';
jest.mock('../../../../src/lib/markupFormatter', () => ({
  formatLL: jest.fn((arg) => arg)
}));

const mockServices = {
  soundService: jest.fn(),
  mediaUrlService: jest.fn()
};

const mockItems = [
  { learnLanguageText: 'a', sound: { id: '100afffb3' } },
  { learnLanguageText: 'b', sound: { id: '101afffb3' } },
  { learnLanguageText: 'c', sound: { id: '102afffb3' } }
];

jest.mock('../../../../src/dux/sequence/selectors', () => ({
  purgeableItems: () => [{}, {}, {}],
  correctItems: () => [mockItems[0], mockItems[1]],
  incorrectItems: () => [mockItems[2]]
}));

describe('ReviewEndScreenContainer', () => {
  const props = {
    ...mockServices,
    onCorrectErrorsButtonClick: jest.fn(),
    onReviewMoreButtonClick: jest.fn(),
    onGetMoreInfoLinkClick: jest.fn(),
    onCloseButtonClick: jest.fn(),
    showCloseButton: false
  };
  const state = {
    account: {
      data: {
        displayname: 'Julia'
      }
    },
    session: {
      locale: 'locale-test'
    },
    review: {
      hasNextReviewItems: false,
      reviewItems: {
        vocabulary: {
          trainers: []
        }
      }
    },
    sequence: {}
  };

  describe('#mapStateToProps', () => {
    it('should return the correct props', () => {
      expect(mapStateToProps(state)).toMatchSnapshot();
    });
  });

  describe('#mergeProps', () => {
    it('should return the correct props', () => {
      const stateProps = {
        purgeableItemsCount: 3,
        correctItems: [mockItems[0], mockItems[1]],
        incorrectItems: [mockItems[2]],
        displayName: 'Julia'
      };
      expect(mergeProps(stateProps, null, props)).toMatchSnapshot();
    });
  });

  describe('#getGrade', () => {
    it('should return correct grade', () => {
      expect(getGrade(0, 10)).toEqual('low');
      expect(getGrade(5, 10)).toEqual('medium');
      expect(getGrade(10, 10)).toEqual('high');
    });
  });

  describe('learn language text', () => {
    beforeEach(() => {
      formatLL.mockClear();
      mapStateToProps(state);
    });

    test('calls formatLL to remove CAT formatting', () => {
      expect(formatLL).toHaveBeenCalledTimes(mockItems.length);
    });
  });
});
