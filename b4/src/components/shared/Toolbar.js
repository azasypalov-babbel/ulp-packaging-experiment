import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledToolbar = styled.div`
  display: inline-flex;
  padding: 1.5rem;
  text-align: left;

  & * {
    pointer-events: auto;
    position: relative;
  }
`;

const StyledToolbarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  pointer-events: none;
  z-index: 1;
`;

const Toolbar = ({ children }) => (
  <StyledToolbarWrapper>
    <StyledToolbar>
      {children}
    </StyledToolbar>
  </StyledToolbarWrapper>
);

Toolbar.propTypes = {
  children: PropTypes.node.isRequired
};

export default Toolbar;
