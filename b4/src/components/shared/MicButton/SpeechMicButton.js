import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MicButton from './MicButton';
import ToolTip from '../../shared/ToolTip';
import { isWebview } from '../../../lib/features';
import withTranslations from '../withTranslations';

const StyledMicButton = styled.div`
  visibility: ${(props) => props.visible ? 'visible' : 'hidden'};

  margin: 1rem;

  // The background pulse animation uses a negative z-index.
  // Assigning a z-index to the button prevents the pulse animation
  // to be hidden behind parent components that also define a z-index.
  z-index: 1;

  outline: 0;
`;

export const SpeechMicButton = ({
  appearance,
  showTooltip,
  onTouchStart,
  onTouchEnd,
  visible,
  onClick,
  translations,
  ...props
}) => {
  const { tapToSpeak, pressToSpeak, speak } = translations;
  let instructionText = '';

  switch (appearance) {
    case 'RESTING':
      // for a browser that supports both touch and mouse events, the most
      // educated guess about what instructions to show atm seems to be
      // if its webview or not.
      instructionText = isWebview() ? tapToSpeak : pressToSpeak;
      break;
    case 'LISTENING':
      instructionText = speak;
      break;
    case 'RECORDING':
      instructionText = speak;
      break;
  }

  // Prevent touch devices from issuing `mousedown` events, see https://w3c.github.io/touch-events/#mouse-events
  const wrappedOnTouchStart = (e) => {
    e.preventDefault();
    onTouchStart();
  };

  // Prevent touch devices from issuing both `mouseup` and `click` events.
  const wrappedOnTouchEnd = (e) => {
    e.preventDefault();
    onTouchEnd();
  };

  // If a pointer is used to press and hold the button on iPhoneOS,
  // WebKit will not issue touch events. It is safe to forward the
  // mouse events to the touch handlers in a webview environment.
  const onMouseDown = isWebview() ? onTouchStart : undefined;
  const onMouseUp = isWebview() ? onTouchEnd : undefined;

  return (
    <StyledMicButton
      data-selector="mic-button"
      visible={visible}
      data-appearance={appearance}
      {...props}
    >
      <ToolTip
        text={instructionText}
        position="TOP"
        visible={showTooltip && appearance != 'DISABLED'}>
        <MicButton
          isListening={appearance == 'LISTENING'}
          isUserSpeaking={appearance == 'RECORDING'}
          onClick={onClick}
          onTouchStart={wrappedOnTouchStart}
          onTouchEnd={wrappedOnTouchEnd}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          disabled={appearance == 'DISABLED'}
        />
      </ToolTip>
    </StyledMicButton>
  );
};

SpeechMicButton.propTypes = {
  appearance: PropTypes.oneOf(['RESTING', 'LISTENING', 'RECORDING', 'DISABLED']),
  showTooltip: PropTypes.bool,
  onTouchStart: PropTypes.func,
  onTouchEnd: PropTypes.func,
  visible: PropTypes.bool,
  onClick: PropTypes.func,
  translations: PropTypes.shape({
    pressToSpeak: PropTypes.string.isRequired,
    tapToSpeak: PropTypes.string.isRequired,
    speak: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => ({
  pressToSpeak: translate('speech_recognition.mic_button.press_to_speak'),
  tapToSpeak: translate('speech_recognition.mic_button.tap_to_speak'),
  speak: `${translate('speech_recognition.mic_button.speak')}...`
});

export default withTranslations(getTranslations)(SpeechMicButton);
