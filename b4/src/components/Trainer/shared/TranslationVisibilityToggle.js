import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TranslationToggle from '../../shared/TranslationToggle';

const StyledToggleWrapper = styled.div`
  position: sticky;
  padding: 0.75rem 0; 
  top: 0.75rem;
  left: 0.75rem;
  float: left;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    left: 1.5rem;
  }
`;

const TranslationVisibilityToggle = ({ onClick, translationVisibility }) => (
  <>
    {translationVisibility === 'partial' &&
      <StyledToggleWrapper>
        <TranslationToggle onClick={onClick} />
      </StyledToggleWrapper>
    }
  </>
);

TranslationVisibilityToggle.propTypes = {
  translationVisibility: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default TranslationVisibilityToggle;
