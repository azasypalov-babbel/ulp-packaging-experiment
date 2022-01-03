import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import InfoText from '../../src/components/shared/InfoText/InfoText';

const stories = storiesOf('InfoText', module);

stories.addDecorator(withKnobs);

stories.add('Info Text', () => {
  const props = {
    infoText: text('text', 'This is a powerful Tip: You can also use the input below to try longer text'),
    translations: { seeAll: 'See all' },
    onClose: boolean('withCloseAction', true) ? () => {} : null,
    onSeeAll: boolean('withSeeAllAction', true) ? () => {} : null
  };

  return <InfoText {...props} />;
});
