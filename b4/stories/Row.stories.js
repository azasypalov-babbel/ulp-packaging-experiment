import React from 'react';
import { storiesOf } from '@storybook/react';
import Text from '../src/components/shared/Text';
import { Row } from '../src/components/Trainer/shared/Row';

const stories = storiesOf('Rows', module);

stories.add('Rows', () => {
  return (
    <div>
      <Row type="task">
        <Text>A cold day in L.A</Text>
      </Row>

      <Row type="phrase">
        <Text>A cold day in L.A</Text>
        <Text
          data-selector="item-translation"
          fontSize="small"
          color="spaceGrayW28" >
            Un dia frio en Los Angeles
        </Text>
      </Row>

      <Row type="phrase">
        <Text>A cold day in L.A</Text>
        <Text
          data-selector="item-translation"
          fontSize="small"
          color="spaceGrayW28" >
            Un dia frio en Los Angeles
        </Text>
      </Row>

      <Row type="task">
        <Text>A cold day in L.A</Text>
      </Row>
    </div>
  );
});

