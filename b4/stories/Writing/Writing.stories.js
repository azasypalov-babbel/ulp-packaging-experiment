import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import withStore from '../decorators/withStore';

export const stories = storiesOf('Writing', module)
  .addDecorator(withStore)
  .addDecorator(withKnobs);
