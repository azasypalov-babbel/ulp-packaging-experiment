import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledSheet = styled.div` 
  background-color: ${(props) => props.theme.cascada.white};
  box-shadow: 0 0 0.625rem ${(props) => props.theme.cascada.silver};

  order: 100;
  touch-action: none; /* prevent page scroll on the sheet */

  & > div {
    display: flex;
    flex-direction: column;
    max-width: 60rem;
    margin: 0 auto;
    align-items: center;

    padding: 1rem;
    padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);

    @media (min-width: 620px) {
      padding: 1.5rem;
      padding-bottom: calc(env(safe-area-inset-bottom) + 1.5rem);
      flex-direction: row;
    }
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1rem;

  flex: 1;
  flex-wrap: wrap;

  @media (min-width: 620px) {
    margin-top: 0;
  }

  & > button {
    width: auto;

    flex: 1;

    @media (max-width: 620px) {
      width: 100%;
    }

    @media (max-width: 320px) {
      flex: none;
    }
  }

  & > button:nth-child(even){
    margin-left: 0.5rem;

    @media (max-width: 320px) {
      margin-left: 0;
      margin-top: 0.5rem;
    }
  }
`;

export const FillAvailableSpace = styled.div`
  display: flex;
  flex: 1 1 100%;
  justify-content: space-between;
  width: 100%;

  @media (min-width: 620px) {
    width: auto;
    margin-right: 1rem;
  }
`;

export const PreserveSize = styled.div`
  display: flex;
  flex: 1 1 100%;
  width: 100%;
  justify-content: flex-end;

  @media (min-width: 620px) {
    flex: 0 0 auto;
    width: auto;
  }
`;

export const Sheet = ({ children, ...props }) => (
  <StyledSheet {...props}>
    <div>{children}</div>
  </StyledSheet>
);

Sheet.propTypes = {
  children: PropTypes.node
};

export default Sheet;
