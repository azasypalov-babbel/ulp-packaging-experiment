import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { withTheme } from 'styled-components';


const MicOff = ({ theme, size, fillColor  }) => {
  const color = fillColor || theme.cascada.red;
  return (
    <Icon
      fill="none"
      viewBox="0 0 45 45"
      size={size}
    >
      <path
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="3.75"
        d="M35.625 22.5c0 7.249-5.876 13.125-13.125 13.125S9.375 29.749 9.375 22.5"
      />
      <path
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="3.75"
        d="M22.5 35.625L22.5 41.25"
      />
      <rect
        width="11.25"
        height="22.5"
        x="16.875"
        y="5.625"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="3.75"
        rx="5.625"
      />
      <path
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="3.75"
        d="M9.375 9.375l26.25 26.25"
      />
    </Icon>
  );
};

MicOff.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string,
  fillColor: PropTypes.string
};

export default withTheme(MicOff);
