import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { rem } from 'polished';
import { markupStringToHTML } from '@lessonnine/babbel-markup-helper.js';

import Text from '../../shared/Text';
import { SoundOnIcon } from '@lessonnine/design-system.lib';

const STATES = {
  active: 'active',
  success: 'success',
  error: 'error'
};

const iconSize = rem('24px');

const activeStyles = css`
  background-color: ${(props) => props.theme.color.pastel.electric};
  border-color: ${(props) => props.theme.color.pastel.electric};
`;

const successStyles = css`
  background-color: ${(props) => props.theme.color.semantic.feedback.positive.background};
  border-color: ${(props) => props.theme.color.semantic.feedback.positive.border};
`;

const errorStyles = css`
  background-color: ${(props) => props.theme.color.semantic.feedback.negative.background};
  border-color: ${(props) => props.theme.color.semantic.feedback.negative.border};
`;

const StyledWrapper = styled.div`
  box-sizing: border-box;
  display: flex;

  max-width: 100%;

  padding: ${rem('12px')} ${rem('16px')};

  border: 2px solid ${(props) => props.theme.color.silver};
  border-radius: ${rem('8px')};
  background-color: ${(props) => props.theme.color.iceGray};

  transition: border 0.1s linear, background-color 0.1s linear;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    padding: ${rem('16px')};
  }

  ${({ onClick }) => onClick && css`
    cursor: pointer;
  `}

  &:hover {
    border: 2px solid ${(props) => props.theme.color.semantic.interactive.secondary.border};

    ${({ state }) => state === STATES.active && activeStyles}
    ${({ state }) => state === STATES.success && successStyles}
    ${({ state }) => state === STATES.error && errorStyles}
  }

  ${({ state }) => state === STATES.active && activeStyles}
  ${({ state }) => state === STATES.success && successStyles}
  ${({ state }) => state === STATES.error && errorStyles}
`;

const StyledIconWrapper = styled.div`
  color: ${({ theme }) => theme.color.spaceGray };

  min-width: ${iconSize};
  height: ${iconSize};

  margin-right: ${rem('8px')};
`;

const StyledText = styled(Text)`
  align-self: center;
`;

const SpeakItem = (props) => {
  const {
    text,
    onClick,
    state,
    ...rest
  } = props;
  return (
    <StyledWrapper
      data-selector="speak-item"
      data-item-state={state}
      state={state}
      onClick={onClick}
      {...rest}
    >
      <StyledIconWrapper>
        <SoundOnIcon size={iconSize} />
      </StyledIconWrapper>
      <StyledText
        fontSize={{ desktop: 'medium', mobile: 'base' }}
        fontFamily="fontMilliardBook"
        color="spaceGray"
        dangerouslySetInnerHTML={{ __html: markupStringToHTML(text) }}
      />
    </StyledWrapper>
  );
};

SpeakItem.defaultProps = {
  state: 'default'
};

SpeakItem.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  state: PropTypes.oneOf(['default', 'active', 'success', 'error'])
};

export default SpeakItem;
