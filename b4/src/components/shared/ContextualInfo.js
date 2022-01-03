import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { markupStringToHTML } from '@lessonnine/babbel-markup-helper.js';

import Text from './Text';
import { scrollIntoSafeArea } from './scrollIntoSafeArea';

const StyledWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: auto;

  background-color: ${(props) => props.theme.color.silver};

  border-radius: 0.75rem;

  padding: 1rem;
`;

const ContextualInfo = ({
  markupString,
  active,
  ...props
}) => {
  const ref = useRef();

  useEffect(() => {
    if (active) {
      scrollIntoSafeArea(ref.current);
    }
  }, [ref, active]);

  return (
    <StyledWrapper ref={ref} data-item-type={props.dataItemType}>
      <Text
        data-text-type="contextual-info"
        data-selector="non-interactive"
        fontFamily="fontMilliardBook"
        color="spaceGray"
        textAlign="center"
        dangerouslySetInnerHTML={{ __html: markupStringToHTML(markupString) }}
      />
    </StyledWrapper>
  );
};

ContextualInfo.propTypes = {
  active: PropTypes.bool,
  markupString: PropTypes.string.isRequired,
  dataItemType: PropTypes.string
};

export default ContextualInfo;
