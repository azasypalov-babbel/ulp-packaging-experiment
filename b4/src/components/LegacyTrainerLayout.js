import styled from 'styled-components';

export const StyledLegacyTrainerLayout = styled.div`
  font-family: ${(props) => props.theme.cascada.fontMilliardBook};
  font-variant-ligatures: no-common-ligatures;
  letter-spacing: normal;
  text-align: center;

  font-size: 18px;

  display: flex;
  & > * {
    margin: 1rem auto 1rem; /* Fallback for browsers that don't support clamp */
    margin: clamp(1rem, 6vw, 4rem) auto 1rem;
  }
`;
