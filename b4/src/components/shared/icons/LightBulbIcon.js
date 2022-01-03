import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const LightBulbIcon = ({ theme, size, fillColor }) => (
  <Icon size={size} viewBox="0 0 24 24">
    <path
      fill={fillColor || theme.cascada.storm}
      fillRule="evenodd"
      d={`M13.924 15.685A5.99 5.99 0 0112 16a5.99 5.99 0 01-4-1.528
        6 6 0 116 1.186 4.81 4.81 0 01-.076.027zM16 16.93a8 8 0 10-8
        0V19a3 3 0 003 3h2a3 3 0 003-3v-2.07zm-6 .818c.64.165 1.31.252
        2 .252s1.36-.087 2-.252V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1.252z`}
    />
  </Icon>
);

LightBulbIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string,
  fillColor: PropTypes.string
};

export default withTheme(LightBulbIcon);
