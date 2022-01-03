import { select } from '@storybook/addon-knobs';
import React from 'react';
import {
  TransliterationInstructions
} from '../../src/components/Interactions/shared/Transliteration/TransliterationInstructions';
import { stories } from './Transliteration.stories';

const translations = {
  and: 'e',
  instructions: 'Per scrivere questa lettera su Babbel clicca %{transliteration} sulla tua tastiera.'
};

const cyrillicAlphabet = [
  'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж',
  'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у',
  'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'
];

stories.add('Transliteration Instructions', () => {
  const character = select('Target character', cyrillicAlphabet, 'й');
  return (
    <div>
      <TransliterationInstructions
        learnLanguageAlpha3="RUS"
        targetCharacter={character}
        translations={translations}
      />
    </div>
  );
});
