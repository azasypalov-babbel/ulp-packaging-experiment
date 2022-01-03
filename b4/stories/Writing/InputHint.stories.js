import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { select } from '@storybook/addon-knobs';
import { InputHint } from '../../src/components/Interactions/Fillin/InputHint';
import CenterContent from '../../src/components/shared/CenterContent';
import { useTransliterationReplace } from '../../src/components/Interactions/shared/Transliteration/replace';

import { stories } from './Writing.stories';

const RussianInputHintDemo = (props) => {
  const [handleKeyPress] = useTransliterationReplace('RUS');
  return <InputHintDemo
    {...props}
    handleKeyPress={handleKeyPress}
  />;
};

const InputHintDemo = ({
  hintLevel,
  targetText,
  handleKeyPress = () => {}
}) => {
  const [latestText, setLatestText] = useState('');

  return (
    <CenterContent>
      <div style={{ marginTop: '5rem', position: 'relative' }}>
        <input
          onKeyPress={handleKeyPress}
          onChange={(event) => setLatestText(event.target.value)}
        />
        <InputHint
          learnLanguageAlpha3="DEU"
          track={() => {}}
          targetText={targetText}
          latestText={latestText}
          hintLevel={hintLevel}
        />
      </div>
    </CenterContent>
  );
};

InputHintDemo.propTypes = {
  hintLevel: PropTypes.string,
  targetText: PropTypes.string,
  handleKeyPress: PropTypes.func
};

stories.add('Input Hint (Single word)', () => {
  const hintLevel = select('hintLevel', ['HINT', 'SOLUTION'], 'HINT');
  return <RussianInputHintDemo
    hintLevel={hintLevel}
    targetText="Нет пожалуйста"
  />;
});

stories.add('Input Hint (Multiple words)', () => {
  const hintLevel = select('hintLevel', ['HINT', 'SOLUTION'], 'HINT');
  return <InputHintDemo
    hintLevel={hintLevel}
    targetText="se lève"
  />;
});
