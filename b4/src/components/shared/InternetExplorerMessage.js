import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rem } from 'polished';
import { localeToBCP47 } from '../../lib/languageCodeConverter';

import Card from './Card';
import Text from './Text';
import Button from './Button/Button';

import messageIEImgUrl from '@assets/images/InternetExplorerMessage/messageIE.svg';
import withTranslations from './withTranslations';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: ${rem(700)};
  min-height: ${rem(424)};
  margin: ${rem(40)} auto;
`;

const StyledFullscreenBlocker = styled.div`
  text-align: center;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;

  max-width: ${rem(615)};
  padding: 3rem 1.5rem 2rem;

  img {
    width: 100%;
    width: 17.4rem;
    margin: 0 auto;
  }
`;

const StyledHeading = styled(Text)`
  margin: ${rem(40)} 0;
`;

const StyledBody = styled(Text)`
  margin-bottom: ${rem(40)};
`;

const StyledLink = styled(Button)`
  text-decoration: none;
  padding: 1rem;
  margin-left: ${rem(10)};

  :hover {
    padding: 1rem;
  }
`;

export const InternetExplorerMessage = ({ onRemindLaterClick, translations, locale }) => {
  const localeConverted = localeToBCP47(locale);
  const showHowUrl =
    'https://support.babbel.com/hc/'
    + localeConverted
    + '/articles/205600268-What-are-the-system-requirements-needed-to-use-Babbel-';

  return (
    <StyledWrapper>
      <StyledFullscreenBlocker>
        <StyledCard>
          <img src={messageIEImgUrl} />
          <StyledHeading
            fontSize="big"
            fontFamily="fontLeituraBold"
            color="spaceGray"
          >
            {translations.title}
          </StyledHeading>
          <StyledBody
            fontSize="base"
            color="spaceGrayW15"
          >
            {translations.body}
          </StyledBody>
          <div>
            <Button
              data-selector="remind-me-later-button"
              onClick={onRemindLaterClick}
            >
              {translations.ctaClose}
            </Button>
            <StyledLink
              primary
              href={showHowUrl}>
              {translations.ctaShowMe}
            </StyledLink>
          </div>
        </StyledCard>
      </StyledFullscreenBlocker>
    </StyledWrapper>
  );
};

InternetExplorerMessage.propTypes = {
  onRemindLaterClick: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    ctaClose: PropTypes.string.isRequired,
    ctaShowMe: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => ({
  title: translate('internet_explorer_message.title'),
  body: translate('internet_explorer_message.body'),
  ctaClose: translate('internet_explorer_message.cta_close'),
  ctaShowMe: translate('internet_explorer_message.cta_show_me')
});

export default compose(
  withTranslations(getTranslations)
)(InternetExplorerMessage);
