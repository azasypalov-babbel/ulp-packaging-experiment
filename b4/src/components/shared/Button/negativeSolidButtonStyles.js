import { css } from 'styled-components';
import { commonShadowStyles } from './commonButtonStyles';
import { lighten } from 'polished';

const primaryButtonStyles = css`
  background-color: ${(props) => props.theme.cascada.red};
  color: ${(props) => props.theme.cascada.white};

  border: none;

  &:hover, &:focus {
    background-color: ${(props) => lighten(0.05, props.theme.cascada.red)};
  }

  &:active, &.is-active {
    background-color: ${(props) => props.theme.cascada.red};
  }

  ${(props) => commonShadowStyles(props.theme.cascada.red)};
`;

export default primaryButtonStyles;
