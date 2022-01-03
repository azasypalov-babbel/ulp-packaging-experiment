import React from 'react';
import { storiesOf } from '@storybook/react';
import Card from '../src/components/shared/Card';
import Placeholder from '../src/components/shared/Placeholder';

const stories = storiesOf('Card', module);

stories.add('Styled Card', () => {
  return (
    <Card>
     <Placeholder height={'300px'} width={'300px'} />
    </Card>
  );
});
