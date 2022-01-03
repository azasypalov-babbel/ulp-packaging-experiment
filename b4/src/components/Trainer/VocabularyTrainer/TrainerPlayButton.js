import { rem } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PlayButton from '../../shared/PlayButton';

const StyledButtonContainer = styled.div`
  margin-top: -0.5rem;
  margin-bottom: ${rem(32)};
  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    margin-bottom: ${rem(48)};
  }
`;

export const TrainerPlayButton = ({ playSound, isPlaying, isSlowPlayback, duration }) => (
  <StyledButtonContainer>
    <PlayButton
      onClick={playSound}
      isPlaying={isPlaying}
      isSlowPlayback={isSlowPlayback}
      duration={duration}
      size="jumbo"
    />
  </StyledButtonContainer>
);

TrainerPlayButton.propTypes = {
  playSound: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isSlowPlayback: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired
};
