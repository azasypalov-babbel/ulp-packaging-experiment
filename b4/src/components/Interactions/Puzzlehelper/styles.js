import styled from 'styled-components';

export const StyledPuzzlehelper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: calc(3.25rem * 3.5);
  padding-top: 0.5rem;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    overflow-y: inherit;
  }

  & button {
    margin-right: 0.6rem;
    margin-bottom: 0.6rem;
    min-width: 3rem;
  }
`;

export const StyledPuzzlehelperWrapper = styled.div`
  position: relative;
  overflow: auto;

  align-self: stretch;
  flex: 1 1 100%;

 /* Counteract padding of "Sheet" */
  margin: -0.5rem 0;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    overflow: hidden;
  }
  
  &::after, &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 0.75rem;
    pointer-events: none;
  }

  &::after {
    bottom: 0;
    background: linear-gradient(rgba(255, 255, 255, 0), white);
  }

  &::before {
    top: 0;
    background: linear-gradient(white, rgba(255, 255, 255, 0));
  }
`;

