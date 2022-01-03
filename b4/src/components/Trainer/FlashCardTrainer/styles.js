import styled from 'styled-components';

import * as features from '../../../lib/features';

export const StyledFlashCardContainer = styled.div`
  max-width: 32.75rem;
  margin: 0 auto 3rem;
  position: relative;

  ${() => {
    if (features.isWebview()) {
      return 'user-select: none;';
    }
  }}
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  min-height: 50px;

  & > * {
    &:not(:last-of-type) {
      margin-right: 1.5rem;
    }
  }
`;

export const StyledTextWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 1 1 50%;
  flex-direction: column;
  justify-content: center;
`;
