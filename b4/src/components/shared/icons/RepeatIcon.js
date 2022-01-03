import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const RepeatIcon = ({ theme, size }) => (
  <Icon viewBox="0 0 23 25" size={size} >
    <path
      d="M5 6.25h12.5V10l5-5-5-5v3.75h-15v7.5H5v-5zm12.5 12.5H5V15l-5 5 5 5v-3.75h15v-7.5h-2.5v5z"
      fill={theme.cascada.storm}
    />
  </Icon>
);

RepeatIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string
};

export default withTheme(RepeatIcon);
