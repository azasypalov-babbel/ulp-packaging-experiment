import { css } from 'styled-components';
import { buttonBorderWidth } from './commonButtonStyles';

const disabledButtonStyles = css`
  background-color: ${(props) => props.theme.cascada.platinium};
  color: ${(props) => props.theme.cascada.platiniumStorm};

  border: ${buttonBorderWidth} solid ${(props) => props.theme.cascada.pastelStorm};

`;

export default disabledButtonStyles;
