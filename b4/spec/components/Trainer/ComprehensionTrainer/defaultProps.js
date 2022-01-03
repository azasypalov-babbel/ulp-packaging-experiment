export const contentItems = [
  {
    id: 'e',
    type: 'phrase',
    sound: { id: '123' },
    learnLanguageText: 'But "I" actually don\'t **like** football',
    displayLanguageText: 'Pero en realidad no "me" **gusta** el fútbol'
  },
  {
    id: 'f',
    type: 'phrase',
    sound: { id: '456' },
    learnLanguageText: '"Eine" ((Woche)) besteht aus ((sieben Tagen)), **oder?**',
    displayLanguageText: '"One" week consists of seven days, **or not?**'
  },
  {
    id: '13b0b14cdeb9b331c0553ce7b3733d3c',
    type: 'phrase',
    displayLanguageText: 'My neighbor Toroto is really big.',
    learnLanguageText:
      'M((e|*ei|ie))n Nachbar Totoro ist wirklich (("klein"|***groß**|*cl**i**ck here|**w"inzi"g**)).',
    info_text: null,
    image: null,
    sound: { id: '789' },
    speaker_role: 'f1'
  }
];
export const questionsItems = [
  {
    id: '1ef8bf3eeb1af44bb7f6006f0900f987',
    type: 'task',
    displayLanguageText:
      'What kind of game do they play? ((a computer game|*a card game|a board game))',
    learnLanguageText: null,
    info_text: null,
    image: null,
    sound: null,
    speaker_role: null
  }
];
export const props = {
  onAllItemsComplete: jest.fn(),
  items: contentItems,
  title: 'Comprehension Test'
};
