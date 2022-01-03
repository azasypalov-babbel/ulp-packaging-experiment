import styled from 'styled-components';

const StyledTrainerLayout = styled.div`
  margin: 1rem auto 1rem; /* Fallback for browsers that don't support clamp */
  margin: clamp(1rem, 6vw, 4rem) auto 1rem;
`;

export default StyledTrainerLayout;
