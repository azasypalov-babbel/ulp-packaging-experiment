import { css } from 'styled-components';
import { setSaturation, setLightness, transparentize } from 'polished';
import { compose } from '../../../lib/compose';

const buttonPaddingX = '1rem';
export const buttonBorderWidth = '1px';

export const sizeStyles = css`
  height: 3rem;
  min-width: ${({ small, auto }) => {
    if (small) return '4.6rem';
    if (auto) return 'auto';
    return '7.5rem';
  }};
`;

export const paddingWithBorderStyles = (
  borderWidth = buttonBorderWidth,
  paddingX = buttonPaddingX
) => css`
  padding: 0 ${paddingX};

  &:hover, &:focus {
    padding: 0 calc(${borderWidth} + ${paddingX});
  }

  &:disabled:hover {
    padding: 0 ${paddingX};
  }

  &:active, &.is-active {
    padding: 0 calc(${borderWidth} + ${paddingX});
  }
`;

const transformShadowColor = (transparency) => compose(
  setSaturation(1),
  setLightness(0.2),
  transparentize(transparency)
);

export const commonShadowStyles = (shadowColor) => css`
  &:hover {
    box-shadow:
      inset 0 -2px 0 0 ${transformShadowColor(0.7)(shadowColor)};
  }

  &:active, &.is-active {
    box-shadow:
      inset 0 2px 0 0 ${transformShadowColor(0.5)(shadowColor)},
      inset 0 0 2px 0 ${transformShadowColor(0.8)(shadowColor)};
  }
`;

const commonButtonStyles = css`
  display: inline-block;
  box-sizing: border-box;
  
  ${sizeStyles}

  justify-content: center;
  align-items: center;

  font-family: ${(props) => props.theme.cascada.fontMilliardSemi};
  font-size: 1rem;
  line-height: 1;
  letter-spacing: 0.025rem;

  border-radius: 0.25rem;

  transition:
    box-shadow 100ms,
    background-color 100ms;

  white-space: nowrap;
  cursor: pointer;
  user-select: none;

  /* disabling double-tap to zoom */
  touch-action: manipulation;

  ${paddingWithBorderStyles()};

  &:focus {
    outline: none;
  }
`;

export default commonButtonStyles;
