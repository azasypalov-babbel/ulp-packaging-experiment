import { Button, Inline } from '@lessonnine/design-system.lib';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulsateAnimation = ({ theme }) => keyframes`
  0% { box-shadow: 0 0 0 0 ${theme.color.pastel.storm}; }
  50% { box-shadow: 0 0 0 4px ${theme.color.pastel.storm}; }
`;

const Nugget = styled(Button).attrs({ color: 'secondary', minWidth: 'auto' })`
  border: none;
  height: 0.5rem;
  border-radius: 0.5rem;
  padding: 0;
  margin: 1rem 0;
  flex-grow: 1;
  background: ${({ theme: { color }, $active }) => $active ? color.storm : color.pastel.storm};
  animation: ${pulsateAnimation} ease-out 1.5s;
  animation-iteration-count: ${({ $pulsate }) => $pulsate ? 'infinite' : '0'};
  &:disabled {
    box-shadow: none;
  }
  &, &:hover, &:active {
    padding: 0;
    box-shadow: none;
  }
  // to increase nugget clickable area
  &::before {
    padding: 1rem 0;
    content: ' ';
    display: block;
    margin-top: -1rem;
    height: 0.5rem;
  }
  @media (hover: none) {
    // there is no hover effect on mobile
    // we set background to initial value on hover
    &:hover:not(:active) {
      background-color: ${({ theme: { color }, $active }) => $active ? color.storm : color.pastel.storm};;
    }
  }
`;

Nugget.propTypes = {
  $pulsate: PropTypes.bool,
  $active: PropTypes.bool
};

const NuggetsContainer = styled(Inline)`
  width: 100%;
  max-width: 600px;
`;

export const NuggetsSoundNavigation = React.memo(({
  playing,
  itemsCount,
  activeItemIndex,
  disabled,
  onNavigate
}) => {
  return (
    <NuggetsContainer gap="0.25rem">
      {Array(itemsCount).fill(null).map((_, i) => {
        const active = typeof activeItemIndex === 'number' && activeItemIndex >= i;
        const nuggetColor = active ? 'blue' : 'white';
        return (
          <Nugget
            data-selector="player-nugget"
            data-nugget-color={nuggetColor}
            key={i}
            onClick={() => onNavigate(i)}
            $active={active}
            $pulsate={activeItemIndex === i && playing}
            disabled={disabled}
          />
        );
      })}
    </NuggetsContainer>
  );
});

NuggetsSoundNavigation.propTypes = {
  playing: PropTypes.bool,
  disabled: PropTypes.bool,
  itemsCount: PropTypes.number.isRequired,
  activeItemIndex: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired
};
