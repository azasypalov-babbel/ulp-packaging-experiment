import React from 'react';

const designSystemMock = jest.createMockFromModule('@lessonnine/design-system.lib');
const designSystem = jest.requireActual('@lessonnine/design-system.lib');

Object.keys(designSystem).forEach((key) => {
  // eslint-disable-next-line react/prop-types
  const Component = ({ children }) => React.createElement(React.Fragment, null, children);
  Component.displayName = key;
  designSystemMock[key] = Component;
});

module.exports = designSystemMock;
