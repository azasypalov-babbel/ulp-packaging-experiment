import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import VolumeIcon from './icons/VolumeIcon';
import ProgressCircle, { SIZES } from './icons/ProgressCircle';
import posed from 'react-pose';
import { ResponsivePropType, responsiveStyles } from '../../lib/styledComponentsUtils';

const HoverablePlayButton = posed.div({ hoverable: true });

const StyledPlayButton = styled(HoverablePlayButton)`
  position: relative;
  ${responsiveStyles('size', ({ size: responsiveSize }) => `
    height: ${SIZES[responsiveSize]}px;
    width: ${SIZES[responsiveSize]}px;
  `)}
  padding: 0;
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: ${(props) => props.disabled ? 'inherit' : 'pointer'};

  ${({ isPlaying }) => !isPlaying && css`
    transition: color 500ms linear 500ms;
  `}

  ${({ theme, isSlowPlayback, isPlaying }) => css`
    color: ${(isSlowPlayback && isPlaying) ? theme.cascada.survivalBlue : theme.cascada.storm};
  `}
`;

StyledPlayButton.displayName = 'StyledPlayButton';

const PositionedCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

const IconsCover = styled.div`
  display: flex;
  z-index: 1;
`;

const PlayButton = ({
  size = 'regular',
  isPlaying,
  isSlowPlayback,
  onClick,
  disabled,
  duration,
  className
}) => {
  return (
    <StyledPlayButton
      className={className}
      isPlaying={isPlaying}
      isSlowPlayback={isSlowPlayback}
      size={size}
      onClick={onClick}
      disabled={disabled}
      data-selector="play-button"
      data-sound={isPlaying ? 'is-playing' : 'has-ended'}
    >
      <IconsCover>
        <VolumeIcon size={size} color="currentColor" />
      </IconsCover>
      <PositionedCover>
        <ProgressCircle size={size} duration={duration} isPlaying={isPlaying} />
      </PositionedCover>
    </StyledPlayButton>
  );
};

PlayButton.propTypes = {
  isSlowPlayback: PropTypes.bool,
  isPlaying: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: ResponsivePropType(
    PropTypes.oneOf(Object.keys(SIZES))
  ),
  duration: PropTypes.number,
  className: PropTypes.string
};

PlayButton.defaultProps = {
  onClick: () => {},
  disabled: false,
  duration: 0
};

export default PlayButton;
