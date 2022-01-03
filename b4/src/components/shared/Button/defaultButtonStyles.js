import { css } from 'styled-components';
import { buttonBorderWidth, commonShadowStyles } from './commonButtonStyles';

const defaultButtonStyles = css`
  background-color: ${(props) => props.theme.cascada.white};
  color: ${(props) => props.theme.cascada.storm};

  border: ${buttonBorderWidth} solid ${(props) => props.theme.cascada.pastelStorm};

  &:hover, &:focus {
    border: none;
    background-color: ${(props) => props.theme.cascada.pastelElectric};
  }

  &:active, &.is-active {
    border: none;
    background-color: ${(props) => props.theme.cascada.survivalBlue};
    color: ${(props) => props.theme.cascada.white};
  }

  ${(props) => commonShadowStyles(props.theme.cascada.storm)}
`;

export default defaultButtonStyles;

