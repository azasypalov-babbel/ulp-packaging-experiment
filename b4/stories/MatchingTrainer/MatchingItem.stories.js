import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import MatchingItem from '../../src/components/Trainer/MatchingTrainer/MatchingItem/MatchingItem';
import { ITEM_FRAGMENT_TYPE } from '../../src/components/Trainer/MatchingTrainer/constants';
import { APPEARANCE_TYPE } from '../../src/components/Trainer/MatchingTrainer/MatchingItem/constants';

const stories = storiesOf('Matching Trainer', module);
stories.addDecorator(withKnobs);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    flex-direction: row;
  }
`;

stories.add('Matching Item', () => {
  const positionLabel = 'Position';
  const positionDefault = ITEM_FRAGMENT_TYPE.BASE;

  const appearanceLabel = 'Appearance';
  const defaultAppearance = APPEARANCE_TYPE.DEFAULT;

  const props = {
    id: 'ffffff',
    itemText: text('Text', 'Item Text'),
    style: {},
    appearance: select(appearanceLabel, APPEARANCE_TYPE, defaultAppearance),
    position: select(positionLabel, ITEM_FRAGMENT_TYPE, positionDefault),
    onClick: () => {},
    translation: 'this is the translation',
    isMatched: boolean('isMatched', false),
    isHidden: boolean('isHidden', false),
    trainerActive: boolean('trainerActive', true),
    showTranslation: boolean('showTranslation', false)
  };

  return (
    <Wrapper>
      <MatchingItem {...props} position={ITEM_FRAGMENT_TYPE.BASE} />
      <MatchingItem {...props} position={ITEM_FRAGMENT_TYPE.OPTION} />
    </Wrapper>
  );
});
