import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rem } from 'polished';

import Card from '../Card';
import Text from '../Text';
import Button from '../Button/Button';

import permissionImgUrl from '@assets/images/speechRecognition/permission.svg';
import withTranslations from '../withTranslations';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  max-width: ${rem(600)};
  min-height: ${rem(460)};
  margin: ${rem(40)} auto;
`;

const StyledFullscreenBlocker = styled.div`
  text-align: center;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;

  max-width: ${rem(420)};
  padding: ${rem(54)};

  img {
    width: 100%;
    width: 14rem;
    margin: 0 auto;
  }
`;

const StyledHeading = styled(Text)`
  margin: ${rem(40)} 0;
`;

const StyledBody = styled(Text)`
  margin-bottom: ${rem(40)};
`;

export const MicPermission = ({ onClick, continueEnabled, dataSelector, translations }) => (
  <StyledWrapper>
    <StyledFullscreenBlocker>
      <StyledCard>
        <img src={permissionImgUrl} />
        <StyledHeading
          fontSize="big"
          fontFamily="fontMilliardMedium"
          data-selector={dataSelector}>
          {translations.title}
        </StyledHeading>
        <StyledBody fontSize="small">
          {translations.body}
        </StyledBody>
        <div>
          <Button
            data-selector="continue-button"
            disabled={!continueEnabled}
            primary
            onClick={onClick}
          >
            {translations.button}
          </Button>
        </div>
      </StyledCard>
    </StyledFullscreenBlocker>
  </StyledWrapper>
);

MicPermission.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  isReview: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  continueEnabled: PropTypes.bool.isRequired,
  dataSelector: PropTypes.string.isRequired,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate, props) => {
  const translations = {
    lesson: {
      title: translate('speech_recognition.mic_permission.title'),
      body: translate('speech_recognition.mic_permission.body'),
      button: translate('speech_recognition.mic_permission.cta')
    },
    review: {
      title: translate('speech_recognition.mic_permission_review.title'),
      body: translate('speech_recognition.mic_permission_review.body'),
      button: translate('speech_recognition.mic_permission_review.cta')
    }
  };

  return props.isReview ? translations.review : translations.lesson;
};

export default withTranslations(getTranslations)(MicPermission);
