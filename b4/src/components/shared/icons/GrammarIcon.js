import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Icon from './Icon';

const GrammarIcon = ({ theme, size }) => (
  <Icon size={size} viewBox="0 0 80 80">
    <rect
      x="40"
      y="41"
      width="34"
      height="20"
      rx="2"
      fill={theme.cascada.canary}
      stroke={theme.cascada.spaceGray}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="6"
      y="41"
      width="34"
      height="14"
      rx="2"
      fill="#ED427D"
      stroke={theme.cascada.spaceGray}
      strokeWidth="2"
    />
    <path
      d="M20 23a2 2 0 0 1 2-2h34a2 2 0 0 1 2 2v16a2
        2 0 0 1-2 2H22a2 2 0 0 1-2-2V23z"
      fill={theme.cascada.pastelGrape}
      stroke={theme.cascada.spaceGray}
      strokeWidth="2"
    />
    <path
      d="M10 39a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h-6v-2z"
      fill="#ED427D"
      stroke={theme.cascada.spaceGray}
      strokeWidth="2"
    />
    <path
      d="M64 39a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h-6v-2z"
      fill={theme.cascada.canary}
      stroke={theme.cascada.spaceGray}
      strokeWidth="2"
    />
    <path
      d="M24 19a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h-6v-2zM36
      19a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h-6v-2zM48 19a2
      2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h-6v-2z"
      fill={theme.cascada.pastelGrape}
      stroke={theme.cascada.spaceGray}
      strokeWidth="2"/>
  </Icon>
);

GrammarIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  size: PropTypes.string
};

export default withTheme(GrammarIcon);
