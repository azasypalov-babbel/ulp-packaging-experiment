import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MicButton from '../../shared/MicButton/MicButton';
import Text from '../../shared/Text';

const StyledMicButton = styled.div`
  position: sticky;
  top: 100vh;
  margin-top: auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  visibility: ${(props) => props.visible ? 'visible' : 'hidden'};
`;

const StyledWrapper = styled.div`
  margin: 1rem;
`;

const SpeechMicButton = React.forwardRef(({
  onMicButtonTouchStart,
  onMicButtonTouchEnd,
  isListening,
  isRecording,
  onMicButtonClick,
  isMicEnabled,
  visible = true,
  translations
}, ref) => {
  const shouldRenderSpeakNowLabel = isMicEnabled && (isListening || isRecording);
  const shouldRenderClickToSpeakLabel = isMicEnabled && !(isListening || isRecording);

  const isUseTouchEvents =  onMicButtonTouchStart && onMicButtonTouchEnd;
  const instructionText = isUseTouchEvents
    ? translations.micButton.tapToSpeak
    : translations.micButton.pressToSpeak;

  return (
    <StyledMicButton visible={visible} ref={ref}>
      <Text
        fontFamily="fontMilliardMedium"
        color="spaceGrayW15"
        fontSize="base"
        textAlign="center"
      >
        {shouldRenderSpeakNowLabel && translations.micButton.speak}
        {shouldRenderClickToSpeakLabel && instructionText}
        {!(shouldRenderClickToSpeakLabel || shouldRenderClickToSpeakLabel) && ' '}
      </Text>
      <StyledWrapper>
        <MicButton
          isListening={isListening}
          isUserSpeaking={isRecording}
          onClick={!isUseTouchEvents ? onMicButtonClick : undefined}
          onTouchStart={isUseTouchEvents ? onMicButtonTouchStart : undefined}
          onTouchEnd={isUseTouchEvents ? onMicButtonTouchEnd : undefined}
          disabled={!isMicEnabled}
        />
      </StyledWrapper>
    </StyledMicButton>
  );
});

SpeechMicButton.displayName = 'SpeechMicButton';

SpeechMicButton.propTypes = {
  onMicButtonTouchStart: PropTypes.func,
  onMicButtonTouchEnd: PropTypes.func,
  onMicButtonClick: PropTypes.func,
  isListening: PropTypes.bool.isRequired,
  isRecording: PropTypes.bool.isRequired,
  isMicEnabled: PropTypes.bool,
  translations: PropTypes.object.isRequired,
  visible: PropTypes.bool
};

export default SpeechMicButton;
