import React from 'react';
import KeyboardKey from '../../src/components/Interactions/shared/Transliteration/KeyboardKey';
import { stories } from './Transliteration.stories';

const keys = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z', 'RETURN'
];

stories.add('Keyboard Key', () => {
  return (keys.map((character, index) =>
    <KeyboardKey
      key={index}
      character={character}
    />
  ));
});
