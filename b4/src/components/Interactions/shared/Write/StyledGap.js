import styled, { css } from 'styled-components';

const inactiveStyles = css`
  background-color: transparent;
  border-bottom: 2px solid ${(props) => props.theme.cascada.spaceGrayW15};

  [role=textbox] {
    display: inline-block;
  }
`;

const activeStyles = css`
  background-color: transparent;
  border-bottom: 2px solid ${(props) => props.theme.cascada.brandOrange};

  [role=textbox] {
    display: inline-block;
    background: transparent;

    outline: none;
    border: none;
    margin: 0;
    padding: 0;

    cursor: text;
    font-family: ${(props) => props.theme.cascada.fontMilliardBook};
    font-size: inherit;
    line-height: 1;

    transition: width min-width linear 0.161s;
  }

  @media (max-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    input[role=textbox] {
      vertical-align: bottom;
    }
  }

`;

const mistakenStyles = css`
  background-color: ${(props) => props.theme.color.semantic.feedback.negative.background};
  border-bottom: 2px solid ${(props) => props.theme.color.semantic.feedback.negative.border};
`;

const activeSolvedTypoStyles = css`
  background-color: ${(props) => props.theme.color.pastel.canary};
  border-bottom: 2px solid ${(props) => props.theme.color.canary};
`;

const activeSolvedStyles = css`
  background-color: ${(props) => props.theme.color.semantic.feedback.positive.background};
  border-bottom: 2px solid ${(props) => props.theme.color.semantic.feedback.positive.border};

  transition: background-color 250ms ease-in, border-bottom 250ms ease-in;
`;

const StyledGap = styled.span`
  font-family: ${(props) => props.theme.cascada.fontMilliardBook};

  position: relative;
  display: inline-block;
  vertical-align: baseline;
  letter-spacing: normal;
  white-space: pre;

  [role=textbox] {
    outline: 0;
    color: inherit;
  }

  [role=textbox].no-select {
    user-select: none;
    -webkit-touch-callout: none;
  }

  [role=textbox]:disabled {
    opacity: 1;
    -webkit-text-fill-color: inherit;
  }

  &:focus {
    outline: 0;
  }

  ${({ active }) => active ? activeStyles : inactiveStyles};

  ${({ solved, typo, active }) => {
    if (solved) {
      if (active && !typo) {
        return activeSolvedStyles;
      } else if (active && typo) {
        return activeSolvedTypoStyles;
      }
    }
  }};

  ${({ mistaken }) => mistaken ? mistakenStyles : null};

  & form {
    margin: 0;
  }
`;

export default StyledGap;
