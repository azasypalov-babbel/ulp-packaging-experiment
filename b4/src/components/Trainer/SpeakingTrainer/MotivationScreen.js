import React from 'react';
import PropTypes from 'prop-types';
import Text from '../../shared/Text';
import styled from 'styled-components';
import Button from '../../shared/Button/Button';
import CenterContent from '../../shared/CenterContent';

import motivationImage from '@assets/images/speakingTrainer/feel-silly-motivation.svg';
import withTranslations from '../../shared/withTranslations';

const Layout = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 35rem;
  & > * {
    margin: 1.5rem 0;
  }
`;

const MotivationScreen = ({ onFinish, translations }) => (
  <CenterContent>
    <Layout>
      <img src={motivationImage} />
      <Text
        as="h1"
        textAlign="center"
        fontSize={'large'}
        color={'spaceGrayW15'}
        fontFamily={'fontLeituraBold'}>
        {translations.title}
      </Text>
      <Text textAlign="center">
        {translations.body}
      </Text>
      <Button data-selector="got-it" primary onClick={onFinish}>{translations.button}</Button>
    </Layout>
  </CenterContent>
);

MotivationScreen.propTypes = {
  onFinish: PropTypes.func,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => ({
  title: translate('speech_recognition.feeling_silly.title'),
  body: translate('speech_recognition.feeling_silly.body'),
  button: translate('speech_recognition.got_it')
});

export default withTranslations(getTranslations)(MotivationScreen);
