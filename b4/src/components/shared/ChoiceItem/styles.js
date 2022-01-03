import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { transparentize } from 'polished';

const paddingX = '0.625rem';
const paddingY = '0.625rem';
const borderWidth = '1px';

const commonChoiceItemStyles = css`
  display: flex;
  align-content: start;

  box-sizing: border-box;
  min-height: 3rem;
  max-width: 24rem;

  width: 100%;
  text-align: left;
  padding: ${paddingY} ${paddingX};

  font-family: ${(props) => props.theme.cascada.fontMilliardBook};
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.025rem;

  border: ${borderWidth} solid ${(props) => props.theme.cascada.pastelStorm};
  border-radius: 0.25rem;


  transition:
    box-shadow 100ms,
    background-color 100ms;

  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  user-select: none;

  &:focus {
    outline: none;
  }
`;

const activeChoiceItemStyles = css`
  border: none;
  padding: calc(${borderWidth} + ${paddingY}) calc(${paddingX} + ${borderWidth});
  box-shadow:
    inset 0 2px 0 0 ${(props) => transparentize(0.5, props.theme.cascada.storm)},
    inset 0 0 2px 0 ${(props) => transparentize(0.8, props.theme.cascada.storm)};
  background-color: ${(props) => props.theme.cascada.survivalBlue};
  color: ${(props) => props.theme.cascada.white};
`;

const defaultChoiceItemStyles = css`
  background-color: ${(props) => props.theme.cascada.white};
  color: ${(props) => props.theme.cascada.spaceGray};

  @media (hover:hover) {
    &:hover {
      border: none;
      padding: calc(${borderWidth} + ${paddingY}) calc(${paddingX} + ${borderWidth});
      box-shadow:
      inset 0 -2px 0 0 ${(props) => transparentize(0.7, props.theme.cascada.storm)};
      background-color: ${(props) => props.theme.cascada.pastelElectric};
    }
  }

  &:active {
    ${activeChoiceItemStyles}
  }
`;

const correctChoiceItemStyles = css`
  color: ${(props) => props.theme.cascada.spaceGray};
  background-color: ${(props) => props.theme.cascada.pastelTeal};
  border: 1px solid ${(props) => props.theme.cascada.teal};
`;

const mistakeChoiceItemStyles = css`
  color: ${(props) => props.theme.cascada.spaceGray};
  background-color: ${(props) => props.theme.cascada.pastelRose};
  border: 1px solid ${(props) => props.theme.cascada.red};
`;

const disabledChoiceItemStyles = css`
  background-color: ${(props) => props.theme.cascada.white};
  color: ${(props) => props.theme.cascada.spaceGray};
`;

export const StyledChoiceItem = styled.button.attrs(
  ({ pressed }) => ({ className: pressed ? 'is-active' : '' })
)`
  ${commonChoiceItemStyles};
  ${({ disabled, mistakeFeedback, correctFeedback, pressed }) => {
    if (mistakeFeedback) return mistakeChoiceItemStyles;
    if (correctFeedback) return correctChoiceItemStyles;
    if (disabled) return disabledChoiceItemStyles;
    if (pressed) return activeChoiceItemStyles;
    return defaultChoiceItemStyles;
  }};
`;

export const StyledWideChoiceItem = styled(StyledChoiceItem)`
  max-width: revert;
`;

StyledChoiceItem.propTypes = {
  correctFeedback: PropTypes.bool,
  mistakeFeedback: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.any,
  innerRef: PropTypes.any
};

export const StyledTextWrapper = styled.div`
  margin: 0 0.5rem;
`;
