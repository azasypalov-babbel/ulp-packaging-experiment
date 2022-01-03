import React from 'react';
import PropTypes from 'prop-types';

import FeedbackCard from './FeedbackCard';
import Text from './Text';
import PlayButton from './PlayButton';
import styled from 'styled-components';
import { compose } from 'redux';
import { stripParantheses } from '../../lib/markupFormatter';
import {
  formatParentheses,
  getFirstCorrectSolution,
  removeGapFormatting,
  convertFormattingToHtml,
  stripCurlyBracesAndContent
} from '@lessonnine/babbel-markup-helper.js';

const formatLL = compose(
  stripParantheses,
  removeGapFormatting,
  formatParentheses,
  convertFormattingToHtml,
  getFirstCorrectSolution,
  stripCurlyBracesAndContent,
  (s) => s || ''
);

const formatDL = compose(
  formatParentheses,
  convertFormattingToHtml,
  (s) => s || ''
);

const StyledText = styled(Text)`
  margin-top: 0.5rem;
`;

const ItemPlaybackCard = ({
  onClick,
  learnLanguageText,
  displayLanguageText,
  positive,
  ...props
}) => (
  <FeedbackCard positive={positive} onClick={onClick}>
    <div>
      <PlayButton {...props} />
    </div>
    <div>
      <Text
        as="p"
        textAlign="left"
        fontSize={{ desktop: 'big', mobile: 'medium' }}
        color="spaceGray"
        dangerouslySetInnerHTML={{ __html: formatLL(learnLanguageText) }}
      />
      <StyledText
        as="p"
        textAlign="left"
        fontSize="base"
        color="spaceGrayW28"
        dangerouslySetInnerHTML={{ __html: formatDL(displayLanguageText) }}
      />
    </div>
  </FeedbackCard>
);

ItemPlaybackCard.propTypes = {
  onClick: PropTypes.func,
  isSlowPlayback: PropTypes.bool,
  isPlaying: PropTypes.bool,
  disabled: PropTypes.bool,
  positive: PropTypes.bool,
  learnLanguageText: PropTypes.string,
  displayLanguageText: PropTypes.string
};

export default ItemPlaybackCard;
