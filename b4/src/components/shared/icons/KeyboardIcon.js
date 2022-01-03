import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const KeyboardIcon = ({ theme, size, fillColor })=> (
  <Icon
    viewBox="0 0 24 24"
    size={size}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4C2.34315 4 1 5.34315 1 7v13h19c1.6569 0 3-1.3431 3-3V7c0-1.65685-1.3431-3-3-3H4zM3 7c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v10c0 .5523-.4477 1-1 1H3V7zm4 1H5v2h2V8zm1 0h2v2H8V8zm5 0h-2v2h2V8zm1 0h2v2h-2V8zm5 0h-2v2h2V8zM5 11h2v2H5v-2zm5 0H8v2h2v-2zm1 0h2v2h-2v-2zm5 0h-2v2h2v-2zm1 0h2v2h-2v-2zM7 14H5v2h2v-2zm1 0h8v2H8v-2zm11 0h-2v2h2v-2z" // eslint-disable-line
      fill={fillColor || theme.cascada.storm}
    />
  </Icon>
);

KeyboardIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string,
  fillColor: PropTypes.string
};

export default withTheme(KeyboardIcon);
