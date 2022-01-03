import styled from 'styled-components';
import Card from '../../shared/Card';

export const Layout = styled.div`
  box-sizing: border-box;
  width: calc(100vw - 2em);
  margin-bottom: 5rem;
`;

export const InteractiveCard = styled(Card)`
  flex-basis: 9rem;
  margin: 1rem;
`;

export const CardContent = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;

  & > *:last-child {
    width: 100%;
    margin-top: 1rem;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const CardGroup = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
