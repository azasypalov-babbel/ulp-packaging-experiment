import React from 'react';
import PropTypes from 'prop-types';
import { PortalWithState } from 'react-portal';
import Modal from '@lessonnine/react-ui-components.js/lib/Modal';
import ReferAFriendModalContent from './ReferAFriendModalContent';
import { StyledContainer, StyledFlexWrapper, StyledModalBackdrop, StyledCascadaModal } from './styles';

class ReferAFriendModal extends React.Component {
  componentDidMount() {
    const { onRender } = this.props;
    onRender();
  }

  renderStyledContainer(closePortal) {
    const { title, description, cta, onCtaClick, talkableUrl } = this.props;

    return (
      <StyledContainer>
        <StyledFlexWrapper>
          <StyledModalBackdrop onClick={closePortal}></StyledModalBackdrop>
          <StyledCascadaModal>
            <Modal closePortal={closePortal}>
              <ReferAFriendModalContent
                title={title}
                description={description}
                cta={cta}
                talkableUrl={talkableUrl}
                onCtaClick={() => { onCtaClick(closePortal); }} />
            </Modal>
          </StyledCascadaModal>
        </StyledFlexWrapper>
      </StyledContainer>
    );
  }

  render() {
    return (
      <PortalWithState
        closeOnOutsideClick
        closeOnEsc
        defaultOpen
      >
        {({ portal, closePortal }) => portal(this.renderStyledContainer(closePortal))}
      </PortalWithState>
    );
  }
}

ReferAFriendModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cta: PropTypes.string.isRequired,
  talkableUrl: PropTypes.string.isRequired,
  onRender: PropTypes.func.isRequired,
  onCtaClick: PropTypes.func.isRequired
};

export default ReferAFriendModal;
