import { css } from 'styled-components';
import { buttonBorderWidth, commonShadowStyles } from './commonButtonStyles';

const negativeButtonStyles = css`
  background-color: ${(props) => props.theme.color.semantic.feedback.negative.background};
  color: ${(props) => props.theme.color.semantic.feedback.negative.foreground};

  border: ${buttonBorderWidth} solid ${(props) => props.theme.color.semantic.feedback.negative.border};

  & svg {
    color: ${(props) => props.theme.color.semantic.feedback.negative.foreground};
  }

  &:hover, &:focus {
    border: none;
  }

  &:active, &.is-active {
    border: none;
    background-color: ${(props) => props.theme.color.semantic.feedback.negative.border};
    color: ${(props) => props.theme.cascada.white};

    & svg {
      color: ${(props) => props.theme.cascada.white};
    }
  }

  ${(props) => commonShadowStyles(props.theme.color.semantic.feedback.negative.background)}
`;

export default negativeButtonStyles;

