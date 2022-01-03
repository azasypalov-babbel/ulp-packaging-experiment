import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getFirstMessage } from '../../../dux/messages/selectors';
import { StyledContainer } from './styles';
import PermissionMessage from './MicPermissionMessage';
import MicGenericMessage from './MicGenericMessage';
import MicMutedMessage from './MicMutedMessage';
import GenericMessage from './GenericMessage';
import { MESSAGE_KEYS } from '../../../dux/messages/messageKeys';

const NetworkMessage = () => <GenericMessage isReload />;

const MessageComponents = {
  [MESSAGE_KEYS.MIC_GENERIC]: MicGenericMessage,
  [MESSAGE_KEYS.MIC_PERMISSIONS]: PermissionMessage,
  [MESSAGE_KEYS.MIC_MUTED]: MicMutedMessage,
  [MESSAGE_KEYS.GENERIC]: GenericMessage,
  [MESSAGE_KEYS.NETWORK]: NetworkMessage
};

export const MessagesContainer = ({ message }) => {
  const Component = MessageComponents[message];

  return Component ? (
    <StyledContainer>
      <Component />
    </StyledContainer>
  ) : null;
};

MessagesContainer.propTypes = {
  message: PropTypes.oneOf(Object.values(MESSAGE_KEYS))
};

const mapStateToProps = ({ messages }) => ({
  message: getFirstMessage(messages)
});

export default compose(
  connect(mapStateToProps)
)(MessagesContainer);
