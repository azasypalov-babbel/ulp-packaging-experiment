import { hasGap } from '@lessonnine/babbel-markup-helper.js';
import { isInteractive, isPhrase, isTask } from '../../../src/components/shared/itemSelectors';

jest.mock('@lessonnine/babbel-markup-helper.js');

const items = [
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

describe('formatItems', () => {
  describe('#isTask', () => {
    it('recognizes tasks', () => {
      expect(isTask(items[0])).toBeFalsy();
      expect(isTask(items[1])).toBeTruthy();
      expect(isTask(items[2])).toBeFalsy();
      expect(isTask(items[3])).toBeTruthy();
    });
  });

  describe('#isPhrase', () => {
    it('recognizes phrases', () => {
      expect(isPhrase(items[0])).toBeTruthy();
      expect(isPhrase(items[1])).toBeFalsy();
      expect(isPhrase(items[2])).toBeTruthy();
      expect(isPhrase(items[3])).toBeFalsy();
    });
  });

  describe('#isInteractive', () => {
    const defaultItem = {
      displayLanguageText: null,
      learnLanguageText: null
    };
    afterEach(() => {
      hasGap.mockRestore();
    });
    describe('!item.nonInteractive', () => {
      const item = {
        ...defaultItem,
        nonInteractive: false
      };
      describe('hasGap', () => {
        beforeEach(() => {
          hasGap.mockReturnValue(true);
        });
        describe('displayLanguageText is of type string', () => {
          it('is interactive', () => {
            expect(isInteractive({ ...item, displayLanguageText: 'hello' })).toBeTruthy();
          });
        });
        describe('learnLanguageText is of type string', () => {
          it('is interactive', () => {
            expect(isInteractive({ ...item, learnLanguageText: 'hello' })).toBeTruthy();
          });
        });
        describe('both displayLanguageText and learnLanguageText are null', () => {
          it('is not interactive', () => {
            expect(isInteractive(item)).toBeFalsy();
          });
        });
      });

      describe('does not have a gap', () => {
        beforeEach(() => {
          hasGap.mockReturnValue(false);
        });
        describe('displayLanguageText is of type string', () => {
          it('is not interactive', () => {
            expect(isInteractive({ ...item, displayLanguageText: 'hello' })).toBeFalsy();
            expect(hasGap).toBeCalledWith('hello');
          });
        });
        describe('learnLanguageText is of type string', () => {
          it('is not interactive', () => {
            expect(isInteractive({ ...item, learnLanguageText: 'hello' })).toBeFalsy();
            expect(hasGap).toBeCalledWith('hello');
          });
        });
        describe('both displayLanguageText and learnLanguageText are null', () => {
          it('is not interactive', () => {
            expect(isInteractive(item)).toBeFalsy();
            expect(hasGap).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('item.nonInteractive', () => {
      const item = {
        ...defaultItem,
        nonInteractive: true
      };
      describe('hasGap', () => {
        beforeEach(() => {
          hasGap.mockReturnValue(true);
        });
        describe('displayLanguageText is of type string', () => {
          it('is not interactive', () => {
            expect(isInteractive({ ...item, displayLanguageText: 'hello' })).toBeFalsy();
            expect(hasGap).not.toHaveBeenCalled();
          });
        });
        describe('learnLanguageText is of type string', () => {
          it('is not interactive', () => {
            expect(isInteractive({ ...item, learnLanguageText: 'hello' })).toBeFalsy();
            expect(hasGap).not.toHaveBeenCalled();
          });
        });
        describe('both displayLanguageText and learnLanguageText are null', () => {
          it('is not interactive', () => {
            expect(isInteractive(item)).toBeFalsy();
            expect(hasGap).not.toHaveBeenCalled();
          });
        });
      });

      describe('does not have a gap', () => {
        describe('displayLanguageText is of type string', () => {
          it('is not interactive', () => {
            expect(isInteractive({ ...item, displayLanguageText: 'hello' })).toBeFalsy();
            expect(hasGap).not.toHaveBeenCalled();
          });
        });
        describe('learnLanguageText is of type string', () => {
          it('is not interactive', () => {
            expect(isInteractive({ ...item, learnLanguageText: 'hello' })).toBeFalsy();
            expect(hasGap).not.toHaveBeenCalled();
          });
        });
        describe('both displayLanguageText and learnLanguageText are null', () => {
          it('is not interactive', () => {
            expect(isInteractive(item)).toBeFalsy();
            expect(hasGap).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
