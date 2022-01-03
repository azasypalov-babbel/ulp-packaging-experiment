import React from 'react';
import PropTypes from 'prop-types';

import { rem } from 'polished';
import styled from 'styled-components';

import * as features from '../../../lib/features';

import TrainerTitle from './TrainerTitle';
import TrainerImage from './TrainerImage';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 1rem;
  margin: 0 auto;

  max-width: ${rem(736)};
  width: 100%;

  box-sizing: border-box;

  ${() => {
    if (features.isWebview()) {
      return 'user-select: none;';
    }
  }};
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    flex-direction: row;
  }

  & p {
    margin-bottom: 1rem;
  }
`;

const CardTrainerLayout = ({
  titleText,
  children,
  imageId,
  ...props
}) => (
  <StyledWrapper {...props}>
    <TrainerTitle text={titleText} />
    <StyledContainer>
      <div>
        {children}
      </div>
      <TrainerImage imageId={imageId} />
    </StyledContainer>
  </StyledWrapper>
);

CardTrainerLayout.propTypes = {
  titleText: PropTypes.string.isRequired,
  children: PropTypes.node,
  imageId: PropTypes.string
};

export default CardTrainerLayout;

