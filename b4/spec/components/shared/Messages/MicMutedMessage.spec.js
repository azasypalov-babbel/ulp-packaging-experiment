import React from 'react';
import { shallow } from 'enzyme';
import { MicMutedMessage } from
  '../../../../src/components/shared/Messages/MicMutedMessage';
import { MESSAGE_KEYS } from '../../../../src/dux/messages/messageKeys';


describe('<MicMutedMessage />', () => {
  let wrapper;
  const mockTrack = jest.fn();

  const defaultProps = {
    setMicSettings: jest.fn(),
    removeMessage: jest.fn(),
    locale: 'en',
    learnLanguageAlpha3: 'DEU',
    track: mockTrack,
    isReview: false,
    translations: {
      title: 'speech_recognition.error_mic_muted.title',
      body: 'speech_recognition.error_mic_muted.body',
      cta: 'speech_recognition.error_mic_muted.cta'
    }
  };

  test('tracks gui:shown', () => {
    shallow(<MicMutedMessage {...defaultProps} />);

    expect(mockTrack).toHaveBeenCalledTimes(1);
    expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
  });

  describe('when in lesson', () => {
    test('renders with the button', () => {
      const props = { ...defaultProps, isReview: false };
      wrapper = shallow(<MicMutedMessage {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when in review', () => {
    test('renders without the button', () => {
      const props = { ...defaultProps, isReview: true };
      wrapper = shallow(<MicMutedMessage {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('on click', () => {
    beforeEach(() => {
      wrapper = shallow(<MicMutedMessage {...defaultProps} />);
      const ctaButton = wrapper.find('[data-selector="cta-button"]');
      ctaButton.simulate('click');
    });

    afterEach(() => {
      mockTrack.mockClear();
    });

    test('calls setMicSettings', () => {
      expect(defaultProps.setMicSettings).toHaveBeenCalledWith(false);
    });

    test('calls removeMessage', () => {
      expect(defaultProps.removeMessage).toHaveBeenCalledWith(MESSAGE_KEYS.MIC_MUTED);
    });

    test('tracks gui:interacted', () => {
      expect(mockTrack).toHaveBeenCalledTimes(2);
      // first time will be called on mount for track gui:shown
      expect(mockTrack.mock.calls[1][0]).toMatchSnapshot();
    });
  });
});
