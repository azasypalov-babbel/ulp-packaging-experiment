import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { IconArrowUp, IconArrowDown, Button, Stack } from '@lessonnine/design-system.lib';
import Text from '../../shared/Text';
import { bottomLayoutConfig, renderInBottomLayout } from '../../shared/BottomLayout';
import withTranslations from '../../shared/withTranslations';

const StyledContent = styled.div`
  max-width: 37.5rem;
  margin: 0 auto;
  width: 100%;
`;

const CollapsableSheet = styled.div`
  background-color: ${(props) => props.theme.cascada.white};
  box-shadow: 0px -2px 8px ${(props) => props.theme.cascada.silver};

  transition: 250ms ease-out;
  transition-property: max-height, opacity;
  position: relative;
  max-height: ${({ collapsed }) =>
    collapsed ? `calc(40px + env(safe-area-inset-bottom) + 2rem)` : `calc(100vh - 70px)`};
  overflow: hidden;
  order: 100;
  touch-action: none; /* prevent page scroll on the sheet */
  box-sizing: border-box;
  display: flex;
  padding: 1rem;
  padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  flex-direction: column;
  width: 100%;
  ${StyledContent} > *:not(:first-child) {
    transition: opacity 250ms 50ms ease-out;
    opacity: ${({ collapsed }) => collapsed ? '0' : '1'};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Question = styled.div`
  padding: 1rem 0;
`;

// for followup ticket
const getTranslations = (translate) => ({
  questionText: translate('comprehension.question')
});

export const QuestionSheet = ({
  onOpenChange,
  defaultOpened,
  question,
  interaction,
  translations,
  isHighlighted,
  nrOfQuestions,
  activeQuestion
}) => {
  const [isCollapsed, setCollapse] = React.useState(!defaultOpened);
  useEffect(() => {
    onOpenChange(!isCollapsed);
  }, [isCollapsed, onOpenChange]);
  useEffect(() => {
    bottomLayoutConfig.enableShrinking = true;
    bottomLayoutConfig.enableScrollAdjustment = false;
    return () => {
      bottomLayoutConfig.enableShrinking = false;
      bottomLayoutConfig.enableScrollAdjustment = true;
    };
  }, []);

  return (
    <CollapsableSheet
      collapsed={isCollapsed}
      onClick={(event) => event.stopPropagation()}
      data-selector={`question-sheet-${isCollapsed ? 'collapsed' : 'expanded'}`}
    >
      <StyledContent>
        <Header onClick={() => setCollapse(!isCollapsed)} data-selector="question-sheet-header">
          <Text
            fontFamily="fontMilliardSemi"
            fontSize="xsmall"
            color="spaceGray"
            data-question-count={nrOfQuestions}>
            {`${translations.questionText.toUpperCase()} ${activeQuestion}/${nrOfQuestions}`}
          </Text>
          <Button
            color={isHighlighted && isCollapsed ? 'primary' : 'secondary'}
            icon={isCollapsed ? <IconArrowUp /> : <IconArrowDown />}
            size={'micro'}
            data-selector={isCollapsed ? 'arrow-up' : 'arrow-down'}
            data-button-active={isHighlighted}
          />
        </Header>
        <Question>
          <Text fontFamily="fontMilliardSemi" fontSize="base" color="spaceGray" data-selector="question">
            {question}
          </Text>
        </Question>
        <Stack gap="0.75rem">
          {interaction}
        </Stack>
      </StyledContent>
    </CollapsableSheet>
  );
};

QuestionSheet.propTypes = {
  onOpenChange: PropTypes.func,
  defaultOpened: PropTypes.bool,
  question: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  translations: PropTypes.shape({ questionText: PropTypes.string }).isRequired,
  interaction: PropTypes.node.isRequired,
  activeQuestion: PropTypes.number.isRequired,
  nrOfQuestions: PropTypes.number.isRequired
};

export default compose(
  withTranslations(getTranslations),
  renderInBottomLayout
)(QuestionSheet);
