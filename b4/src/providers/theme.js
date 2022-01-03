import React, { useContext } from 'react';
import { ThemeProvider as StyledThemeProvider, ThemeContext } from 'styled-components';
import { getDisplayName } from '../components/getDisplayName';

import tokens from '@lessonnine/design-tokens.lib/dist/json/variables';

export const useTheme = () => useContext(ThemeContext);

const size = {
  font: {
    xsmall: '0.75rem',
    small: '0.875rem',
    base: '1rem',
    medium: '1.125rem',
    big: '1.5rem',
    large: '2rem',
    xlarge: '2.5rem',
    grand: '3rem'
  },
  navbar: {
    xsmall: {
      height: '60px' // Approximate height of navigation bar in `xsmall` environments
    }
  }
};

export const theme = {
  cascada: tokens.legacy.cascada,
  color: tokens.color,
  viewports: tokens.viewports,
  size
};

const withThemeProvider = (WrappedComponent) => {
  const ThemeProvider = (props) => (
    <StyledThemeProvider theme={theme}>
      <WrappedComponent {...props} />
    </StyledThemeProvider>
  );

  ThemeProvider.displayName = `ThemeProvider(${getDisplayName(WrappedComponent)})`;

  return ThemeProvider;
};

export default withThemeProvider;
