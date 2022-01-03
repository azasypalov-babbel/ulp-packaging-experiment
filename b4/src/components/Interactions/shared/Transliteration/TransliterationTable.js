import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { track } from '../../../../dux/tracker/actions';
import Text from '../../../shared/Text';
import Card from '../../../shared/Card';
import { useTransliterationProvider } from './transliterationProvider';
import { compose } from 'redux';
import { renderInBottomLayout } from '../../../shared/BottomLayout';

const ITEM_WIDTH = '3.25rem';

const StyledTransliterationItem = styled.div`
  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.color.edge.raw.grey.stone};

  min-width: 2.5rem;
  margin: 0.125rem;
  padding: 0.25rem;

  background-color: ${({ active, theme }) => active
    ? theme.color.edge.raw.purple.grape
    : theme.color.edge.raw.grey.haze};

  transition: all ${({ active }) => active
    ? '40ms ease-out'
    : '250ms ease-in'};
  transition-property: background-color;

  border-radius: 0.25rem;

  user-select: none;

  & > * {
    padding: 0.125rem 0.25rem;
  }

`;

const StyledText = styled(Text)`
  background-color: ${({ theme }) => theme.color.edge.raw.grey.white};
  border-radius: 0.25rem;

  border: 1px solid ${({ theme }) => theme.color.edge.raw.grey.newYork};

  transition: all ${({ active }) => active
    ? '250ms ease-out'
    : '600ms ease-in'};
  transition-property: border-color, color;

  ${({ active, theme }) => active && css`
    border-color: ${theme.color.edge.raw.purple.brave};
    color: ${theme.color.edge.raw.purple.brave};
  `};
`;

const TransliterationItem = ({ source, target, active, onClick }) => (
  <StyledTransliterationItem
    data-source={source}
    data-target={target}
    active={active}
    onClick={(event) => {
      event.stopPropagation();
      onClick(event);
    }}>
    <Text
      fontFamily="fontMilliardSemi"
      textAlign="center"
    >
      {target}
    </Text>
    <StyledText
      active={active}
      fontFamily="fontMilliardMedium"
      textAlign="center"
    >
      {source}
    </StyledText>
  </StyledTransliterationItem>
);

TransliterationItem.propTypes = {
  active: PropTypes.bool,
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

const calculateWidth = ({ itemCount }) => {
  if (itemCount < 7) return 'auto';
  const firstRowLength = Math.ceil(itemCount / 2);
  /**
   * When there is 7 or more items, split items onto two rows
   * by constraining the container width to n x item widths plus left & right padding.
   */
  return `calc(${firstRowLength} * ${ITEM_WIDTH} + 2rem)`;
};

const StyledCard = styled(Card)`
  max-width: 38rem;

  width: ${calculateWidth};

  display: inline-block;

  padding: 1rem;

  align-self: center;
  margin: 1rem auto 0rem;

  transition: opacity 0.25s;
`;

const StyledTransliterationTable = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const TransliterationTable = (({
  active = [],
  learnLanguageAlpha3,
  track
}) => {
  const {
    isLoading,
    entries
  } = useTransliterationProvider(learnLanguageAlpha3);

  if (isLoading) return null;

  const handleItemClick = () => {
    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_element: 'transliterations_table',
        interaction: 'clicked',
        origin: 'lesson_player'
      }
    });
    /* eslint-enable camelcase */
  };

  return (
    <StyledCard
      itemCount={entries.length}
    >
      <StyledTransliterationTable data-selector="transliteration-table">
        {entries.map(([target, source]) => (
          <TransliterationItem
            active={active.includes(target)}
            key={source}
            source={source}
            target={target}
            onClick={handleItemClick}
          />
        ))}
      </StyledTransliterationTable>
    </StyledCard>
  );
});

TransliterationTable.propTypes = {
  active: PropTypes.arrayOf(PropTypes.string),
  learnLanguageAlpha3: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  track
};

export default compose(
  connect(null, mapDispatchToProps),
  renderInBottomLayout
)(TransliterationTable);
