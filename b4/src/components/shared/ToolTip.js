import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { rem } from 'polished';

import Text from './Text';

const caretSize = '0.75rem';

const  tipTop = css`
  transform: translateY(-50%) rotate(225deg);
  left: calc(50% - (${caretSize} / 2));
  top: -1px;
`;

const  tipBottom = css`
  transform: translateY(-50%) rotate(45deg);
  left: calc(50% - (${caretSize} / 2));
  bottom: -0.875rem;
`;

const  tipLeft = css`
  transform: translateX(-50%) rotate(135deg);
  left: -1px;
  top: calc(50% - (${caretSize} / 2));
`;

const  tipRight = css`
  transform: translateX(50%) rotate(315deg);
  right: -1px;
  top: calc(50% - (${caretSize} / 2));
`;

const positionTop = css`
  left: 50%;
  top: 0;
  transform: translate(-50%, calc(-100% - ${caretSize}));
`;

const positionBottom = css`
  left: 50%;
  bottom: 0;
  transform: translate(-50%, calc(100% + ${caretSize}));
`;

const positionLeft = css`
  left: 0;
  top: 50%;
  transform: translate(calc(-100% - ${caretSize}), -50%);
`;

const positionRight = css`
  right: 0;
  top: 50%;
  transform: translate(calc(100% + ${caretSize}), -50%);
`;

const StyledTooltip = styled.div`
  ${({ visible }) => !visible && `display: none;`}

  position: absolute;
  padding: ${rem('8px')} ${rem('12px')};

  background: ${((props) => props.theme.color.white)};

  border-radius: 0.25rem;
  border: 1px solid ${(props) => props.theme.color.pastel.storm};
  box-shadow: 0 0 0.2rem ${(props) => props.theme.color.silver};

  z-index: 50;

  width: max-content;
  white-space: normal;
  max-width: ${rem('254px')};

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.small}) {
    max-width: ${rem('374px')};
  }

  ${({ position }) => {
    if (position == 'BOTTOM') return positionBottom;
    if (position == 'TOP') return positionTop;
    if (position == 'LEFT') return positionLeft;
    if (position == 'RIGHT') return positionRight;
  }}

  & > p { margin: 0 !important}

  &:before {
    position: absolute;
    content: " ";
    width: ${caretSize};
    height: ${caretSize};
    background-color: ${((props) => props.theme.color.white)};
    border-width: 1px;
    border-right-style: solid;
    border-bottom-style: solid;
    border-color: ${(props) => props.theme.color.pastel.storm};
    transform-origin: center;

    ${({ position }) => {
      if (position == 'BOTTOM') return tipTop;
      if (position == 'TOP') return tipBottom;
      if (position == 'LEFT') return tipRight;
      if (position == 'RIGHT') return tipLeft;
    }}
  }
`;

const StyledTipWrapper = styled.div`
  position: relative;
  display: inline-block;

  ${({ isInline }) => isInline && css`
      display: flex;
      justify-content: center;
      width: 100%;
    `}
`;

const ToolTip = ({ children, text, position, visible, isInline, ...props }) => {
  return (
    <StyledTipWrapper isInline={isInline}>
      <StyledTooltip
        data-selector="tip-content"
        position={position}
        visible={visible}
        {...props}
      >
        <Text
          as="p"
          fontFamily="fontMilliardBook"
          color="spaceGrayW15"
          fontSize={{ desktop: 'base', mobile: 'small' }}
          textAlign="left"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </StyledTooltip>
      {children}
    </StyledTipWrapper>
  );
};

ToolTip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
  visible: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(['BOTTOM', 'TOP', 'LEFT', 'RIGHT']),
  isInline: PropTypes.bool.isRequired
};

ToolTip.defaultProps = {
  position: 'BOTTOM',
  isInline: false
};

export default ToolTip;
