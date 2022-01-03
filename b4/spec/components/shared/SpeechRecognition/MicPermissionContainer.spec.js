import React from 'react';
import { shallow } from 'enzyme';
import { MicPermissionContainer } from '../../../../src/components/shared/SpeechRecognition/MicPermissionContainer';


describe('<MicPermissionContainer />', () => {
  const mockTrack = jest.fn();

  const defaultProps = {
    isReview: false,
    track: mockTrack,
    requestMicPermissions: jest.fn(),
    setPermissionCompleted: jest.fn(),
    isMicPermissionGranted: true,
    learnLanguageAlpha3: 'DEU',
    locale: 'en'
  };

  describe('when mic permission are granted', () => {
    test('renders MicPermission component', () => {
      const props = {
        ...defaultProps,
        isMicPermissionGranted: true
      };
      const wrapper = shallow(<MicPermissionContainer {...props}/>);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when mic permission are not granted', () => {
    test('renders MicPermission component', () => {
      const props = {
        ...defaultProps,
        isMicPermissionGranted: false
      };
      const wrapper = shallow(<MicPermissionContainer {...props}/>);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('on mount', () => {
    test('requests mic permission', () => {
      shallow(<MicPermissionContainer {...defaultProps} />);

      expect(defaultProps.requestMicPermissions).toHaveBeenCalled();
    });

    test('tracks gui:shown', () => {
      shallow(<MicPermissionContainer {...defaultProps} />);

      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
      mockTrack.mockClear();
    });
  });

  describe('#startMicOnboarding', () => {
    const wrapper = shallow(<MicPermissionContainer {...defaultProps} />);
    beforeEach(() => {
      wrapper.instance().onMicPermissionComplete();
    });

    test('sets permission completed', () => {
      expect(defaultProps.setPermissionCompleted).toHaveBeenCalledWith(true);
    });

    test('tracks gui:interacted', () => {
      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
      mockTrack.mockClear();
    });
  });
});
