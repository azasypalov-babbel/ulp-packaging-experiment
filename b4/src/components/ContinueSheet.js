import React from 'react';
import PropTypes from 'prop-types';

import Button from './shared/Button/Button';
import Sheet, { FillAvailableSpace, PreserveSize } from './shared/Sheet';
import withTranslations from './shared/withTranslations';
import { compose } from 'redux';
import { renderInBottomLayout } from './shared/BottomLayout';
import styled from 'styled-components';
import throttle from '../lib/throttle';

const StyledButtonWrapper = styled.div`
  width: 100%;

  & > button {
    width: 100%;

    @media (min-width: 620px) {
      width: auto;
    }
  }
`;


export const ContinueSheet = ({ translations, onClick, children }) => (
  <Sheet onClick={(event) => event.stopPropagation()} data-selector="continue-sheet">
    <FillAvailableSpace>
      {children}
    </FillAvailableSpace>
    <PreserveSize>
      <StyledButtonWrapper>
        <Button
          primary
          data-selector="continue-button"
          onClick={throttle(onClick, 300)}
          listenToKey="Enter"
        >
          {translations.buttonText}
        </Button>
      </StyledButtonWrapper>
    </PreserveSize>
  </Sheet>
);

ContinueSheet.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    buttonText: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => ({
  buttonText: translate('listening_trainer.button.continue')
});

export default compose(
  withTranslations(getTranslations),
  renderInBottomLayout
)(ContinueSheet);
