import React from 'react';
import ReviewActions from '../../../../src/components/Review/ReviewEndScreen/ReviewActions';
import { shallow } from 'enzyme';

import { isWebview } from '../../../../src/lib/features';
import LoyButton from '../../../../src/components/Legacy/LoyButton';
jest.mock('../../../../src/lib/features');

describe('<ReviewActions />', () => {
  const defaultProps = {
    onCorrectErrorsButtonClick: jest.fn(),
    onReviewMoreButtonClick: jest.fn(),
    onCloseButtonClick: jest.fn(),
    purgeableItemsCount: 0,
    hasNextReviewItems: false,
    correctErrorsButtonText: 'Correct your errors (5)',
    closeText: 'Close',
    reviewMoreButtonText: 'Review more'
  };

  describe('when in Webview', () => {
    beforeEach(() => {
      isWebview.mockImplementation(() => true);
    });

    describe('when there are no purgeable items', () => {
      describe('when there are no next review items', () => {
        test('it renders the `Close` button', () => {
          const props = Object.assign({}, defaultProps, {
            purgeableItemsCount: 0,
            hasNextReviewItems: false
          });
          const component = shallow(<ReviewActions {...props} />);
          const buttons = component.find(LoyButton);

          expect(buttons).toHaveLength(1);
          expect(buttons.at(0).children().text()).toEqual(defaultProps.closeText);
        });
      });

      describe('when there are some next review items', () => {
        test('it renders the `Close` button', () => {
          const props = Object.assign({}, defaultProps, {
            purgeableItemsCount: 0,
            hasNextReviewItems: true
          });
          const component = shallow(<ReviewActions {...props} />);
          const buttons = component.find(LoyButton);

          expect(buttons).toHaveLength(1);
          expect(buttons.at(0).children().text()).toEqual(defaultProps.closeText);
        });
      });
    });

    describe('when there are some purgeable items', () => {
      describe('when there are no next review items', () => {
        test('it renders the `Close` button', () => {
          const props = Object.assign({}, defaultProps, {
            purgeableItemsCount: 5,
            hasNextReviewItems: false
          });
          const component = shallow(<ReviewActions {...props} />);
          const buttons = component.find(LoyButton);

          expect(buttons).toHaveLength(1);
          expect(buttons.at(0).children().text()).toEqual(defaultProps.closeText);
        });
      });

      describe('when there are some next review items', () => {
        test('it renders the `Close` button', () => {
          const props = Object.assign({}, defaultProps, {
            purgeableItemsCount: 5,
            hasNextReviewItems: true
          });
          const component = shallow(<ReviewActions {...props} />);
          const buttons = component.find(LoyButton);

          expect(buttons).toHaveLength(1);
          expect(buttons.at(0).children().text()).toEqual(defaultProps.closeText);
        });
      });
    });
  });

  describe('when NOT in Webview', () => {
    beforeEach(() => {
      isWebview.mockImplementation(() => false);
    });

    describe('when there are no purgeable items', () => {
      describe('when there are no next review items', () => {
        test('it renders the `Close` button', () => {
          const props = Object.assign({}, defaultProps, {
            purgeableItemsCount: 0,
            hasNextReviewItems: false
          });
          const component = shallow(<ReviewActions {...props} />);
          const buttons = component.find(LoyButton);

          expect(buttons).toHaveLength(1);
          expect(buttons.at(0).children().text()).toEqual(defaultProps.closeText);
        });
      });

      describe('when there are some next review items', () => {
        test('it renders the `Review more` button', () => {
          const props = Object.assign({}, defaultProps, {
            purgeableItemsCount: 0,
            hasNextReviewItems: true
          });
          const component = shallow(<ReviewActions {...props} />);
          const buttons = component.find(LoyButton);

          expect(buttons).toHaveLength(1);
          expect(buttons.at(0).children().text()).toEqual(defaultProps.reviewMoreButtonText);
        });
      });
    });

    describe('when there are some purgeable items', () => {
      describe('when there are no next review items', () => {
        test('it renders the `Correct your errors` and `Close` buttons', () => {
          const props = Object.assign({}, defaultProps, {
            purgeableItemsCount: 5,
            hasNextReviewItems: false
          });
          const component = shallow(<ReviewActions {...props} />);
          const buttons = component.find(LoyButton);

          expect(buttons).toHaveLength(2);
          expect(buttons.at(0).children().text()).toEqual(defaultProps.correctErrorsButtonText);
          expect(buttons.at(1).children().text()).toEqual(defaultProps.closeText);
        });
      });

      describe('when there are some review items', () => {
        test('it renders the `Correct your errors` and `Review more` buttons', () => {
          const props = Object.assign({}, defaultProps, {
            purgeableItemsCount: 5,
            hasNextReviewItems: true
          });
          const component = shallow(<ReviewActions {...props} />);
          const buttons = component.find(LoyButton);

          expect(buttons).toHaveLength(2);
          expect(buttons.at(0).children().text()).toEqual(defaultProps.correctErrorsButtonText);
          expect(buttons.at(1).children().text()).toEqual(defaultProps.reviewMoreButtonText);
        });
      });
    });
  });
});
