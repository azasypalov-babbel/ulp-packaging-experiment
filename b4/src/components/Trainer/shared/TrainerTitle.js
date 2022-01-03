import React from 'react';
import PropTypes from 'prop-types';

import { rem } from 'polished';
import styled from 'styled-components';
import { markupStringToHTML } from '@lessonnine/babbel-markup-helper.js';

import Title from '../../shared/Title';

const StyledTitle = styled(Title)`
  margin-left: 2.25rem;
  margin-right: 2.25rem;
  margin-bottom: ${rem(24)};

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xxsmall}) {
    margin-bottom: ${rem(32)};
  }

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    margin-bottom: ${rem(48)};
  }
`;

const TrainerTitle = ({ text, ...props }) => (
  <StyledTitle
    data-selector="title"
    textAlign="center"
    fontFamily="fontMilliardSemi"
    color="spaceGray"
    fontSize="big"
    as="h1"
    dangerouslySetInnerHTML={{ __html: markupStringToHTML(text) }}
    {...props}
  />
);

TrainerTitle.propTypes = {
  text: PropTypes.string.isRequired
};

export default TrainerTitle;
