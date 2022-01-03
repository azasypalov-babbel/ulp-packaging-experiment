import React from 'react';
import PropTypes from 'prop-types';
import { useTransliterationReplace } from '../../src/components/Interactions/shared/Transliteration/replace';
import { TransliterationTable } from '../../src/components/Interactions/shared/Transliteration/TransliterationTable';
import {
  useTransliterationUIState
} from '../../src/components/Interactions/shared/Transliteration/UIState';

import { stories } from './Transliteration.stories';
import { select } from '@storybook/addon-knobs';

const learningLanguageOptions = {
  FRA: 'FRA',
  POR: 'POR',
  SPA: 'SPA',
  DAN: 'DAN',
  NLD: 'NLD',
  ENG: 'ENG',
  IND: 'IND',
  ITA: 'ITA',
  NOR: 'NOR',
  DEU: 'DEU',
  POL: 'POL',
  RUS: 'RUS',
  SWE: 'SWE',
  TUR: 'TUR',
  QMS: 'QMS'
};

const TransliterationReplace = ({ learnLanguageAlpha3 }) => {
  const [onTransliteration, activeTransliterations] = useTransliterationUIState();

  const [handleKeyPress] = useTransliterationReplace(
    learnLanguageAlpha3,
    onTransliteration
  );

  return (
    <div>
      <div style={{ marginTop: '5rem', position: 'relative' }}>
        <input
          onKeyPress={handleKeyPress}
          type="text">
        </input>
      </div>

      <TransliterationTable
        track={() => {}}
        active={activeTransliterations}
        learnLanguageAlpha3={learnLanguageAlpha3}
      />
    </div>
  );
};

TransliterationReplace.propTypes = {
  learnLanguageAlpha3: PropTypes.string
};


stories.add('Transliteration Replace', () => {
  const learnLanguageAlpha3 = select('Learn language', learningLanguageOptions, 'RUS');
  return <TransliterationReplace learnLanguageAlpha3={learnLanguageAlpha3} />;
});
