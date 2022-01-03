export const items = [
  { // item 0 - interactive phrase w/ info text and sound
    id: 'a',
    type: 'phrase',
    sound: { id: 'aa' },
    infoText: 'Testing 123',
    learnLanguageText: '((Schöner|*Guten)) "Morgen", lieber **Cousin**',
    displayLanguageText: '"Good morning", **dear** cousin.'
  },
  { // item 1 - interactive task w/ info text
    id: 'b',
    type: 'task',
    infoText: 'Useful Info',
    displayLanguageText: 'Ein Tag, ((zwei Tage)), **drei** "Tage"'
  },
  { // item 2 - noninteractive phrase w/ info text but w/o sound
    id: 'c',
    type: 'phrase',
    infoText: 'More Useful Info',
    learnLanguageText: 'Argentina "became" **world champion**!',
    displayLanguageText: 'Argentina "salio" **campeon**'
  },
  { // item 3 - noninteractive task w/o info text
    id: 'd',
    type: 'task',
    displayLanguageText: '"Y sho era" el **mejor**'
  },
  { // item 4 - noninteractive phrase w/ sound but w/o info text
    id: 'e',
    type: 'phrase',
    sound: { id: 'bb' },
    learnLanguageText: 'But "I" actually don\'t **like** football',
    displayLanguageText: 'Pero en realidad no "me" **gusta** el fútbol'
  },
  { // item 5 - interactive phrase w/ sound but w/o info text
    id: 'f',
    type: 'phrase',
    sound: { id: 'aa' },
    learnLanguageText: '"Eine" ((Woche)) besteht aus ((sieben Tagen)), **oder?**',
    displayLanguageText: '"One" week consists of seven days, **or not?**'
  },
  { // item 6 - interactive task w/o info text
    id: 'g',
    type: 'task',
    displayLanguageText: 'Vier Tage, **fünf** "Tage", ((sechs Tage))'
  },
  { // item 7 - empty phrase item w/ sound
    id: 'h',
    type: 'phrase',
    sound: { id: 'bb' },
    learnLanguageText: null,
    displayLanguageText: null
  }
];
