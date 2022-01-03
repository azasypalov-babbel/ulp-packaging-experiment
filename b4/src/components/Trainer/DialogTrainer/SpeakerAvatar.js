import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import { rem } from 'polished';

import M1Icon from '../../shared/icons/avatar/M1Icon';
import M2Icon from '../../shared/icons/avatar/M2Icon';
import F1Icon from '../../shared/icons/avatar/F1Icon';
import F2Icon from '../../shared/icons/avatar/F2Icon';
import N1Icon from '../../shared/icons/avatar/N1Icon';

const speakerRoles = {
  m1: M1Icon,
  m2: M2Icon,
  f1: F1Icon,
  f2: F2Icon,
  n1: N1Icon
};

const backgroundPulse = keyframes`
  0% {
    transform: scale(.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(.8);
  }
`;

const backgroundN1 = css`
  background-color: ${(props) => props.theme.color.pastel.grass};
`;

const backgroundM1 = css`
  background-color: ${(props) => props.theme.color.edge.raw.purple.grape};
`;

const backgroundM2 = css`
  background-color: ${(props) => props.theme.color.edge.raw.teal.eis};
`;

const backgroundF1 = css`
  background-color: ${(props) => props.theme.color.edge.raw.yellow.limon};
`;

const backgroundF2 = css`
  background-color: ${(props) => props.theme.color.edge.raw.red.macaron};
`;

const background = css`
  content: "";
  position: absolute;

  height: ${rem('64px')};
  width: ${rem('64px')};
  border-radius: 50%;
  z-index: -1;

  transform-origin: center;
  animation: ${backgroundPulse} 1s ease-in-out infinite alternate;

  ${({ speakerRole }) => {
    if (speakerRole === 'n1') return backgroundN1;
    if (speakerRole === 'm1') return backgroundM1;
    if (speakerRole === 'm2') return backgroundM2;
    if (speakerRole === 'f1') return backgroundF1;
    if (speakerRole === 'f2') return backgroundF2;
  }};
`;

const StyledOuterCircle = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  transition: background-color 100ms;

  &:after {
    ${background};
  }
`;

const SpeakerAvatar = (props) => {
  const { speakerRole, isSpeaking } = props;
  const dataSelector = `speaker-avatar-${speakerRole}`;
  const RoleIcon = speakerRoles[speakerRole];
  if (!RoleIcon) return null;
  return (<div data-selector={dataSelector}>
    { isSpeaking ?
      <StyledOuterCircle speakerRole={speakerRole}>
        <RoleIcon size={'3rem'}/>
      </StyledOuterCircle>
      :
      <RoleIcon size={'3rem'}/>
    }</div>
  );
};

SpeakerAvatar.propTypes = {
  speakerRole: PropTypes.oneOf(['m1', 'm2', 'f1', 'f2', 'n1', 'None']).isRequired,
  isSpeaking: PropTypes.bool
};

export default SpeakerAvatar;
