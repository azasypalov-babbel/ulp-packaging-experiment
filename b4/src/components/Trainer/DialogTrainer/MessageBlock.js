import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import SpeakerAvatar from './SpeakerAvatar';
import MessageItem from './MessageItem';
import { rem } from 'polished';
import { scrollIntoSafeArea } from '../../shared/scrollIntoSafeArea';


const StyledMessageBlock = styled.div`
  display: flex;
  flex-direction: column;

  cursor: ${(props) => props.onClick ? 'pointer' : 'initial'};

  ${(props) => props.hasAvatar && css`margin-top: ${rem('12px')};`};

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    flex-direction: row;
  }

  & > div:first-child {
    margin: 0 0 ${rem('12px')} 0;
    ${({ position }) => {
    if (position === 'right') return css`
        @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
          margin: 0 0 0 ${rem('12px')};
        }
      `;

    if (position === 'left') return css`
      @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
        margin: 0 ${rem('12px')} 0 0; }`;
  }}
  }
`;

const StyledRow = styled.div`
  display: flex;
  align-items: flex-start;

  &:focus {
    outline: none;
  }

  ${({ position }) => {
    if (position === 'left') return css`
      flex-direction: row;
    `;
    if (position === 'right') return css`
      flex-direction: row-reverse;
      & > div {
        flex-direction: column;
        align-items: flex-end;
      }

      @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
        & > div {
          align-items: flex-start;
          flex-direction: row-reverse;
        }
      }
    `;
  }};
`;

const AvatarSpacer = styled.div`
  height: ${rem('48px')};
  width: ${rem('48px')};
  min-width: ${rem('48px')};
  display: none;
  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    display: block;
  }
`;

const MessageBlock = (props) => {
  const {
    hasAvatar,
    speakerRole,
    children,
    secondaryText,
    position,
    isSpeaking,
    onClick,
    avatarIsSpeaking,
    active,
    dataItemType
  } = props;

  const [isSpeakingByClick, setIsSpeakingByClick] = useState(false);

  const handleClick = (event) => {
    setIsSpeakingByClick(true);
    onClick(event);
  };

  useEffect(() => {
    // This a stateful variant of the isSpeaking prop.
    // It will only be true if isSpeaking was triggered by a user click.
    if (isSpeakingByClick && !isSpeaking) {
      setIsSpeakingByClick(false);
    }
  }, [isSpeakingByClick, isSpeaking]);

  const ref = useRef();

  useEffect(() => {
    if (active) {
      scrollIntoSafeArea(ref.current);
    }
  }, [ref, active]);

  return (
    <StyledRow
      ref={ref}
      position={position}
      tabIndex="0"
    >
      <StyledMessageBlock
        active={isSpeakingByClick}
        onClick={onClick ? handleClick : undefined}
        position={position}
        data-selector="item-sound-replay-wrapper"
        hasAvatar={hasAvatar}
      >
        {hasAvatar ? <SpeakerAvatar
          speakerRole={speakerRole}
          isSpeaking={avatarIsSpeaking}
        /> : <AvatarSpacer />}
        <div position={position} data-item-type={dataItemType}>
          <MessageItem
            secondaryText={secondaryText}
            active={isSpeakingByClick}
            position={position}
          >
            {children}
          </MessageItem>
        </div>
      </StyledMessageBlock>
    </StyledRow>
  );
};

MessageBlock.propTypes = {
  position: PropTypes.oneOf(['left', 'right']).isRequired,
  active: PropTypes.bool,
  avatarIsSpeaking: PropTypes.bool,
  isSpeaking: PropTypes.bool,
  hasAvatar: PropTypes.bool,
  children: PropTypes.node,
  speakerRole: PropTypes.oneOf(['m1', 'm2', 'f1', 'f2', 'n1', 'None']),
  secondaryText: PropTypes.string,
  onClick: PropTypes.func,
  dataItemType: PropTypes.string
};

export default MessageBlock;
