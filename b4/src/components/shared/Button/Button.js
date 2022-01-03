import styled from 'styled-components';
import PropTypes from 'prop-types';

import commonButtonStyles from './commonButtonStyles';
import defaultButtonStyles from './defaultButtonStyles';
import disabledButtonStyles from './disabledButtonStyles';
import primaryButtonStyles from './primaryButtonStyles';
import positiveButtonStyles from './positiveButtonStyles';
import negativeButtonStyles from './negativeButtonStyles';
import positiveSolidButtonStyles from './positiveSolidButtonStyles';
import negativeSolidButtonStyles from './negativeSolidButtonStyles';
import withKeypress from '../withKeypress';

const StyledButton = styled.button.attrs(
  ({ pressed }) => ({ className: pressed ? 'is-active' : '' })
)`
  ${commonButtonStyles};
  ${({ disabled, positive, negative, primary, positiveSolid, negativeSolid }) => {
    if (disabled) return disabledButtonStyles;
    if (primary) return primaryButtonStyles;
    if (negative) return negativeButtonStyles;
    if (positive) return positiveButtonStyles;
    if (positiveSolid) return positiveSolidButtonStyles;
    if (negativeSolid) return negativeSolidButtonStyles;
    return defaultButtonStyles;
  }};
`;


export const Button = StyledButton;

Button.propTypes = {
  primary: PropTypes.bool,
  disabled: PropTypes.bool,
  pressed: PropTypes.bool
};

Button.defaultProps = {
  type: 'button'
};

export default withKeypress(Button);
