import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MatchingItem from './MatchingItem/MatchingItem';
import { PoseGroup } from 'react-pose';
import { scrollIntoSafeArea } from '../../shared/scrollIntoSafeArea';
import { ITEM_FRAGMENT_TYPE, MATCHING_TRAINER_STATE } from './constants';
import { APPEARANCE_TYPE, itemPairMargin } from './MatchingItem/constants';
import useBreakpoint from '../../shared/hooks/useBreakpoint';
import { matchGridPropType } from './useMatchingGridState';

const StyledPairListWrapper = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1 1 100%;

  scroll-padding: ${itemPairMargin};

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    display: grid;
    grid-template-columns: auto auto;
    grid-auto-rows: 1fr;

    justify-content: center;

    flex: initial;

    transition: margin 0.25s;
  }
`;

const useOnItemChange = ({ onChange, grid }) => {
  const activeItem = useRef(null);
  useEffect(() => {
    const active = grid.find(({ isActive }) => isActive);
    if (active?.id && active.id !== activeItem.current) {
      activeItem.current = active.id;
      onChange();
    }
  }, [grid, onChange]);
};

const Spacer = styled.div`
  display: block;
  order: 0;
  flex: 1 0 4rem;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    display: none;
  }
`;

// eslint-disable-next-line no-unused-vars
const getAppearance = (isAllMatched, isGivingFeedback, { isActive, isSuccess, isError }) => {
  if (isAllMatched) return APPEARANCE_TYPE.DEFAULT;

  if (isGivingFeedback) {
    if (isSuccess) return APPEARANCE_TYPE.SUCCESS;
    if (isError) return APPEARANCE_TYPE.ERROR;
  }
  if (isActive) return APPEARANCE_TYPE.ACTIVE;
  return APPEARANCE_TYPE.DEFAULT;
};

const breakpoints = ['xxxsmall', 'xsmall'];

const shouldHideOnMobileLayout = ({ isSuccess, isError, isHidden, isMatched, isActive }) => {
  if (isHidden) return true;

  if (isSuccess || isError) return false;
  if (isActive) return false;

  // Items become matched as soon as they're correct
  // We want to still see the items while feedback is being given (isSuccess, isError, isActive)
  // That is why this is checked last
  if (isMatched) return true;

  return false;
};

const MatchGrid = ({ grid, onOptionClick, trainerState, showTranslation }) => {
  const matchGrid = useRef(null);

  useOnItemChange({
    onChange: () => { scrollIntoSafeArea(matchGrid.current); },
    grid
  });

  const activeBreakpoint = useBreakpoint(breakpoints);

  const isAllMatched = trainerState === MATCHING_TRAINER_STATE.AWAITING_CONTINUE;
  const isAwaitingSoundPlay = trainerState === MATCHING_TRAINER_STATE.PLAYING_AUDIO;
  const isDone = trainerState === MATCHING_TRAINER_STATE.DONE;
  const isGivingFeedback = trainerState === MATCHING_TRAINER_STATE.FEEDBACK;
  const isMobileLayout = activeBreakpoint === breakpoints[0];

  return (
    <StyledPairListWrapper
      ref={matchGrid}
    >
      <PoseGroup flipMove={!isAllMatched}>
        {grid
          // Filter out hidden items on mobile breakpoint
          .filter((item) => {
            if (!isMobileLayout) return true;
            if (isAllMatched) return true;
            if (isDone) return false;
            return !shouldHideOnMobileLayout(item);
          })
          .map((itemFragment, index, list) => {
            const shouldInvertTooltipPosition = index === list.length - 1;
            const { correspondingBaseId, id, isActive, isHidden, isMatched, soundId, text, translation, type} = itemFragment;
            const isOption = type === ITEM_FRAGMENT_TYPE.OPTION;
            const appearance = getAppearance(
              isAllMatched,
              isGivingFeedback,
              itemFragment
            );
            const order = isMatched || isActive ? -1 : 1;

            return (
              <MatchingItem
                data-solution-id={isOption ? correspondingBaseId : id}
                key={id + type}
                appearance={appearance}
                isClickable={!isGivingFeedback && !isAwaitingSoundPlay}
                id={id}
                isHidden={isHidden}
                isMatched={isMatched}
                isOption={isOption}
                itemText={text.toHTML()}
                onOptionClick={onOptionClick}
                order={order}
                position={type}
                tooltipPosition={shouldInvertTooltipPosition ? "TOP" : "BOTTOM"}
                showTranslation={showTranslation}
                soundId={soundId}
                trainerActive={!isAllMatched}
                translation={translation?.toHTML()}
              />
            );
          })}
      </PoseGroup>
      { !isAllMatched && <Spacer /> }
    </StyledPairListWrapper>
  );
};

MatchGrid.propTypes = {
  onOptionClick: PropTypes.func.isRequired,
  trainerState: PropTypes.oneOf(Object.values(MATCHING_TRAINER_STATE)).isRequired,
  grid: matchGridPropType.isRequired,
  showTranslation: PropTypes.bool.isRequired
};

export default MatchGrid;
