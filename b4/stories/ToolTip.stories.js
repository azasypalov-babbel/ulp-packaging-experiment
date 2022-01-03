import React from 'react';
import { storiesOf } from '@storybook/react';
import ToolTip from '../src/components/shared/ToolTip';
import { withKnobs, select, boolean, text } from '@storybook/addon-knobs';
import Button from '../src/components/shared/Button/Button';

const stories = storiesOf('ToolTip', module);
stories.addDecorator(withKnobs);

stories.add('Default ToolTip', () => {
  const visible = boolean('visible', false);
  const label = 'Location';
  const options = {
    BOTTOM: 'BOTTOM',
    TOP: 'TOP',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
  };
  const defaultValue = 'BOTTOM';
  const position = select(label, options, defaultValue);
  const copy = text('text', 'The quick brown fox jumps over the lazy dog');

  return (
    <div style={{ margin: '200px' }}>
      <ToolTip
        text={copy}
        position={position}
        visible={visible}
      >
        <Button>Target</Button>
      </ToolTip>
    </div>
  );
});
