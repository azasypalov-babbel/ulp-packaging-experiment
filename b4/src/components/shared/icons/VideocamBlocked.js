import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

const VideocamBlocked = ({ size }) => (
  <Icon
    viewBox="0 0 24 24"
    size={size}
  >
    <path
      fill="#CB4F40"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.7 11C12.7611 11 12 11.7611 12 12.7V19.3C12 20.2389 12.7611 21 13.7 21H20.3C21.2389 21 22 20.2389 22 19.3V12.7C22 11.7611 21.2389 11 20.3 11H13.7ZM19.5 17.795L18.795 18.5L17 16.705L15.205 18.5L14.5 17.795L16.295 16L14.5 14.205L15.205 13.5L17 15.295L18.795 13.5L19.5 14.205L17.705 16L19.5 17.795Z" // eslint-disable-line
    />
    <path
      fill="#606368"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 5V8.5L19 4.5V10H13.7C12.2088 10 11 11.2088 11 12.7V16H2C1.45 16 1 15.55 1 15V5C1 4.45 1.45 4 2 4H14C14.55 4 15 4.45 15 5Z" // eslint-disable-line
    />
  </Icon>
);

VideocamBlocked.propTypes = {
  size: PropTypes.string
};

export default VideocamBlocked;
