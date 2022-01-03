import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import Text from '../../src/components/shared/Text';
import FeedbackCard from '../../src/components/shared/FeedbackCard';
import ItemPlaybackCard from '../../src/components/shared/ItemPlaybackCard';

const stories = storiesOf('Speaking Trainers', module)
  .addDecorator(withKnobs);

stories.add('Feedback Card', () => {
  const props = {
    positive: boolean('positive', false),
    negative: boolean('negative', false)
  };

  return (
    <FeedbackCard {...props}>
      <Text as="p" fontSize="big" fontFamily="fontMilliardSemi" color="spaceGray" textAlign="left">
        {text('text', 'die Stadt')}
      </Text>
    </FeedbackCard>
  );
});

stories.add('Item Playback Card', () => {
  const props = {
    learnLanguageText: 'Learning Language Text',
    displayLanguageText: 'Display Language Text'
  };
  return (
    <ItemPlaybackCard {...props}/>
  );
});
