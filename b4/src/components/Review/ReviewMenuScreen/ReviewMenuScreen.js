import React from 'react';
import PropTypes from 'prop-types';
import Title from '../../shared/Title';
import { InteractiveCard, CardContent, CardGroup, Layout } from './styles';
import CenterContent from '../../shared/CenterContent';
import Text from '../../shared/Text';

import flashcardIcon from '@assets/images/reviewMenuSceen/flashcards-icon.svg';
import listenIcon from '@assets/images/reviewMenuSceen/listen-icon.svg';
import speakIcon from '@assets/images/reviewMenuSceen/speak-icon.svg';
import writeIcon from '@assets/images/reviewMenuSceen/write-icon.svg';
import withTranslations from '../../shared/withTranslations';

const accessibleOnClick = (onClick) => ({
  onClick,
  tabIndex: 0,
  onKeyPress: ({ key }) => key === 'Enter' && onClick()
});

const icons = {
  flashcard: flashcardIcon,
  listen: listenIcon,
  speak: speakIcon,
  write: writeIcon
};

export const ReviewMenuScreen = ({ interactions = [], onSelectInteraction, translations }) => (
  <CenterContent>
    <Layout data-selector="review-menu-screen">
      <Title>{translations.title}</Title>
      <CardGroup>
        {interactions.map((optionId) => (
          <InteractiveCard
            data-selector={`review-menu-screen-${optionId}-button`}
            key={optionId}
            {...accessibleOnClick(() => onSelectInteraction(optionId))}>
            <CardContent>
              <img src={icons[optionId]} />
              <div>
                <Text fontFamily="fontMilliardMedium" fontSize="base" color="spaceGray" textAlign="center">
                  {translations[optionId]}
                </Text>
              </div>
            </CardContent>
          </InteractiveCard>
        )
        )}
      </CardGroup>
    </Layout>
  </CenterContent>
);

ReviewMenuScreen.propTypes = {
  interactions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectInteraction: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    title: PropTypes.string,
    flashcard: PropTypes.string,
    speak: PropTypes.string,
    write: PropTypes.string,
    listen: PropTypes.string
  }).isRequired
};

const getTranslations = (translate) => ({
  title: translate('review_menu.title'),
  speak: translate('review_menu.review_type.speak'),
  write: translate('review_menu.review_type.write'),
  listen: translate('review_menu.review_type.listen'),
  flashcard: translate('review_menu.review_type.flashcards')
});

export default withTranslations(getTranslations)(ReviewMenuScreen);
