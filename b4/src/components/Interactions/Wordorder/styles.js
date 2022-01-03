import styled from 'styled-components';

export const StyledWordorderWrapper = styled.div`
  position: relative;
  overflow: hidden;

  align-self: stretch;
  flex: 1 1 100%;

 /* Counteract padding of "Sheet" */
  margin: -0.5rem;
  @media (min-width: 620px) {
    margin: -1.5rem;
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

export const StyledWordorder = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: calc(3.25rem * 4.5);
  overflow-y: scroll;

  @media (min-width: 620px) {
    overflow-y: inherit;
    justify-content: center;
  }

  padding: 0.5rem;
  @media (min-width: 620px) {
    padding: 1.5rem;
  }

  margin: 0 -0.25rem -0.25rem 0;

  & button {
    margin: 0 0.25rem 0.25rem 0;
    min-width: 3rem;
  }

  @media (min-width: 620px) {
    margin: 0 -0.6rem -0.6rem 0;
    & button {
      margin: 0 0.6rem 0.6rem 0;
    }
  }
`;
