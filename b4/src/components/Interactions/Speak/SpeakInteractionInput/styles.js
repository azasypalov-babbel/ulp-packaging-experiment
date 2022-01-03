import styled from 'styled-components';
import { rem } from 'polished';

import Sheet from '../../../shared/Sheet';

export const StyledSheet = styled(Sheet)`
  & > div {
    padding: 1rem;
  }
`;

export const StyledInnerWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledBottomWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const StyledSpeakItemWrapper = styled.div`
  width: 100%;
  margin-bottom: ${rem('32px')};
`;
