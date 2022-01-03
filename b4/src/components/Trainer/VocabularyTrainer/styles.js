import { rem } from 'polished';
import styled from 'styled-components';
import * as features from '../../../lib/features';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0 1rem;
  margin: 0 auto;

  max-width: ${rem(640)};
  width: 100%;

  box-sizing: border-box;

  ${() => {
    if (features.isWebview()) {
      return 'user-select: none;';
    }
  }};
`;

export const StyledTextWrapper = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const StyledImage = styled.img`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  width: 140px;
  height: 140px;

  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;
