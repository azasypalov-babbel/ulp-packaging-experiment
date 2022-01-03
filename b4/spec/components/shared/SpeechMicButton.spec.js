import React from 'react';
import { shallow } from 'enzyme';
import { SpeechMicButton } from '../../../src/components/shared/MicButton/SpeechMicButton';

describe('<SpeechMicButton />', () => {
  const props = {
    showTooltip: false,
    visible: true,
    appearance: 'RESTING',
    onTouchEnd: () => { },
    onTouchStart: () => { },
    onClick: () => { },
    translations: {
      tapToSpeak: 'Tap to speak',
      pressToSpeak: 'Press to speak',
      speak: 'Speak now...'
    }
  };


  test('it renders resting', () => {
    const wrapper = shallow(<SpeechMicButton {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('it renders with a tooltip', () => {
    const wrapper = shallow(
      <SpeechMicButton {...props} showTooltip={true} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
