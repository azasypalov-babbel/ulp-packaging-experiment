import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import posed from 'react-pose';
import { easing, tween } from 'popmotion';
import { responsiveStyles, ResponsivePropType } from '../../../lib/styledComponentsUtils';

const INIT_STROKE_WIDTH = 3;
const HOVER_STROKE_WIDTH = 5;

export const SIZES = {
  jumbo: 96,
  large: 72,
  regular: 56,
  small: 48
};

const getRadiusStyle = (strokeWidth) => `calc(1em - (${strokeWidth}px / 2))`;
const initRadius = getRadiusStyle(INIT_STROKE_WIDTH);
const hoverRadius = getRadiusStyle(HOVER_STROKE_WIDTH);

const PosedBackgroundCircle = posed.circle({
  init: {
    fill: (props) => props.theme.cascada.white,
    strokeWidth: INIT_STROKE_WIDTH,
    r: initRadius
  },
  hover: {
    fill: (props) => props.theme.cascada.pastelElectric,
    strokeWidth: HOVER_STROKE_WIDTH,
    r: hoverRadius
  }
});

const getStrokeDashArray = ({ duration }) =>
  tween({
    from: 0,
    to: 1,
    ease: easing.linear,
    duration
  })
    .pipe((progress) => `${(1 - progress) * Math.PI * 100}%`);


const PosedProgressCircle = posed.circle({
  init: {
    strokeWidth: INIT_STROKE_WIDTH,
    r: initRadius,
    transition: {
      duration: '500'
    }
  },
  hover: {
    strokeWidth: HOVER_STROKE_WIDTH,
    r: hoverRadius,
    transition: {
      duration: '500'
    }
  },
  ended: {
    opacity: 0,
    transition: {
      delay: '500',
      duration: '500'
    }
  },
  playing: {
    opacity: 1,
    strokeDashoffset: 0,
    transition: {
      strokeDashoffset: getStrokeDashArray
    }
  }
});

const StyledContainer = styled.svg`
  transform: rotate(${270}deg);
  ${responsiveStyles('size', ({ size: responsiveSize }) => `
    height: ${SIZES[responsiveSize]}px;
    width: ${SIZES[responsiveSize]}px;
    font-size: ${SIZES[responsiveSize] / 2}px;
  `)}
`;

const ProgressCircle = ({ isPlaying, size, duration, theme }) => {
  return (
    <StyledContainer size={size}>
      <PosedBackgroundCircle
        stroke={theme.cascada.pastelStorm}
        theme={theme}
        cx="1em"
        cy="1em"
      />
      <PosedProgressCircle
        fill="transparent"
        pose={isPlaying ? 'playing' : 'ended'}
        stroke="currentColor"
        cx="1em"
        cy="1em"
        strokeLinecap="round"
        strokeDasharray={`${Math.PI * 100}%`}
        duration={duration}
      />
    </StyledContainer>
  );
};

ProgressCircle.propTypes = {
  size: ResponsivePropType(
    PropTypes.oneOf(Object.keys(SIZES))
  ).isRequired,
  duration: PropTypes.number,
  theme: PropTypes.any,
  isPlaying: PropTypes.bool
};

export default withTheme(ProgressCircle);
