import { useTransliterationProvider } from './transliterationProvider';
import { insertText } from '../Write/helpers';

export const determineReplacement = (text, { transliterate, detransliterate }) => {
  const unwrapPreviousTransliterations = (text) => text
    .split('')
    .map((entry) => detransliterate(entry) || entry)
    .join('');

  const check = (count, distance = count) => {
    const checkText = text.slice(-distance);
    if (distance < 1 || !checkText.length) return [undefined, undefined];

    if (checkText.length < distance) return check(count, distance - 1);

    const replacement = transliterate(
      unwrapPreviousTransliterations(checkText)
    );
    if (replacement) {
      return [replacement, distance];
    } else {
      return check(count, distance - 1);
    }
  };

  return check(3);
};

export const useTransliterationReplace = (
  learnLanguageAlpha3,
  onTransliteration = () => {},
  enabled = true
) => {
  const {
    isLoading,
    transliterate,
    detransliterate
  } = useTransliterationProvider(learnLanguageAlpha3);

  const handleKeyPress = (event) => {
    const charCode = (typeof event.which == 'undefined') ? event.keyCode : event.which;

    if (isLoading || !enabled || !charCode) return;

    const findReplacement = (char) => {
      const caretIndex = event.target.selectionStart;
      const isSelection = caretIndex !== event.target.selectionEnd;

      let replacement;

      /**
       * If there is no selection, check if the previous character is part of the replacement
       */
      if (!isSelection) {
        const charactersBehindCaret = event.target.value.slice(0, caretIndex);

        const [foundReplacement, distance] = determineReplacement(
          charactersBehindCaret + char,
          { transliterate, detransliterate }
        );

        if (foundReplacement) {
          replacement = foundReplacement;
          // Set selection to include the previous character so it is also replaced
          event.target.setSelectionRange(
            caretIndex - (distance - 1),
            caretIndex
          );
        }
      }

      return replacement;
    };
    const charStr = String.fromCharCode(charCode);
    const text = findReplacement(charStr);
    if (text) {
      insertText(text);
      onTransliteration(text);
      event.preventDefault();
    }
  };

  /**
   * Attach handleKeyPress onKeyPress events from an input element
   */
  return [
    handleKeyPress,
    isLoading
  ];
};
