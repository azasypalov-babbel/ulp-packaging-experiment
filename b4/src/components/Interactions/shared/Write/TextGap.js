import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import useGapWidth from './useGapWidth';
import { isiOS } from '../../../../lib/features';

const StyledSpan = styled.span`
    width: ${({ gapWidth }) => gapWidth};
`;

const TextGap = forwardRef(({ text, targetText, alternativeText, ...props }, upperRef) => {
  const ref = useRef();
     // iOS caret increases the required gap width
  const adjustForCaret = isiOS() && !text?.trim();
  const gapWidth = useGapWidth({ ref: upperRef || ref, targetText, adjustForCaret });

  return (
    <StyledSpan
      ref={upperRef || ref}
      role="textbox"
      data-solution={targetText}
      data-solution-alternative={alternativeText}
      gapWidth={gapWidth}
      {...props}
    >
      {text || ' '}
    </StyledSpan>
  );
});

TextGap.displayName = 'TextGap';

TextGap.propTypes = {
  text: PropTypes.string,
  targetText: PropTypes.string.isRequired,
  alternativeText: PropTypes.string
};

export default TextGap;
