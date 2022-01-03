import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const StopIcon = ({ theme, size }) => (
  <Icon viewBox="0 0 24 24" size={size}>
    <defs>
      <path
        d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
        id="StopIcon_svg__a"
      />
    </defs>
    <use fill={theme.cascada.storm} fillRule="nonzero" xlinkHref="#StopIcon_svg__a" />
  </Icon>
);

StopIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string
};

export default withTheme(StopIcon);
