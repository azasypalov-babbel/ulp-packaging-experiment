import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

const MicIcon = ({ size }) => (
  <Icon
    viewBox="0 0 32 32"
    size={size}
  >
    <path d="M25.3332 16C25.3332 21.1547 21.1545 25.3333 15.9998 25.3333C10.8452 25.3333 6.6665 21.1547 6.6665 16"
      fill="transparent" stroke="currentColor" strokeWidth="2.667" strokeLinejoin="round" />
    <line x1="16" y1="25.333" x2="16" y2="29.333" stroke="currentColor" strokeWidth="2.667"
      fill="transparent" strokeLinejoin="round" />
    <rect x="12" y="4" width="8" height="16" rx="4" stroke="currentColor" strokeWidth="2.667"
      fill="transparent" strokeLinejoin="round" />
  </Icon>
);

MicIcon.propTypes = {
  size: PropTypes.string
};

export default MicIcon;
