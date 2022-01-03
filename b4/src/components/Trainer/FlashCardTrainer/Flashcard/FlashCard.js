import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { StyledFlashCard, StyledBackgroundImage, StyledContentArea, StyledHintArea } from './styles';
import { poseConfig } from './animations';
import withAnimations from '../../../shared/withAnimations';
import withKeypress from '../../../shared/withKeypress';
import withShortcutHint from '../../../shared/withShortcutHint';

export const FlashCard = React.forwardRef(({
  keyboardHintComponent,
  imageUrl,
  imageChildren,
  children,
  ...props
}, ref) => (
  <StyledFlashCard {...props} ref={ref}>
    {keyboardHintComponent && <StyledHintArea>{keyboardHintComponent}</StyledHintArea>}
    <StyledBackgroundImage src={imageUrl}>{imageChildren}</StyledBackgroundImage>
    <StyledContentArea>{children}</StyledContentArea>
  </StyledFlashCard>
));

FlashCard.displayName = 'FlashCard';

FlashCard.propTypes = {
  keyboardHintComponent: PropTypes.node,
  imageUrl: PropTypes.string,
  imageChildren: PropTypes.node,
  children: PropTypes.node,
  onClick: PropTypes.func
};

export default compose(
  withShortcutHint,
  withKeypress,
  withAnimations(poseConfig)
)(FlashCard);
