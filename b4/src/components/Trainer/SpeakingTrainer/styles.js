import styled from 'styled-components';
import { rem } from 'polished';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: ${rem(732)};
  margin: ${rem(40)} auto;

  box-sizing: border-box;
`;

