const translationVisibilityMap = {
  full: 'Show',
  partial: 'Icon',
  none: 'Hide'
};

export default function translationFromTranslationVisibility(translationVisibility) {
  return translationVisibilityMap[translationVisibility];
}
