import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const LockIcon = ({ theme, size }) => (
  <Icon size={size} viewBox="0 0 16 16">
    <path
      fillRule="evenodd"
      fill={theme.cascada.iceGray}
      d="M3.333 4C2.597 4 2 4.597 2 5.333v9.334h10.667c.736 0 1.333-.597 1.333-1.334v-8C14 4.597 13.403
      4 12.667 4H3.333zM8 11.333a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8
      1.333a2 2 0 0 0-2 2H4.667a3.333 3.333 0 1 1 6.666 0H10a2 2 0 0 0-2-2z"
    />
  </Icon>
);

LockIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string
};

export default withTheme(LockIcon);
