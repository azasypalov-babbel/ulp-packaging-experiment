import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FeedbackCard from './FeedbackCard';
import Text from './Text';
import PlayButton from './PlayButton';

const StyledTextWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const FeedbackAttemptCard = ({
  children,
  positive,
  negative,
  onClick,
  ...props
}) => (
  <FeedbackCard positive={positive} negative={negative} onClick={onClick}>
    <div>
      <PlayButton {...props} />
    </div>
    <StyledTextWrapper>
      <Text
        as="p"
        fontSize={{ desktop: 'big', mobile: 'medium' }}
        color="spaceGray"
        textAlign="left"
      >
        {children}
      </Text>
    </StyledTextWrapper>
  </FeedbackCard>
);

FeedbackAttemptCard.propTypes = {
  positive: PropTypes.bool,
  onClick: PropTypes.func,
  negative: PropTypes.bool,
  children: PropTypes.string,
  isVisible: PropTypes.bool
};

export default FeedbackAttemptCard;
