import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { withTheme } from 'styled-components';


const HideIcon = ({ theme, size }) => {
  return (
    <Icon
      fill="none"
      viewBox="0 0 24 24"
      size={size}
    >
      <path
        d="M3 7c1 2.4 4.03 6 9 6s8-3.6 9-6M12 15v3M7.174 14.423l-1.268
          2.719M3.941 11.766l-2.298 1.928M18.362 17.142l-1.268-2.719M22.655 13.694l-2.298-1.928"
        stroke={theme.cascada.storm}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

HideIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string
};

export default withTheme(HideIcon);
