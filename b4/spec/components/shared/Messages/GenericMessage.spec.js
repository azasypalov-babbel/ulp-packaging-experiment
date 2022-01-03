import React from 'react';
import { shallow } from 'enzyme';
import { GenericMessage } from
  '../../../../src/components/shared/Messages/GenericMessage';


describe('<GenericMessage />', () => {
  const props = {
    navigationService: {
      reload: jest.fn()
    },
    navigateToReturnUrl: jest.fn(),
    translations: {
      reload: {
        title: 'generic_error_screen.reload.title',
        body: 'generic_error_screen.reload.body',
        cta: 'generic_error_screen.reload.cta'
      },
      return: {
        title: 'generic_error_screen.return.title',
        body: 'generic_error_screen.return.body',
        cta: 'generic_error_screen.return.cta'
      }
    }
  };

  test('renders', () => {
    const wrapper = shallow(<GenericMessage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('when passing only requiered props', () => {
    const wrapper = shallow(<GenericMessage {...props} />);

    describe('when clicking on CTA button', () => {
      beforeEach(() => {
        const ctaButton = wrapper.find('[data-selector="cta-button"]');
        ctaButton.simulate('click');
      });

      test('user is redirected', () => {
        expect(props.navigateToReturnUrl).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when passing isReload prop', () => {
    const wrapper = shallow(<GenericMessage {...props} isReload />);

    describe('when clicking on CTA button', () => {
      beforeEach(() => {
        const ctaButton = wrapper.find('[data-selector="cta-button"]');
        ctaButton.simulate('click');
      });

      test('page gets reloaded', () => {
        expect(props.navigationService.reload).toHaveBeenCalledTimes(1);
      });
    });
  });
});
