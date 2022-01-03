import styled from 'styled-components';
import { rem } from 'polished';

export const StyledContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: ${(props) => props.theme.cascada.white};
  padding-top: ${rem(60)};
  z-index: 150;
`;
