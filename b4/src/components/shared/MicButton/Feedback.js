import React from 'react';
import PropTypes from 'prop-types';
import { StyledWrapper } from './styles';
import CheckCircle from './Circles/CheckCircle';
import CrossCircle from './Circles/CrossCircle';

const Feedback = ({ correct }) => (
  <StyledWrapper>
    {correct
      ? <CheckCircle />
      : <CrossCircle />
    }
  </StyledWrapper>
);

Feedback.propTypes = {
  correct: PropTypes.bool.isRequired
};

export default Feedback;
