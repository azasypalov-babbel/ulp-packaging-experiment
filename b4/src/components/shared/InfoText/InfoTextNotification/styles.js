import styled, { keyframes } from 'styled-components';
import Text from '../../Text';
import { isWebview } from '../../../../lib/features';

const enterKeyframes = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const InfoTextTopValue = isWebview() ? 'calc(56px + env(safe-area-inset-top))' : '0';

export const StyledStickyWrapper = styled.div`
  position: absolute;
  pointer-events: none;
  touch-action: none;

  @supports (position: sticky) {
    & {
      position: sticky;
    }
  }

  top: ${InfoTextTopValue};
  left: 0;
  width: 100%;
  flex: 0 0 auto;

  animation: ${enterKeyframes} 0.2s;

  box-sizing: border-box;
  z-index: 99;
`;

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 1rem 1rem 0 1rem;
`;

export const StyledInfoTextWrapper = styled.div`
  width: 100%;
  max-width: 50rem;
  margin: 0 auto;

  pointer-events: auto;

  @media (min-width: 1440px) {
    max-width: 60rem; /* Same as Feedback Sheet*/
  }
`;

export const StyledLink = styled(Text)`
  cursor: pointer;
  display: inline-flex;
  margin-top: 1rem;
  text-decoration: none;
`;

StyledLink.defaultProps = {
  as: 'a'
};

