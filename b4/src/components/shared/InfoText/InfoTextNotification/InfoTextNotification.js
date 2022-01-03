import React from 'react';
import PropTypes from 'prop-types';

import InfoText from '../InfoText';

import {
  StyledStickyWrapper,
  StyledWrapper,
  StyledInfoTextWrapper
} from './styles';
import withTranslations from '../../withTranslations';

const InfoTextNotification = ({
  hasMoreInfoTexts,
  content,
  translations,
  showList,
  dismiss
}) => {
  return (
    <StyledStickyWrapper>
      <StyledWrapper>
        <StyledInfoTextWrapper data-selector="info-texts-wrapper">
          <InfoText
            data-selector="info-texts"
            infoText={content}
            translations={translations}
            onClose={dismiss}
            onSeeAll={hasMoreInfoTexts ? showList : null}
          />
        </StyledInfoTextWrapper>
      </StyledWrapper>
    </StyledStickyWrapper>
  );
};

InfoTextNotification.propTypes = {
  content: PropTypes.string.isRequired,
  translations: PropTypes.shape({
    seeAll: PropTypes.string.isRequired
  }).isRequired,
  hasMoreInfoTexts: PropTypes.bool,
  showList: PropTypes.func,
  dismiss: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  infoTextIndex: PropTypes.number.isRequired
};


const getTranslations = (translate, { infoTextIndex }) => ({
  seeAll: translate('infotext_notification.cta', { number: infoTextIndex })
});

export default withTranslations(getTranslations)(InfoTextNotification);
