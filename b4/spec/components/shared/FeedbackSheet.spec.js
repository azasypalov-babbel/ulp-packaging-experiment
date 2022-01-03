import React from 'react';
import { shallow } from 'enzyme';
import { FeedbackSheet } from '../../../src/components/shared/FeedbackSheet/FeedbackSheet';
import { StyledTop } from ' ../../../src/components/shared/FeedbackSheet/styles';
import Text from '../../../src/components/shared/Text';

describe('<FeedbackSheet />', () => {
  const commonProps = {
    translations: {
      tryAgain: 'try again buddy',
      continue: 'continue'
    }
  };
  const feedbackMessage = 'Good job well done! 😃';

  test('feedbackMessage is not rendered', () => {
    const wrapper = shallow(<FeedbackSheet {...commonProps} />);
    expect(wrapper.find(Text)).toHaveLength(0);
  });

  describe('when feedbackMessage prop is provided', () => {
    test('feedbackMessage is rendered', () => {
      const wrapper = shallow(
        <FeedbackSheet feedbackMessage={feedbackMessage} {...commonProps} />
      );
      expect(wrapper.find(Text).childAt(0).text()).toEqual(feedbackMessage);
    });
  });

  test('StyledTop does not exist', () => {
    const wrapper = shallow(<FeedbackSheet {...commonProps} />);
    expect(wrapper.find(StyledTop)).toHaveLength(0);
  });

  describe('when feedbackDetail prop is provided', () => {
    const highlightedText = (
      <p>
        <div>Learning Language Item</div>
      </p>
    );

    it('injects the node into StyledTop', () => {
      const wrapper = shallow(
        <FeedbackSheet {...commonProps} feedbackDetail={highlightedText} />
      );
      expect(wrapper.find(StyledTop).childAt(0).html()).toEqual(
        '<p><div>Learning Language Item</div></p>'
      );
    });
  });

  it('does not render continue button', () => {
    const wrapper = shallow(<FeedbackSheet {...commonProps} />);
    const continueBtn = wrapper.find('[data-selector="continue-button"]');
    expect(continueBtn).toHaveLength(0);
  });

  describe('when a continue handler is provided', () => {
    let wrapper;
    const handleContinueMock = jest.fn();
    const defaultProps = {
      ...commonProps,
      onContinueClick: handleContinueMock
    };

    beforeEach(() => {
      wrapper = shallow(<FeedbackSheet {...defaultProps} />);
    });
    it('renders a continue button', () => {
      const continueBtn = wrapper.find('[data-selector="continue-button"]');
      expect(continueBtn).toHaveLength(1);
    });
    it('renders the button as primpary', () => {
      const continueBtn = wrapper.find('[data-selector="continue-button"]');
      expect(continueBtn.props().primary).toEqual(true);
    });

    describe('when clicking the button', () => {
      it('calls onContinueClick callback', () => {
        const continueBtn = wrapper.find('[data-selector="continue-button"]');
        continueBtn.simulate('click');
        expect(handleContinueMock).toHaveBeenCalled();
      });
    });
  });

  it('does not render try again button', () => {
    const wrapper = shallow(<FeedbackSheet {...commonProps} />);
    const tryAgainBtn = wrapper.find('[data-selector="try-again-button"]');
    expect(tryAgainBtn).toHaveLength(0);
  });

  describe('when a handler is provided for try again', () => {
    let wrapper;
    const handleTryAgainMock = jest.fn();
    const defaultProps = {
      ...commonProps,
      onTryAgainClick: handleTryAgainMock
    };

    beforeEach(() => {
      wrapper = shallow(<FeedbackSheet {...defaultProps} />);
    });

    it('renders a try again button', () => {
      const tryAgainBtn = wrapper.find('[data-selector="try-again-button"]');
      expect(tryAgainBtn).toHaveLength(1);
    });

    describe('when clicking the button', () => {
      it('calls onTryAgainClick callback', () => {
        const tryAgainBtn = wrapper.find('[data-selector="try-again-button"]');
        tryAgainBtn.simulate('click');
        expect(defaultProps.onTryAgainClick).toHaveBeenCalled();
      });
    });
  });

  describe('when handlers for both continue and try again are provided', () => {
    let wrapper;
    const handleTryAgainMock = jest.fn();
    const handleContinueMock = jest.fn();
    const defaultProps = {
      ...commonProps,
      onTryAgainClick: handleTryAgainMock,
      onContinueClick: handleContinueMock
    };

    beforeEach(() => {
      wrapper = shallow(<FeedbackSheet {...defaultProps} />);
    });

    it('renders the try again button as primary', () => {
      const tryAgainBtn = wrapper.find('[data-selector="try-again-button"]');
      expect(tryAgainBtn.props().primary).toEqual(true);
      const continueBtn = wrapper.find('[data-selector="continue-button"]');
      expect(continueBtn.props().primary).toEqual(false);
    });
  });
});
