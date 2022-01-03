import React from 'react';
import PropTypes from 'prop-types';
import { compose } from '../../../lib/compose';

import {
  StyledChoiceItem, StyledTextWrapper
} from './styles';
import Text from '../Text';
import withAnimations from '../withAnimations';
import { poseConfig } from './animation';
import withKeypress from '../withKeypress';
import withShortcutHint from '../withShortcutHint';

export const ChoiceItem = React.forwardRef((props, ref) => {
  const {
    keyboardHintComponent,
    children,
    dataSelector
  } = props;

  return (
    <StyledChoiceItem
      {...props}
      ref={ref}
      data-selector={dataSelector}
    >
      {keyboardHintComponent && <div>{keyboardHintComponent}</div>}
      <StyledTextWrapper>
        <Text dangerouslySetInnerHTML={{ __html: children }} />
      </StyledTextWrapper>
    </StyledChoiceItem>
  );
});

ChoiceItem.propTypes = {
  keyboardHintComponent: PropTypes.node,
  children: PropTypes.any,
  dataSelector: PropTypes.string
};

ChoiceItem.displayName = 'ChoiceItem';

export default compose(
  withKeypress,
  withShortcutHint,
  withAnimations(poseConfig)
)(ChoiceItem);
