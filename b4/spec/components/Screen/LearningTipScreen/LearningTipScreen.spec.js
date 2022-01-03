import React from 'react';
import { LearningTipScreen } from '../../../../src/components/Screen/LearningTipScreen/LearningTipScreen';
import { shallow } from 'enzyme';

import { isWebview } from '../../../../src/lib/features';
jest.mock('../../../../src/lib/features');


describe('<LearningTipScreen />', () => {
  const mockOnContinueButtonClick = jest.fn();

  const defaultProps = {
    onContinueButtonClick: mockOnContinueButtonClick,
    translations: {
      title: 'mock-translation-for-learning_tip.title',
      tip: 'mock-translation-for-learning_tip.tip',
      action: 'mock-translation-for-learning_tip.action'
    }
  };

  test('it renders', () => {
    const component = shallow(<LearningTipScreen {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });

  describe('when NOT in Webview', () => {
    beforeEach(() => {
      isWebview.mockImplementationOnce(() => false);
    });

    test('should enable user selection', () => {
      const component = shallow(<LearningTipScreen {...defaultProps} />);

      expect(component.find('.loy-learning-tip-screen__disable-selection')).toHaveLength(0);
    });
  });

  describe('when in Webview', () => {
    beforeEach(() => {
      isWebview.mockImplementationOnce(() => true);
    });

    test('should disable user selection', () => {
      const component = shallow(<LearningTipScreen {...defaultProps} />);

      expect(component.find('.loy-learning-tip-screen__disable-selection')).toHaveLength(1);
    });
  });
});
