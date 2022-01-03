import styled from 'styled-components';

export const StyleInner = styled.div`
  width: 100%;
`;

export const StyledTop = styled.div`
  margin-bottom: 1rem;
`;

export const StyledBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;

  @media (min-width: 620px) {
    flex-direction: row;
  }
`;
