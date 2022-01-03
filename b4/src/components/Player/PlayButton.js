import { Button, IconPause, IconPlay, IconRetry } from '@lessonnine/design-system.lib';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { ResponsivePropType, responsiveStyles } from '../../lib/styledComponentsUtils';
import { PlayStates } from '../../services/soundService';

export const SIZES = {
  jumbo: 96,
  large: 72
};

const RoundButton = styled(Button)`
  ${responsiveStyles('$size', ({ $size: responsiveSize }) => `
    height: ${SIZES[responsiveSize]}px;
    width: ${SIZES[responsiveSize]}px;
  `)}
  border-radius: 50%;
  &:focus:focus-visible::after {
    border-radius: 50%;
  }
`;

RoundButton.propTypes = {
  $size: ResponsivePropType(
    PropTypes.oneOf(Object.keys(SIZES))
  )
};

const iconProps = {
  width: '2rem',
  height: '2rem',
  viewBox: '0 0 24 24'
};

export const PlayButton = ({ disabled, playState, onClick, ...rest }) => {
  const icon = (() => {
    switch (playState) {
      case PlayStates.COMPLETED:
        return <IconRetry {...iconProps} />;
      case PlayStates.INITIAL:
      case PlayStates.PAUSED:
        return <IconPlay {...iconProps} fill="currentColor" />;
      default: return <IconPause {...iconProps} fill="currentColor" />;
    }
  })();
  return (
    <RoundButton
      {...rest}
      $size={{ xxxsmall: 'large', xsmall: 'jumbo' }}
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      color="secondary"
    />
  );
};

PlayButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  playState: PropTypes.oneOf(Object.values(PlayStates))
};
