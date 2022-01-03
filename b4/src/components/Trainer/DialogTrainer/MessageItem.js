import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { rem } from 'polished';
import { markupStringToHTML } from '@lessonnine/babbel-markup-helper.js';

import Text from '../../shared/Text';

const activeStyles = css`
  background-color: ${(props) => props.theme.color.pastel.electric};
  border-color: ${(props) => props.theme.color.pastel.electric};
`;

const leftStyles = css`
  border-radius: 0 ${rem('12px')} ${rem('12px')} ${rem('12px')};
`;

const rightStyles = css`
  border-radius: ${rem('12px')} 0 ${rem('12px')} ${rem('12px')};
`;

const StyledWrapper = styled.div`
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;

  max-width: 100%;

  padding: ${rem('16px')};

  border: 2px solid ${(props) => props.theme.color.silver};
  background-color: ${(props) => props.theme.color.semantic.interactive.secondary.background};

  transition: border 0.1s linear, background-color 0.1s linear;

  & > * + * {
    margin-top: ${rem('8px')};
  }

  &:hover {
    border: 2px solid ${(props) => props.theme.color.semantic.interactive.secondary.border};

    ${({ active }) => active && activeStyles}
  }

  ${({ active }) => active && activeStyles}

  ${({ position }) => {
    if (position === 'left') return leftStyles;
    if (position === 'right') return rightStyles;
  }};
`;

const MessageItem = (props) => {
  const {
    children,
    secondaryText,
    active,
    position,
    onClick
  } = props;
  return (
    <StyledWrapper
      active={active}
      position={position}
      onClick={onClick}
    >
      <Text
        fontFamily="fontMilliardBook"
        color="spaceGray"
      >
        {children}
      </Text>
      { secondaryText &&
        <Text
          data-selector="item-translation"
          fontFamily="fontMilliardBook"
          color="spaceGrayW28"
          fontSize="small"
          dangerouslySetInnerHTML={{ __html: markupStringToHTML(secondaryText) }}
        />
      }
    </StyledWrapper>
  );
};

MessageItem.propTypes = {
  children: PropTypes.node.isRequired,
  secondaryText: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']).isRequired
};

export default MessageItem;
