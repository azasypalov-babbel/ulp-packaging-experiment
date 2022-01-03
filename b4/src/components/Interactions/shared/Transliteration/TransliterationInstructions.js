import React from 'react';
import PropTypes from 'prop-types';
import withTranslations from '../../../shared/withTranslations';
import KeyboardKey from './KeyboardKey';
import { useTransliterationProvider } from './transliterationProvider';
import { ReplaceInline } from '../../../shared/ReplaceInline';
import Text from '../../../shared/Text';

export const serialComma = (arr, and = 'and', d = ',') => {
  const length = arr.length;
  const lastIndex = length - 1;
  const andIndex = length - 2;
  return arr.reduce(
    (acc, current, index) => {
      acc.push(current);
      if (index < lastIndex) {
        if (index === andIndex) {
          acc.push(` ${and} `);
        } else {
          acc.push(`${d} `);
        }
      }
      return acc;
    },
    []
  );
};

export const TransliterationInstructions = ({
  targetCharacter,
  learnLanguageAlpha3,
  translations
}) => {
  const {
    isLoading,
    detransliterate
  } = useTransliterationProvider(learnLanguageAlpha3);

  if (isLoading) return null;

  const detransliterated = detransliterate(targetCharacter);

  if (detransliterated === undefined) {
    console.warn(`Cannot detransliterate target character ${targetCharacter}. ` +
      `Check that your URL has RUS as learn language`);
    return null;
  }

  const keys = detransliterated
    .split('')
    .concat('RETURN')
    .map((key, index) =>
      <KeyboardKey
        key={index}
        character={key}
      />);

  return (
    <Text
      as="p"
      data-selector="transliteration-instructions"
      color="spaceGray"
    >
      <ReplaceInline
        symbol="%{transliteration}"
        replacement={serialComma(keys, translations.and, ',')}
      >
        {translations.instructions}
      </ReplaceInline>
    </Text>
  );
};

TransliterationInstructions.propTypes = {
  translations: PropTypes.shape({
    instructions: PropTypes.string.isRequired,
    and: PropTypes.string.isRequired
  }),
  learnLanguageAlpha3: PropTypes.string.isRequired,
  targetCharacter: PropTypes.string.isRequired
};

const getTranslations = (translate) => ({
  instructions: translate('b3.page_keyboard.transliteration_instruction'),
  and: translate('b3.page_keyboard.and')
});

export default withTranslations(getTranslations)(TransliterationInstructions);
