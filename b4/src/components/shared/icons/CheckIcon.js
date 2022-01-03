import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const CheckIcon = ({ theme, size, fillColor }) => (
  <Icon size={size} viewBox="0 0 24 24">
    <path
      fill={fillColor || theme.cascada.white}
      fillRule="evenodd"
      d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"
    />
  </Icon>
);

CheckIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string,
  fillColor: PropTypes.string
};

export default withTheme(CheckIcon);

