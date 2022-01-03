import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const CrossIcon = ({ theme, size, fillColor }) => (
  <Icon size={size} viewBox="0 0 24 24">
    <path
      fill={fillColor || theme.cascada.white}
      fillRule="evenodd"
      d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z"
    />
  </Icon>
);

CrossIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string,
  fillColor: PropTypes.string
};

export default withTheme(CrossIcon);
