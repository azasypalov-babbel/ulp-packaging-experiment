import { Button, IconNext, IconPrevious, Layout } from '@lessonnine/design-system.lib';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const NavigationButton = styled(Button)`
  &:disabled {
    color: ${({ theme }) => theme.color.platinumStorm};
  }
`;

export const PlayerButtons = ({ onNavigate, backButtonDisabled, forwardButtonDisabled, playButton }) => {
  const backButtonStatus = backButtonDisabled ? 'disabled' : 'enabled';
  const forwardButtonStatus = forwardButtonDisabled ? 'disabled' : 'enabled';
  return (
    <Layout gap="2.5rem" alignItems="center">
      <NavigationButton
        data-selector={`player-back-button-${backButtonStatus}`}
        disabled={backButtonDisabled}
        onClick={() => onNavigate(-1)}
        icon={<IconPrevious />}
        color="tertiary"
      />
      {playButton}
      <NavigationButton
        data-selector={`player-forward-button-${forwardButtonStatus}`}
        disabled={forwardButtonDisabled}
        onClick={() => onNavigate(1)}
        icon={<IconNext />}
        color="tertiary"
      />
    </Layout>
  );
};

PlayerButtons.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  backButtonDisabled: PropTypes.bool,
  forwardButtonDisabled: PropTypes.bool,
  playButton: PropTypes.node
};
