import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Text from '../Text';

const negativeStyles = css`
  background-color: ${(props) => props.theme.color.semantic.feedback.negative.background};
  border-bottom: 1px solid ${(props) => props.theme.color.semantic.feedback.negative.border};
`;

const positiveStyles = css`
  background-color: ${(props) => props.theme.color.semantic.feedback.positive.background};
  border-bottom: 1px solid ${(props) => props.theme.color.semantic.feedback.positive.border};
`;

const StyledTextWrapper = styled.div`
  display: block; 
`;

const StyledHighlightedText = styled(Text)`
  display: inline;

  color: ${(props) => props.theme.color.storm};
  line-height: 1.8;

  padding: 0.125rem 0em;
  border-radius: 0.125rem;

  line-height: 1.8;

  padding: 0.125rem 0.25rem;

  ${({ appearance }) => appearance === 'POSITIVE' && positiveStyles}
  ${({ appearance }) => appearance === 'NEGATIVE' && negativeStyles}
`;

const HighlightedText = ({ children, appearance = 'DEFAULT' }) => (
  <StyledTextWrapper>
    <StyledHighlightedText appearance={appearance}>
      {children}
    </StyledHighlightedText>
  </StyledTextWrapper>
);

HighlightedText.propTypes = {
  children: PropTypes.node,
  appearance: PropTypes.oneOf(['POSITIVE', 'NEGATIVE', 'DEFAULT'])
};

export default HighlightedText;
