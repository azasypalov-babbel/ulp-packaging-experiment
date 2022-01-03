import styled, { css } from 'styled-components';
import Card from '../../../shared/Card';

export const StyledFlashCard = styled(Card)`
  display: flex;
  flex-direction: row;
  position: relative;

  /* Add extra styles if an onClick is specified */
  ${(props) => Boolean(props.onClick) && css`
    cursor: pointer;
  `}
`;

export const StyledHintArea = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: ${(props) => props.theme.cascada.storm};
`;

export const StyledBackgroundImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 45%;

  min-height: 14.5rem; // This is for IE11

  background-image: url(${(props) => props.src});
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
`;

export const StyledContentArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 55%;

  padding: 1rem;
`;
