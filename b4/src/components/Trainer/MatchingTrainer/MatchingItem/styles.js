/* eslint-disable key-spacing */
/* eslint-disable indent */
import styled, { css, keyframes } from 'styled-components';
import { rem, stripUnit } from 'polished';
import zigZagImage from './zig-zag-image.svg';
import zigZagMask from './zig-zag-mask.svg';
import Text from '../../../shared/Text';
import { APPEARANCE_TYPE, horizontalTravel, itemPairMargin } from './constants';
import { ITEM_FRAGMENT_TYPE, trainerMaxWidth } from '../constants';

// Base Styles
const borderRadius = rem('8px');
const borderWidth = '1px';
const zigZagWidth = '5px';
const paddingX = rem('16px');
const paddingY = rem('8px');
const minHeightLargeScreen = rem('56px');
const minHeightMediumScreen = rem('61px');
const minHeightSmallScreen = rem('53px');
const toggleSize = rem('40px');

// Offset zig-zags one full cycle to get them to mesh together
const offsetZigZag = stripUnit(zigZagWidth) * 2;

// For -webkit-mask-box-image-outset & mask-border-outset the zig-zag is
// outset on all edges so one additional zig-zag width is added to the offset
const offsetMaskZigZag = `${offsetZigZag + stripUnit(zigZagWidth)}px`;

const LAYOUT = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL'
};

const EDGE = {
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT'
};

const { BASE, OPTION } = ITEM_FRAGMENT_TYPE;
const { DEFAULT, ACTIVE, SUCCESS, ERROR } = APPEARANCE_TYPE;

const config = {
  zigZagEdge: {
    // Layout used on small screens, where items are matched vertically
    [LAYOUT.VERTICAL]: {
      [BASE]: EDGE.BOTTOM,
      [OPTION]: EDGE.TOP
    },
    // Layout used on larger screens, where items are matched horizontally
    [LAYOUT.HORIZONTAL]: {
      [BASE]: EDGE.RIGHT,
      [OPTION]: EDGE.LEFT
    }
  },
  appearance: {
    [DEFAULT]: {
      border: (props) => props.theme.color.silver,
      background: (props) => props.theme.color.silver,
      hover: {
        border: (props) => props.theme.color.pastel.electric,
        background: (props) => props.theme.color.pastel.electric
      },
      active: {
        border: (props) => props.theme.color.pastel.storm,
        background: (props) => props.theme.color.pastel.storm
      }
    },
    [ACTIVE]: {
      border: (props) => props.theme.color.pastel.electric,
      background: (props) => props.theme.color.pastel.electric
    },
    [SUCCESS]: {
      border: (props) => props.theme.color.semantic.feedback.positive.border,
      background: (props) => props.theme.color.pastel.teal
    },
    [ERROR]: {
      border: (props) => props.theme.color.semantic.feedback.negative.border,
      background: (props) => props.theme.color.semantic.feedback.negative.background
    }
  }
};

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`

const applyZigZagEdgeMap = (map, orientation) => ({ position }) => {
  const zigZagEdge = config.zigZagEdge[orientation][position];
  return map[zigZagEdge];
};

// Takes a map of { [zig-zag-edge]: Styles } and applies the styles
// when the corresponding zig-zag edge is expected.
const deriveStyleFromZigZagEdge = (map) => css`
  @media (max-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    ${applyZigZagEdgeMap(map, LAYOUT.VERTICAL)};
  }
  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    ${applyZigZagEdgeMap(map, LAYOUT.HORIZONTAL)};
  }
