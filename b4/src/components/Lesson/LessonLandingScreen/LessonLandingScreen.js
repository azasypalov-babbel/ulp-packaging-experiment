import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import mediaUrlService from '../../../services/mediaUrlService';
import {
  StyledPageWrapper,
  StyledWrapper,
  StyledFlexWrapper,
  StyledHeroImage,
  StyledTextWrapper,
  StyledParagraph,
  StyledH1,
  StyledH3,
  StyledButton
} from './styles';
import withTranslations from '../../shared/withTranslations';

export const LessonLandingScreen = ({
  onConfirm,
  course,
  lesson,
  translations,
  track,
  learnLanguageAlpha3,
  locale
}) => {
  const imageUrl = mediaUrlService.imageURL(
    lesson.image.id,
    '1024x768',
    'jpg',
    'landscape'
  );

  useEffect(() => {
    /* eslint-disable camelcase */
    track({
      event: 'product:view_shown',
      version: 1,
      payload: {
        view_name: 'lesson_landing_page',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }, [track]);

  return (
    <StyledPageWrapper>
      <StyledHeroImage src={imageUrl} />
      <StyledWrapper>
        <StyledTextWrapper>
          <StyledH3 fontSize={'small'} color={'spaceGrayW28'}>
            {course.title}
          </StyledH3>
          <StyledH1
            fontSize={'large'}
            fontFamily={'fontLeituraBold'}
            color={'spaceGray'}
          >
            {lesson.title}
          </StyledH1>
          <StyledH3>{lesson.description}</StyledH3>
          <StyledFlexWrapper>
            <StyledParagraph
              fontSize={'small'}
              color={'spaceGray'}
              dangerouslySetInnerHTML={{
                __html: lesson.detailedDescriptionHtml
              }}
            />
            <StyledButton primary onClick={onConfirm}>
              {translations.button}
            </StyledButton>
          </StyledFlexWrapper>
        </StyledTextWrapper>
      </StyledWrapper>
    </StyledPageWrapper>
  );
};

LessonLandingScreen.propTypes = {
  course: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired,
  lesson: PropTypes.shape({
    image: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    title: PropTypes.string.isRequired,
    detailedDescriptionHtml: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    button: PropTypes.string.isRequired
  }),
  track: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired
};

const getTranslations = (translate) => ({
  button: translate('landing_screen.start_lesson')
});

export default withTranslations(getTranslations)(LessonLandingScreen);
