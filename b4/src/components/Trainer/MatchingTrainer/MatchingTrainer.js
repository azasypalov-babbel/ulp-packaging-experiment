import React from 'react';
import StyledTrainerLayout from '../../TrainerLayout';
import PropTypes from 'prop-types';
import MatchGrid from './MatchGrid';
import styled from 'styled-components';
import withTranslations from '../../shared/withTranslations';
import TrainerTitle from '../shared/TrainerTitle';
import { rem } from 'polished';
import { MATCHING_TRAINER_STATE } from './constants';
import { matchGridPropType } from './useMatchingGridState';

const StyledMatchingTrainer = styled(StyledTrainerLayout)`
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;

  text-align: center;
  margin-left: ${rem(24)};
  margin-right: ${rem(24)};
  margin-bottom: calc(1rem + env(safe-area-inset-bottom));

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    margin-left: ${rem(64)};
    margin-right: ${rem(64)};
  }
`;

export const MatchingTrainer = ({
  trainerState,
  grid,
  title,
  translations,
  onOptionClick,
  showTranslation
}) => {
  return (
    <StyledMatchingTrainer>
      <TrainerTitle text={title || translations.trainerTitle} />
      <MatchGrid
        trainerState={trainerState}
        grid={grid}
        onOptionClick={onOptionClick}
        showTranslation={showTranslation}
      />
    </StyledMatchingTrainer>
  );
};

const getTranslations = (translate) => {
  return {
    trainerTitle: translate('b3.page_matching.match_up_the_correct_items')
  };
};

MatchingTrainer.propTypes = {
  title: PropTypes.string,
  trainerState: PropTypes.oneOf(Object.values(MATCHING_TRAINER_STATE)).isRequired,
  grid: matchGridPropType.isRequired,
  translations: PropTypes.shape({
    trainerTitle: PropTypes.string
  }),
  onOptionClick: PropTypes.func.isRequired,
  showTranslation: PropTypes.bool.isRequired
};

export default withTranslations(getTranslations)(MatchingTrainer);