`;


// zig-zags are created by casting drop-shadow out beyond the zig-zag edge and then
// clipping it off using a mask-border (Chrome, Safari) or placing a border-image on top (Firefox).
const zigZagBorderStyles = css`
  ${({ isMatched }) => {
    if (isMatched) return css`
      transition: box-shadow 0.35s 0.1s;
      box-shadow: 0 0 0 currentColor !important;
    `;
  }}

  ${deriveStyleFromZigZagEdge({
    [EDGE.TOP]: { boxShadow: `0 -${zigZagWidth} 0 currentColor` },
    [EDGE.RIGHT]: { boxShadow: `${zigZagWidth} 0 0 currentColor` },
    [EDGE.BOTTOM]: { boxShadow: `0 ${zigZagWidth} 0 currentColor` },
    [EDGE.LEFT]: { boxShadow: `-${zigZagWidth} 0 0 currentColor` }
  })}

  @supports (-webkit-mask-box-image: none) {
    -webkit-mask-box-image: url(${zigZagMask}) 5 repeat;
    -webkit-mask-box-image-width: ${zigZagWidth};

    ${deriveStyleFromZigZagEdge({
      [EDGE.TOP]: { '-webkit-mask-box-image-outset': `${zigZagWidth}` },
      [EDGE.RIGHT]: { '-webkit-mask-box-image-outset': `${zigZagWidth}` },
      // Slight additional outset for bottom / left so that the zig-zags mesh together with top / right
      [EDGE.BOTTOM]: {
        '-webkit-mask-box-image-outset': ((a, b) => `${a} ${a} ${a} ${b}`)(zigZagWidth, offsetMaskZigZag)
      },
      [EDGE.LEFT]: {
        '-webkit-mask-box-image-outset': ((a, b) => `${b} ${a} ${a} ${a}`)(zigZagWidth, offsetMaskZigZag)
      }
    })}
  }

  /*
  Firefox does not support mask-border, so we use border-image here.
  One side-effect of this method is that the outer edge background of the zig-zag is not
  transparent, and needs to be set manually to match the background color within zig-zag-image.svg
  */
  @supports not (-webkit-mask-box-image: none) {
    &:after {
      content: "";
      inset: 0;
      position: absolute;
      border-image: url(${zigZagImage}) 5 repeat;
      border-image-outset: 0;
      border-style: solid;

      /*
      This border-image based zig-zag will not mesh together well
      due to the white backgound color. So hide the zig-zag when matched.
      */
      transition: opacity 0.25s;
      opacity: ${({ isMatched }) => isMatched ? 0 : 1};

      ${deriveStyleFromZigZagEdge({
        [EDGE.TOP]: {
          borderWidth: `${zigZagWidth} 0 0 0`,
          top: `-${zigZagWidth}`
        },
        [EDGE.RIGHT]: {
          borderWidth: `0 ${zigZagWidth} 0 0`,
          right: `-${zigZagWidth}`
        },
        // Slight additional outset for bottom / left so that the zig-zags mesh together with top / right
        [EDGE.BOTTOM]: {
          borderWidth: `0 0 ${zigZagWidth} 0`,
          borderImageOutset: `0 0 0 ${offsetZigZag}px`,
          bottom: `-${zigZagWidth}`
        },
        [EDGE.LEFT]: {
          borderWidth: `0 0 0 ${zigZagWidth}`,
          borderImageOutset: `${offsetZigZag}px 0 0 0`,
          left: `-${zigZagWidth}`
        }
      })}
    }
  }
`;

const borderStyles = css`
  border: ${borderWidth} solid;
  ${deriveStyleFromZigZagEdge({
    [EDGE.TOP]: {
      borderRadius: `0 0 ${borderRadius} ${borderRadius}`,
      borderTopColor: 'transparent !important',
      paddingTop: paddingY
    },
    [EDGE.RIGHT]: {
      borderRadius: `${borderRadius} 0 0 ${borderRadius}`,
      borderRightColor: 'transparent !important',
      paddingRight: paddingX
    },
    [EDGE.BOTTOM]: {
      borderRadius:  `${borderRadius} ${borderRadius} 0 0`,
      borderBottomColor: 'transparent !important',
      paddingBottom: paddingY
    },
    [EDGE.LEFT]: {
      borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
      borderLeftColor: 'transparent !important',
      paddingLeft: paddingX
    }
  })}
`;

// Components
export const StyledToggleContainer = styled.div`
  width: ${toggleSize};
  height: ${toggleSize};
  flex-shrink: 0;
  opacity: ${({ isMatched }) => isMatched ? 1 : 0};
  visibility: ${({ isMatched }) => isMatched ? 'visible' : 'hidden'};
  transition: opacity 0.25s;

  @media (max-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    ${({ trainerActive }) => trainerActive && `display: none;`}
  }
