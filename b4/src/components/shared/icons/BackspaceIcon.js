import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const BackspaceIcon = ({ theme, size, fillColor }) => (
  <Icon size={size} viewBox="0 0 24 24">
    <path
      fill={fillColor || theme.cascada.storm}
      fillRule="evenodd"
      d="M7.828 5a3 3 0 00-2.12.879L.292 11.293a1 1
      0 000 1.414L6.586 19H19a3 3 0 003-3V8a3 3 0
      00-3-3H7.828zm-.707 2.293A1 1 0 017.828 7H19a1 1 0
      011 1v8a1 1 0 01-1 1H7.414l-5-5 4.707-4.707zm8.172
      1L13 10.586l-2.293-2.293-1.414 1.414L11.586 12l-2.293 2.293
      1.414 1.414L13 13.414l2.293 2.293 1.414-1.414L14.414
      12l2.293-2.293-1.414-1.414z"
      clipRule="evenodd"
    />
  </Icon>
);

BackspaceIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string,
  fillColor: PropTypes.string
};

export default withTheme(BackspaceIcon);
