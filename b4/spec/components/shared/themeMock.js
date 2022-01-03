import React from 'react';
import { ThemeProvider } from 'styled-components';
import { mount } from 'enzyme';

import tokens from '@lessonnine/design-tokens.lib/dist/json/variables';
import toJson from 'enzyme-to-json';

/*
  mockAllObjectKeys will return a proxy that always returns (value) for any key.
*/

const mockAllObjectKeys = (value) => new Proxy({}, { get: (input) => value || input });

export const themeMock = {
  cascada: tokens.legacy.cascada,
  color: tokens.color,
  viewports: tokens.viewports,
  size: {
    font: mockAllObjectKeys(),
    navbar: mockAllObjectKeys()
  }
};

export const mountWithTheme = (tree, theme = themeMock) => {
  return mount(tree, {
    // eslint-disable-next-line react/display-name, react/prop-types
    wrappingComponent: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
  });
};

export const omitThemeFromSnapshot = (wrapper) => toJson(wrapper, {
  map: (info) => {
    if (!info.props) return info;
    if (info.props.theme) {
      info.props.theme = '[mocked theme]';
    }
    return info;
  }
});
