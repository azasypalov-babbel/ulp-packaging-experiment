import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const DisplayInline = styled.span`
  & > * {
    display: inline-block;
    vertical-align: middle;
  }
`;

export const ReplaceInline = ({ symbol, replacement, children }) => (
  <DisplayInline>
    {children.split(symbol).map((fragment, index) =>
      <React.Fragment key={index}>{index !== 0 && replacement}{fragment}</React.Fragment>
    )}
  </DisplayInline>
);


ReplaceInline.propTypes = {
  symbol: PropTypes.string.isRequired,
  replacement: PropTypes.node.isRequired,
  children: PropTypes.string.isRequired
};
