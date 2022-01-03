import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import StyledTrainerLayout from '../../TrainerLayout';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  &:nth-child(1) {
    padding: 2rem;
    flex: 0 0 auto;
  }

  &:nth-child(2) {
    padding: 1rem;
    flex: 1 0 auto;
    justify-content: center;
  }
`;

const TrainerLayout = ({ top, bottom }) => (
  <StyledTrainerLayout>
    <Section>{top}</Section>
    <Section>{bottom}</Section>
  </StyledTrainerLayout>
);

TrainerLayout.propTypes = {
  top: PropTypes.node,
  bottom: PropTypes.node
};

export default TrainerLayout;