`;

export const StyledText = styled(Text)`
  flex: 1 1 100%;
`;

const animationStyles = css`
  ${deriveStyleFromZigZagEdge({
    // When zig-zag edge is on the top or right side
    // add some negative margin so that the zig-zags overlap.
    [EDGE.TOP]: { margin: `0 0 ${itemPairMargin} 0` },
    [EDGE.BOTTOM]: { margin: `0 0 ${borderWidth} 0` },
    [EDGE.RIGHT]: { margin: `0 ${borderWidth} ${itemPairMargin} 0` },

    // When zig-zag is on the left side give it some extra
    // margin to keep it seperated while unmatched.
    [EDGE.LEFT]: ({ isMatched, trainerActive }) => {
      if (trainerActive) {
      return isMatched
        ? { margin: `0 ${horizontalTravel} ${itemPairMargin} 0` }
        : { margin: `0 0 ${itemPairMargin} ${horizontalTravel}` }
      }
      return { margin: `0 0 ${itemPairMargin} 0` }
    }
  })};
`;

export const StyledMatchingItem = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  padding: ${paddingY} ${paddingX};

  transition: background-color 0.1s linear,
              color 0.1s linear,
              border-color 0.1s linear,
              box-shadow 0.1s linear;

  text-align: center;

  cursor: ${({ onClick, disabled }) => {
    if (!onClick) return 'initial'
    return disabled ? 'not-allowed' : 'pointer'
  }};

  ${borderStyles}
  ${zigZagBorderStyles};

  background-color: ${({ appearance }) => config.appearance[appearance].background};
  color: ${({ appearance }) => config.appearance[appearance].background};
  border-color: ${({ appearance }) => config.appearance[appearance].border};

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    text-align: left;
  }

  /*
    Ideally, text within the MatchingItem is aligned in the center (ignorning the translation button)
    This will add space on the left to make that the case, although, if a word is too long to fit
    this space will shrink to make space.
  */
  @media (max-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    ${({ translationAndTrainerInactive }) => translationAndTrainerInactive && css`
      &::before {
        content: '';
        flex: 0 1 2.5rem;
      }
    `}
  }

  ${({ disabled }) => !disabled && css`
    /*
    Touch devices leave the hover styles active after interaction,
    therefore we only apply the styles when hover is properly supported.
    */
    ${({ isMatched }) => !isMatched && css`
      @media (hover: hover) {
        &:hover,
        &:focus {
          background-color: ${({ appearance }) => config.appearance[appearance].hover?.background};
          color: ${({ appearance }) => config.appearance[appearance].hover?.background};
          border-color: ${({ appearance }) => config.appearance[appearance].hover?.border};
        }
      }
    `}
    &:active {
      background-color: ${({ appearance }) => config.appearance[appearance].active?.background};
      color: ${({ appearance }) => config.appearance[appearance].active?.background};
      border-color: ${({ appearance }) => config.appearance[appearance].active?.border};
    }
  `}
`;

export const StyledMatchingItemWrapper = styled.div`
  position: relative;
  min-height: ${minHeightSmallScreen};
  display: flex;

  -webkit-tap-highlight-color: transparent;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xxsmall}) {
    min-height: ${minHeightMediumScreen};
  }

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    max-width: calc(${trainerMaxWidth} / 2);
    min-height: ${minHeightLargeScreen};
    text-align: left;
  }

  ${({ appearance, isMatched }) => isMatched && appearance !== DEFAULT && `z-index: 10;`};

  ${({trainerActive}) => !trainerActive && css`transition: margin 0.25s;`};
  ${animationStyles};
  ${({ appearance }) => appearance === ERROR && css`animation: ${shake} 1s cubic-bezier(.36,.07,.19,.97);`}

  visibility: ${({ isHidden }) => isHidden ? 'hidden' : 'visible'};
  opacity: ${({ isHidden }) => isHidden ? 0 : 1};
`;
