import { css } from 'styled-components';
import { buttonBorderWidth, commonShadowStyles } from './commonButtonStyles';

const positiveButtonStyles = css`
  background-color: ${(props) => props.theme.color.semantic.feedback.positive.background};
  color: ${(props) => props.theme.color.semantic.feedback.positive.foreground};

  border: ${buttonBorderWidth} solid ${(props) => props.theme.color.semantic.feedback.positive.border};

  & svg {
    color: ${(props) => props.theme.color.semantic.feedback.positive.foreground};
  }

  &:hover, &:focus {
    border: none;
  }

  &:active, &.is-active {
    border: none;
    background-color: ${(props) => props.theme.color.semantic.feedback.positive.border};
    color: ${(props) => props.theme.cascada.white};

    & svg {
      color: ${(props) => props.theme.cascada.white};
    }
  }

  ${(props) => commonShadowStyles(props.theme.color.semantic.feedback.positive.background)}
`;

export default positiveButtonStyles;

