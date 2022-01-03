import React from 'react';
import { InternetExplorerMessage } from '../../../src/components/shared/InternetExplorerMessage';
import { shallow } from 'enzyme';

jest.mock('../../../src/lib/languageCodeConverter', () => ({
  localeToBCP47: jest.fn((s) => s)
}));

describe('<InternetExplorerMessage />', () => {
  const mockOnRemindLaterClick = jest.fn();

  const defaultProps = {
    translations: {
      body: 'Your browser, Internet Explorer, doesn’t work well with Babbel’s latest features.',
      ctaClose: 'Remind me later',
      ctaShowMe: 'Show me how',
      title: 'Please upgrade your web browser'
    },
    onRemindLaterClick: mockOnRemindLaterClick,
    locale: 'en-us'
  };

  let wrapper;

  test('it renders', () => {
    wrapper = shallow(<InternetExplorerMessage {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('calls onRemindLaterClick after clicking to "Remind me later" button', () => {
    const remindLaterButton = wrapper.find('[data-selector="remind-me-later-button"]').first();
    remindLaterButton.simulate('click');
    expect(defaultProps.onRemindLaterClick).toHaveBeenCalled();
  });

  test('"Show me how" button contains the correct link', () => {
    const linkLikeAButton = wrapper.find('styled.a');
    expect(linkLikeAButton).toMatchSnapshot();
  });
});
