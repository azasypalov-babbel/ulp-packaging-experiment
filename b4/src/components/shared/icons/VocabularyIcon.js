import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const VocabularyIcon = ({ theme, size }) => (
  <Icon size={size} viewBox="0 0 80 80">
    <rect
      x="33.257"
      y="22.377"
      width="28.8"
      height="38.4"
      rx="1.6"
      transform="rotate(2 33.257 22.377)"
      fill={theme.cascada.canary}
      stroke={theme.cascada.spaceGray}
      strokeWidth="1.6"
    />
    <path
      d="M56.433 36.3l-13.288-.465-.096 2.759 7.987.279-8.689 13.625-.004.12
        13.36.466.097-2.782-8.131-.284 8.76-13.599.004-.12z"
      fill={theme.cascada.spaceGray}
    />
    <rect
      x="13.355"
      y="27.753"
      width="28.8"
      height="38.4"
      rx="1.6"
      transform="rotate(-16 13.355 27.753)"
      fill={theme.cascada.pastelElectric}
      stroke={theme.cascada.spaceGray}
      strokeWidth="1.6"
    />
    <path
      fill={theme.cascada.spaceGray}
      d="M39.4 50.19L37.5 47.537l-5.758 1.651-.205 3.255-2.714.778 1.26-14.343 3.36-.963
        8.65 11.5-2.694.773zm-7.53-3.134l4.393-1.26-3.964-5.535-.43
        6.794zM21.942 33.436l1.089-.312-2.84-3.846-1.33.381-.364 4.765 1.082-.31.04-.997
        1.76-.505.563.824zm-2.286-1.169l.088-2.036 1.154 1.68-1.242.356z"
    />
  </Icon>
);

VocabularyIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string
};

export default withTheme(VocabularyIcon);
