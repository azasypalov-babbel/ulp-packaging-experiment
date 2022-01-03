import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { responsiveStyles } from '../../../lib/styledComponentsUtils';

const ICON_SIZES = {
  jumbo: '2rem',
  large: '2rem',
  regular: '1.5rem',
  small: '1.5rem'
};

const Icon = styled.svg`
  ${responsiveStyles('size', ({ size: responsiveSize }) => `
    height: ${ICON_SIZES[responsiveSize]};
    width: ${ICON_SIZES[responsiveSize]};
  `)}
`;

Icon.propTypes = {
  size: PropTypes.string
};

Icon.defaultProps = {
  size: 'regular'
};

const VolumeIcon = ({ theme, size, color = theme.cascada.storm }) => (
  <Icon viewBox="0 0 32 32" size={size}>
    <path
      d={`M4 10.6667V9.33334C3.26362 9.33334 2.66667 9.9303 2.66667 10.6667H4ZM8
      10.6667V12C8.26323 12 8.52058 11.9221 8.7396 11.7761L8 10.6667ZM4
      21.3333H2.66667V22.6667H4V21.3333ZM8 21.3333L8.7396 20.2239C8.52058
      20.0779 8.26323 20 8 20V21.3333ZM14.4453 25.6302L13.7057 26.7396L14.4453 25.6302ZM4
      12H8V9.33334H4V12ZM5.33333 21.3333V10.6667H2.66667V21.3333H5.33333ZM8.7396
      11.7761L15.1849 7.47921L13.7057 5.26041L7.2604 9.55728L8.7396 11.7761ZM14.6667
      7.20186V24.7982H17.3333V7.20186H14.6667ZM15.1849 24.5208L8.7396 20.2239L7.2604
      22.4427L13.7057 26.7396L15.1849 24.5208ZM8 20H4V22.6667H8V20ZM15.1849
      7.47921C14.9634 7.62689 14.6667 7.46809 14.6667 7.20186H17.3333C17.3333
      5.33824 15.2563 4.22666 13.7057 5.26041L15.1849 7.47921ZM14.6667 24.7982C14.6667
      24.5319 14.9634 24.3731 15.1849 24.5208L13.7057 26.7396C15.2563 27.7734 17.3333
      26.6618 17.3333 24.7982H14.6667Z`}
      fill={color}
    />
    <path
      d={`M21.3333 22.6667C25.0152 22.6667 27.9999 19.6819 27.9999
      16C27.9999 12.3181 25.0152 9.33334 21.3333 9.33334`}
      stroke={color}
      fill="none"
      strokeWidth="2.667"
      strokeLinejoin="round"
    />
    <path
      d={`M20 18.6667C21.4728 18.6667 22.6667 17.4728 22.6667
      16C22.6667 14.5273 21.4728 13.3333 20 13.3333`}
      stroke={color}
      fill="none"
      strokeWidth="2.667"
      strokeLinejoin="round"
    />
  </Icon>
);

VolumeIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  color: PropTypes.string,
  size: PropTypes.string
};

export default withTheme(VolumeIcon);
