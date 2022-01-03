import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../icons';
import { StyledIconButton, IconWrapper, ContentWrapper, StyledIconButtonContent } from './styles';
import withKeypress from '../withKeypress';

export const IconButton = ({
  children,
  keyboardHintComponent,
  iconName,
  contentClassName,
  onClick,
  ...props
}) => {
  const Icon = icons[iconName];

  const handleClick = (event) => {
    event.target.blur();
    onClick(event);
  };

  return (
    <StyledIconButton {...props} onClick={handleClick}>
      <StyledIconButtonContent>
        <IconWrapper>
          {keyboardHintComponent ||
            <Icon
              size={'1.5rem'}
              fillColor="currentColor"
            />
          }
        </IconWrapper>
        {children && <ContentWrapper className={contentClassName}>
          {children}
        </ContentWrapper>}
      </StyledIconButtonContent>
    </StyledIconButton>
  );
};

IconButton.displayName = `IconButton`;

IconButton.propTypes = {
  keyboardHintComponent: PropTypes.node,
  iconName: PropTypes.oneOf([
    'KeyboardIcon',
    'CheckIcon',
    'CrossIcon',
    'MicIcon',
    'MicOff',
    'ShowIcon',
    'LightBulbIcon',
    'HideIcon',
    'BackspaceIcon'
  ]).isRequired,
  children: PropTypes.node,
  contentClassName: PropTypes.string,
  onClick: PropTypes.func
};


IconButton.defaultProps = {
  type: 'button'
};

export default withKeypress(IconButton);
