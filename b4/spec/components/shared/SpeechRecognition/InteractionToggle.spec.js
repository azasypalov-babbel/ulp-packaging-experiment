import React from 'react';
import { InteractionToggle } from '../../../../src/components/shared/SpeechRecognition/InteractionToggle';
import { shallow } from 'enzyme';

jest.mock('../../../../src/components/shared/IconButton/IconButton', () => 'IconButton');

const handleClick = jest.fn();
const mockTrack = jest.fn();

const defaultProps = {
  isMicEnabled: true,
  locale: 'en',
  onClick: handleClick,
  track: mockTrack,
  learnLanguageAlpha3: 'DEU',
  type: 'cube',
  interaction: 'speak',
  translations: {
    toggleOff: 'I can\'t speak now',
    toggleOn: 'I can speak now'
  }
};

describe('<InteractionToggle />', () => {
  describe('when mic is enabled', () => {
    test('it renders', () => {
      const props = {
        ...defaultProps,
        isMicEnabled: true
      };
      const wrapper = shallow(<InteractionToggle {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when mic is disabled', () => {
    const props = {
      ...defaultProps,
      isMicEnabled: false
    };

    test('it renders', () => {
      const wrapper = shallow(<InteractionToggle {...props}/>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('on click', () => {
    let wrapper;
    const props = {
      ...defaultProps
    };

    beforeEach(() => {
      wrapper = shallow(<InteractionToggle {...props}/>);
      wrapper.instance().handleClick();
    });

    test('it executes the callback passed as prop', () => {
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('it tracks "gui:interacted"', () => {
    let wrapper;
    const props = {
      ...defaultProps
    };
    const blur = jest.fn();

    afterEach(() => {
      mockTrack.mockClear();
    });

    describe('gui_variant: without_mic', () => {
      test('gui_container: vocabularySpeak', () => {
        wrapper = shallow(<InteractionToggle {...props} type="vocabulary" isMicEnabled={false} />);
        wrapper.instance().buttonRef = { current: { blur } };
        wrapper.instance().handleClick();

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
      });

      test('gui_container: dialogSpeak', () => {
        wrapper = shallow(<InteractionToggle {...props} type="dialog" isMicEnabled={false} />);
        wrapper.instance().buttonRef = { current: { blur } };
        wrapper.instance().handleClick();

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('gui_variant: with_mic', () => {
      test('gui_container: vocabularySpeak', () => {
        wrapper = shallow(<InteractionToggle {...props} type="vocabulary" isMicEnabled={true} />);
        wrapper.instance().buttonRef = { current: { blur } };
        wrapper.instance().handleClick();

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
      });

      test('gui_container: dialogSpeak', () => {
        wrapper = shallow(<InteractionToggle {...props} type="dialog" isMicEnabled={true} />);
        wrapper.instance().buttonRef = { current: { blur } };
        wrapper.instance().handleClick();

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
      });
    });
  });
});
