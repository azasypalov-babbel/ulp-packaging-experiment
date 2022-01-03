import { css } from 'styled-components';
import { commonShadowStyles } from './commonButtonStyles';
import { lighten } from 'polished';

const primaryButtonStyles = css`
  background-color: ${(props) => props.theme.cascada.teal};
  color: ${(props) => props.theme.cascada.white};

  border: none;

  &:hover, &:focus {
    background-color: ${(props) => lighten(0.1, props.theme.cascada.teal)};
  }

  &:active, &.is-active {
    background-color: ${(props) => props.theme.cascada.teal};
  }

  ${(props) => commonShadowStyles(props.theme.cascada.teal)};
`;

export default primaryButtonStyles;
