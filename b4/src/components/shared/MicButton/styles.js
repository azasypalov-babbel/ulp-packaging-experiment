import styled, { css, keyframes } from 'styled-components';

const backgroundPulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.5;
  }
`;

const backgroundColor = css`
  content: "";
  position: absolute;

  height: 7em;
  width: 7em;
  border-radius: 50%;
  background-color: ${(props) => props.theme.cascada.brandOrange};
  z-index: -1;

  transform-origin: center center;
  animation: ${backgroundPulse} 1.5s linear infinite alternate;
`;

const defaultStyles = css`
  background-color: ${(props) => props.theme.cascada.brandOrange};
  border: 4px solid ${(props) => props.theme.cascada.platinium};
  color: ${(props) => props.theme.cascada.white};

  ${({ onClick }) => onClick && css`
    cursor: pointer;

    &:hover {
      background-color: ${(props) => props.theme.cascada.canary};
      border: 6px solid rgba(206, 136, 0, 0.2);
    }

    &:active {
      background-color: ${(props) => props.theme.cascada.brandOrange};
      border: 6px solid rgba(57, 65, 73, 0.1);
    }
  `}
`;

const disabledStyles = css`
  background-color: ${(props) => props.theme.cascada.platinium};
  border: 4px solid ${(props) => props.theme.cascada.silver};
  color: ${(props) => props.theme.cascada.white};
`;

const listeningStyles = css`
  background-color: ${(props) => props.theme.cascada.brandOrange};
  border: 0;
  color: ${(props) => props.theme.cascada.white};
  height: 4.5em;
  width: 4.5em;
  position: relative;

  &:after {
    ${backgroundColor};
  }
`;

const userSpeakingStyles = css`
  background-color: ${(props) => props.theme.cascada.white};
  border: 4px solid ${(props) => props.theme.cascada.brandOrange};
  color: ${(props) => props.theme.cascada.brandOrange};
  position: relative;
  height: 4.5em;
  width: 4.5em;

  &:after {
    ${backgroundColor};
  }
`;

export const StyledWrapper = styled.div`
  height: 6em;
  width: 6em;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Should prevent text-selection & iOS long-press magnifier */
  user-select: none;

  font-size: 0.8rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  /* if given position fixed (eg. .fixed-for-small class), the following values are used */
  bottom: 0;
`;

export const StyledMicButton = styled.button`
  font-size: 100%;
  outline: none;
  border-radius: 50%;
  transition: border 100ms, background-color 100ms, color 100ms;
  height: 6em;
  width: 6em;
  padding: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ isListening, isUserSpeaking, disabled }) => {
    if (isListening) return listeningStyles;
    if (isUserSpeaking) return userSpeakingStyles;
    if (disabled) return disabledStyles;
    return defaultStyles;
  }};
`;
