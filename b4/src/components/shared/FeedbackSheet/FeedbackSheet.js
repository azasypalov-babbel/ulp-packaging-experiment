import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import withTranslations from '../withTranslations';
import { renderInBottomLayout } from '../BottomLayout';
import { compose } from 'redux';
import Sheet, {
  PreserveSize,
  FillAvailableSpace,
  ActionsWrapper
} from '../Sheet';
import {
  StyleInner,
  StyledTop,
  StyledBottom
} from './styles';
import Text from '../Text';

export const FeedbackSheet = ({
  translations,
  feedbackMessage,
  feedbackDetail,
  onContinueClick,
  onTryAgainClick,
  ...props
}) => {
  return (
    <Sheet
      {...props}
      onClick={(event) => event.stopPropagation()}
      data-selector="feedback-sheet"
    >
      <StyleInner>
        { feedbackDetail && (
          <StyledTop>
            { feedbackDetail }
          </StyledTop>
        )
        }
        <StyledBottom>
          <FillAvailableSpace>
            <div>
              { feedbackMessage && (
                <Text
                  fontFamily="fontMilliardSemi"
                  textAlign="left"
                  fontSize={{ mobile: 'base', desktop: 'medium' }}
                  color="spaceGray"
                >
                  { feedbackMessage }
                </Text>
              )}

            </div>
          </FillAvailableSpace>
          <PreserveSize>
            <ActionsWrapper>
              {onTryAgainClick && (
                <Button
                  data-selector="try-again-button"
                  onClick={onTryAgainClick}
                  listenToKey="Enter"
                  primary
                >
                  {translations.tryAgain}
                </Button>
              )}
              {onContinueClick && (
                <Button
                  data-selector="continue-button"
                  listenToKey={!onTryAgainClick ? 'Enter' : undefined}
                  primary={!onTryAgainClick}
                  onClick={onContinueClick}
                >
                  {translations.continue}
                </Button>
              )}
            </ActionsWrapper>
          </PreserveSize>
        </StyledBottom>
      </StyleInner>
    </Sheet>
  );
};

FeedbackSheet.propTypes = {
  feedbackMessage: PropTypes.string,
  feedbackDetail: PropTypes.node,
  onContinueClick: PropTypes.func,
  onTryAgainClick: PropTypes.func,
  translations: PropTypes.shape({
    tryAgain: PropTypes.string.isRequired,
    continue: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => ({
  tryAgain: translate('feedback_sheet.speech_recognition.button_try_again'),
  continue: translate('listening_trainer.button.continue')
});

export default compose(
  withTranslations(getTranslations),
  renderInBottomLayout
)(FeedbackSheet);
