import { css } from 'styled-components';
import { commonShadowStyles } from './commonButtonStyles';

const shadowColor = '#9a4400';

const primaryButtonStyles = css`
  background-color: ${(props) => props.theme.cascada.brandOrange};
  color: ${(props) => props.theme.cascada.white};

  border: none;

  &:hover, &:focus {
    background-color: ${(props) => props.theme.cascada.canary};
  }

  &:active, &.is-active {
    background-color: ${(props) => props.theme.cascada.brandOrange};
  }

  ${commonShadowStyles(shadowColor)};
`;

export default primaryButtonStyles;
