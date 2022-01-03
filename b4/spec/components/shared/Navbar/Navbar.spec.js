import React from 'react';
import { Navbar } from '../../../../src/components/shared/Navbar/Navbar';
import { shallow } from 'enzyme';
import zendeskWidget from '../../../../src/lib/zendeskWidget';
import SkipTrainerControls from '../../../../src/components/Sequence/SkipTrainerControls';

jest.mock('../../../../src/lib/zendeskWidget', () => ({
  toggle: jest.fn()
}));

const defaultProps = {
  progressBar: {
    trainerCount: 4,
    sequenceHeadIndex: 2,
    currentTrainerIndex: 2,
    sequenceHeadProgress: 0.33,
    onTrainerClick: () => {}
  },
  showFeedbackButton: false,
  showProgressBar: false,
  progressCounter: {
    current: 1,
    total: 5
  },
  onClickClose: jest.fn(),
  translations: {
    closeButtonTitle: 'Close',
    feedbackButtonTitle: 'Contact'
  }
};

describe('<Navbar />', () => {
  let wrapper;

  describe('has SkipTrainerControls', () => {
    describe('showProgressBar is false', () => {
      beforeEach(() => {
        const props = { ...defaultProps, showProgressBar: false };
        wrapper = shallow(<Navbar {...props} />);
      });

      test('it has SkipTrainerControls', () => {
        expect(wrapper.find(SkipTrainerControls).exists()).toBeTruthy();
      });

      test('but they won\'t be shown because renderSkipAreas is false', () => {
        expect(wrapper.find(SkipTrainerControls).prop('renderSkipAreas')).toBeFalsy();
      });
    });

    describe('showProgressBar is true', () => {
      beforeEach(() => {
        const props = { ...defaultProps, showProgressBar: true };
        wrapper = shallow(<Navbar {...props} />);
      });

      test('it has SkipTrainerControls', () => {
        expect(wrapper.find(SkipTrainerControls).exists()).toBeTruthy();
      });

      test('and they will be shown because renderSkipAreas is true', () => {
        expect(wrapper.find(SkipTrainerControls).prop('renderSkipAreas')).toBeTruthy();
      });
    });
  });

  describe('when `showFeedbackButton` is false', () => {
    beforeEach(() => {
      const props = { ...defaultProps, showFeedbackButton: false };
      wrapper = shallow(<Navbar {...props} />);
    });

    test('it renders without Contact button', () => {
      const contactButton = wrapper.find('.loy-cascada-navbar__feedback').first();
      expect(contactButton.exists()).toBe(false);
    });
  });

  describe('when `showFeedbackButton` is true', () => {
    beforeEach(() => {
      const props = { ...defaultProps, showFeedbackButton: true };
      wrapper = shallow(<Navbar {...props} />);
    });

    test('it renders Contact button', () => {
      const contactButton = wrapper.find('.loy-cascada-navbar__feedback').first();
      expect(contactButton.exists()).toBe(true);
    });

    test('toggles zendesk widget when click Contact button', () => {
      const contactButton = wrapper.find('.loy-cascada-navbar__feedback').first();
      contactButton.simulate('click');

      expect(zendeskWidget.toggle).toHaveBeenCalled();
    });
  });

  describe('with `showProgressBar` set to false', () => {
    beforeEach(() => {
      wrapper = shallow(<Navbar {...defaultProps} />);
    });

    test('it renders without ProgressBar', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with `showProgressBar` set to true', () => {
    beforeEach(() => {
      const props = {
        ...defaultProps,
        showProgressBar: false
      };

      wrapper = shallow(<Navbar {...props} />);
    });

    test('it renders', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when closing the page', () => {
    describe('when clicking on Close link', () => {
      test('calls onClickClose callback', () => {
        const closeLink = wrapper.find('[data-selector="navbar-close-link"]');
        closeLink.simulate('click');
        expect(defaultProps.onClickClose).toHaveBeenCalled();
      });
    });

    describe('when tapping on X icon', () => {
      test('calls onClickClose callback', () => {
        const closeIcon = wrapper.find('[data-selector="navbar-close-icon"]');
        closeIcon.simulate('click');
        expect(defaultProps.onClickClose).toHaveBeenCalled();
      });
    });
  });
});
