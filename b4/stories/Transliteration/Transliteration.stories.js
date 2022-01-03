import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

export const stories = storiesOf('Transliteration', module)
  .addDecorator(withKnobs);
