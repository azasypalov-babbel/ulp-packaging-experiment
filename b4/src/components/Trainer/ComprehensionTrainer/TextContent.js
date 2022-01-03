import { parse } from '@lessonnine/babbel-markup-helper.js';
import { Stack } from '@lessonnine/design-system.lib';
import { remToPx } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';
import { StyledText } from './styles';
import { useScrollReachedEnd } from '../../shared/hooks/useScrollReachedEnd';

const remsToPxMapper = (rems) => parseInt(remToPx(rems));
const checkTextValidity = (text) => typeof text === 'string' && text !== '';

export const TextContent = ({ items, translationsVisible, onScrollReachedEnd }) => {
  useScrollReachedEnd({
    onScrollReachedEnd,
    element: document.lastElementChild
  });
  return (
    <Stack
      padding={{
        xxxsmall: [0, 0.5, 2, 0.5].map(remsToPxMapper),
        xsmall: [0, 1.5, 2, 1.5].map(remsToPxMapper)
      }}
      gap="1rem"
    >
      {items.map(({ id, displayLanguageText, learnLanguageText }) => (
        <Stack key={id} gap="0.5rem">
          {checkTextValidity(learnLanguageText) && (
            <StyledText
              fontSize="base"
              color="spaceGray"
              dangerouslySetInnerHTML={{
                __html: parse(learnLanguageText).toHTML()
              }}
              data-selector="item-text"
            />
          )}
          {translationsVisible && checkTextValidity(displayLanguageText) && (
            <StyledText
              fontSize="small"
              color="spaceGrayW28"
              dangerouslySetInnerHTML={{
                __html: parse(displayLanguageText).toHTML()
              }}
              data-selector="item-translation"
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
};

TextContent.propTypes = {
  items: PropTypes.array,
  translationsVisible: PropTypes.bool,
  onScrollReachedEnd: PropTypes.func
};
