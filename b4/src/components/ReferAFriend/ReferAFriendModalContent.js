import React from 'react';
import PropTypes from 'prop-types';

import { StyledTextWrapper, StyledH1, StyledParagraph, StyledImage } from './styles';
import Button from '../shared/Button/Button';
import introImage from '@assets/images/referAFriendModal/intro.svg';

const ReferAFriendModalContent = ({ title, description, cta, onCtaClick, talkableUrl }) => {
  return (
    <>
      <StyledImage src={introImage}></StyledImage>
      <StyledTextWrapper>
        <StyledH1
          fontSize={'xlarge'}
          fontFamily={'fontLeituraBold'}
        >
          {title}
        </StyledH1>
        <StyledParagraph
          fontSize={'standard'}
          fontFamily={'fontMilliardBook'}
        >
          {description}
        </StyledParagraph>
        <a href={talkableUrl} target="_blank" rel="noopener noreferrer">
          <Button primary onClick={onCtaClick}>{cta}</Button>
        </a>
      </StyledTextWrapper>
    </>
  );
};

ReferAFriendModalContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cta: PropTypes.string.isRequired,
  talkableUrl: PropTypes.string.isRequired,
  onCtaClick: PropTypes.func.isRequired
};

export default ReferAFriendModalContent;
