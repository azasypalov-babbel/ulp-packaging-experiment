import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

import Player from '../../Player/Player';
import withTranslations from '../../shared/withTranslations';
import StyledTrainerLayout from '../../TrainerLayout';
import { ServiceContext } from '../../shared/withServices';
import { ComprehensionTrainerTitle, StyledDescriptionWrapper, StyledWrapper } from './styles';
import ContextualInfo from '../../shared/ContextualInfo';
import { TextContent } from './TextContent';

const getTranslations = (translate) => ({
  trainerTitle: {
    text: translate('b3.comprehension.text_title'),
    audio: translate('b3.comprehension.audio_title')
  }
});

const fadeInAnimation = keyframes`
  from {
    height: 100%;
    opacity: 0.5;
  }
  to {
    height: 100%;
    opacity: 1;
  }
`

const TrainerBody = styled.div`
  animation: ${fadeInAnimation} 400ms ease-out 1.5s 1 forwards;
  opacity: 0;
  height: 0;
`;

export const ComprehensionTrainer = ({
  onAllItemsComplete,
  dictate,
  items,
  title,
  translations,
  description,
  translationsVisible
}) => {
  const { mediaUrlService } = useContext(ServiceContext);
  const audioUrls = useMemo(
    () => items.map((item) => item.sound?.id && mediaUrlService.soundURL(item.sound.id)),
    [items, mediaUrlService]
  );
  const renderBody = () => {
    if (dictate) {
      return (
        <Player
          onCompleteAll={onAllItemsComplete}
          audioUrls={audioUrls}
        />
      );
    }
    return (
      <TextContent
        items={items}
        translationsVisible={translationsVisible}
        onScrollReachedEnd={onAllItemsComplete}
      />
    );
  };
  return (
    <StyledTrainerLayout>
      <ComprehensionTrainerTitle
        text={title || translations.trainerTitle[dictate ? 'audio' : 'text']}
      />
      <StyledWrapper>
        {description && (
          <StyledDescriptionWrapper>
            <ContextualInfo
              active={true}
              dataItemType="description"
              markupString={description}
            />
          </StyledDescriptionWrapper>
        )}
        <TrainerBody>
          {renderBody()}
        </TrainerBody>
      </StyledWrapper>
    </StyledTrainerLayout>
  );
};

ComprehensionTrainer.propTypes = {
  onAllItemsComplete: PropTypes.func.isRequired,
  translations: PropTypes.object,
  items: PropTypes.array,
  title: PropTypes.string,
  description: PropTypes.string,
  dictate: PropTypes.bool,
  translationsVisible: PropTypes.bool
};

export default withTranslations(getTranslations)(ComprehensionTrainer);
