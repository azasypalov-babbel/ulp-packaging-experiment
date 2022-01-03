import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { withTheme } from 'styled-components';


const ShowIcon = ({ theme, size }) => {
  return (
    <Icon
      fill="none"
      viewBox="0 0 24 24"
      size={size}
    >
      <path
        d="M21 12c-1 2.4-4.03 6-9 6s-8-3.6-9-6c1-2.4 4.03-6 9-6s8 3.6 9 6z"
        stroke={theme.cascada.storm}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        stroke={theme.cascada.storm}
        strokeWidth="2"
        strokeLinejoin="round"/>
    </Icon>
  );
};

ShowIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string
};

export default withTheme(ShowIcon);
