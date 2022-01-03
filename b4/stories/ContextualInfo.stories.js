import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import ContextualInfo from '../src/components/shared/ContextualInfo';

const stories = storiesOf('Contextual Info', module);

stories.addDecorator(withKnobs);

stories.add('Contextual Info Plain', () => {
  const props = {
    markupString: text('text', 'Tip: You can also use the input below to try longer text')
  };

  return (
    <ContextualInfo {...props} />
  );
});

stories.add('Contextual Info HTML', () => {
  const props = {
    markupString: `Some  trainers’ text can be **bold** and some in \"italics\"  so this component accepts markup to format text.
          Keep in mind the max-width of this component is set by the parent`
  };

  return (
    <ContextualInfo {...props} />
  );
});
