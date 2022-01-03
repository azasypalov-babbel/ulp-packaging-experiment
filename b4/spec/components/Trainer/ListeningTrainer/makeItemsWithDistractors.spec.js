import makeItemsWithDistractors, {
  applyGroupingStrategy
} from '../../../../src/components/Trainer/ListeningTrainer/makeItemsWithDistractors';

describe('makeItemsWithDistractors', () => {
  test('returns a list of distractors and items', () => {
    const items = [
      { learnLanguageText: 'a' },
      { learnLanguageText: 'bazbaz' },
      { learnLanguageText: 'bc' },
      { learnLanguageText: 'def' }
    ];
    expect(makeItemsWithDistractors(items)).toEqual([
      {
        distractors: [{ learnLanguageText: 'bazbaz' }, { learnLanguageText: 'bc' }, { learnLanguageText: 'def' }],
        item: { learnLanguageText: 'a' }
      },
      {
        distractors: [{ learnLanguageText: 'a' }, { learnLanguageText: 'bc' }, { learnLanguageText: 'def' }],
        item: { learnLanguageText: 'bazbaz' }
      },
      {
        distractors: [{ learnLanguageText: 'a' }, { learnLanguageText: 'bazbaz' }, { learnLanguageText: 'def' }],
        item: { learnLanguageText: 'bc' }
      },
      {
        distractors: [{ learnLanguageText: 'a' }, { learnLanguageText: 'bazbaz' }, { learnLanguageText: 'bc' }],
        item: { learnLanguageText: 'def' }
      }
    ]);
  });
});

describe('applyGroupingStrategy', () => {
  describe('when accepts less than 6 items', () => {
    test('returns the same items in an array', () => {
      const items = [
        { learnLanguageText: 'die Stadt' },
        { learnLanguageText: 'die Straße' },
        { learnLanguageText: 'die Brötchen' }
      ];

      expect(applyGroupingStrategy(items)).toMatchObject([items]);
    });
  });

  describe('when accepts 6 items', () => {
    test('returns an array of 2 arrays with 3 items in each, sorted by character length', () => {
      const items = [
        { learnLanguageText: 'die Stadt' },
        { learnLanguageText: 'die Straße' },
        { learnLanguageText: 'die Brötchen' },
        { learnLanguageText: 'etwas' },
        { learnLanguageText: 'die Hand' },
        { learnLanguageText: 'die Fahrradhandschuhe' }
      ];

      expect(applyGroupingStrategy(items)).toMatchObject([
        items.slice(0, 3),
        items.slice(3)
      ]);
    });
  });

  describe('when accepts less than 9 items', () => {
    test('returns an array of 2 arrays with max 4 items in each, sorted by character length', () => {
      const items = [
        { learnLanguageText: 'die Stadt' },
        { learnLanguageText: 'die Straße' },
        { learnLanguageText: 'die Brötchen' },
        { learnLanguageText: 'etwas' },
        { learnLanguageText: 'die Hand' },
        { learnLanguageText: 'die Fahrradhandschuhe' },
        { learnLanguageText: 'die Ausländerbehörde' }
      ];

      expect(applyGroupingStrategy(items)).toEqual([
        [
          { learnLanguageText: 'etwas' },
          { learnLanguageText: 'die Hand' },
          { learnLanguageText: 'die Stadt' },
          { learnLanguageText: 'die Straße' }
        ],
        [
          { learnLanguageText: 'die Brötchen' },
          { learnLanguageText: 'die Ausländerbehörde' },
          { learnLanguageText: 'die Fahrradhandschuhe' }
        ]
      ]);
    });
  });

  describe('when accepts more than 10 items', () => {
    describe('when accepts 10', () => {
      test('returns 2 groups with 5 sorted items in each, sorted by character length', () => {
        const items = [
          { learnLanguageText: 'die Stadt' },
          { learnLanguageText: 'die Straße' },
          { learnLanguageText: 'die Brötchen' },
          { learnLanguageText: 'etwas' },
          { learnLanguageText: 'die Hand' },
          { learnLanguageText: 'die Fahrradhandschuhe' },
          { learnLanguageText: 'die Ausländerbehörde' },
          { learnLanguageText: 'die Süßigkeit' },
          { learnLanguageText: 'Schatz' },
          { learnLanguageText: 'Tja' }
        ];

        expect(applyGroupingStrategy(items)).toEqual([
          [
            { learnLanguageText: 'Tja' },
            { learnLanguageText: 'etwas' },
            { learnLanguageText: 'Schatz' },
            { learnLanguageText: 'die Hand' },
            { learnLanguageText: 'die Stadt' }
          ],
          [
            { learnLanguageText: 'die Straße' },
            { learnLanguageText: 'die Brötchen' },
            { learnLanguageText: 'die Süßigkeit' },
            { learnLanguageText: 'die Ausländerbehörde' },
            { learnLanguageText: 'die Fahrradhandschuhe' }
          ]
        ]);
      });
    });

    describe('when accepts 11', () => {
      test('returns 3 groups with max 4 items in it, sorted by character length', () => {
        const items = [
          { learnLanguageText: 'die Stadt' },
          { learnLanguageText: 'die Straße' },
          { learnLanguageText: 'die Brötchen' },
          { learnLanguageText: 'etwas' },
          { learnLanguageText: 'die Hand' },
          { learnLanguageText: 'die Fahrradhandschuhe' },
          { learnLanguageText: 'die Ausländerbehörde' },
          { learnLanguageText: 'die Süßigkeit' },
          { learnLanguageText: 'Schatz' },
          { learnLanguageText: 'Tja' },
          { learnLanguageText: 'oder' }
        ];
        expect(applyGroupingStrategy(items)).toEqual([
          [
            { learnLanguageText: 'Tja' },
            { learnLanguageText: 'oder' },
            { learnLanguageText: 'etwas' },
            { learnLanguageText: 'Schatz' }
          ],
          [
            { learnLanguageText: 'die Hand' },
            { learnLanguageText: 'die Stadt' },
            { learnLanguageText: 'die Straße' },
            { learnLanguageText: 'die Brötchen' }
          ],
          [
            { learnLanguageText: 'die Süßigkeit' },
            { learnLanguageText: 'die Ausländerbehörde' },
            { learnLanguageText: 'die Fahrradhandschuhe' }
          ]
        ]);
      });
    });

    describe('when accepts 12', () => {
      test('returns 3 groups with max 4 items in it, sorted by character length', () => {
        const items = [
          { learnLanguageText: 'die Stadt' },
          { learnLanguageText: 'die Straße' },
          { learnLanguageText: 'die Brötchen' },
          { learnLanguageText: 'etwas' },
          { learnLanguageText: 'die Hand' },
          { learnLanguageText: 'die Fahrradhandschuhe' },
          { learnLanguageText: 'die Ausländerbehörde' },
          { learnLanguageText: 'die Süßigkeit' },
          { learnLanguageText: 'Schatz' },
          { learnLanguageText: 'Tja' },
          { learnLanguageText: 'oder' },
          { learnLanguageText: 'alles' }
        ];
        expect(applyGroupingStrategy(items)).toEqual([
          [
            { learnLanguageText: 'Tja' },
            { learnLanguageText: 'oder' },
            { learnLanguageText: 'etwas' },
            { learnLanguageText: 'alles' }
          ],
          [
            { learnLanguageText: 'Schatz' },
            { learnLanguageText: 'die Hand' },
            { learnLanguageText: 'die Stadt' },
            { learnLanguageText: 'die Straße' }
          ],
          [
            { learnLanguageText: 'die Brötchen' },
            { learnLanguageText: 'die Süßigkeit' },
            { learnLanguageText: 'die Ausländerbehörde' },
            { learnLanguageText: 'die Fahrradhandschuhe' }
          ]
        ]);
      });
    });

    describe('when accepts 13', () => {
      test('returns 3 groups with max 5 items in it, sorted by character length', () => {
        const items = [
          { learnLanguageText: 'die Stadt' },
          { learnLanguageText: 'die Straße' },
          { learnLanguageText: 'die Brötchen' },
          { learnLanguageText: 'etwas' },
          { learnLanguageText: 'die Hand' },
          { learnLanguageText: 'die Ausländerbehörde' },
          { learnLanguageText: 'die Fahrradhandschuhe' },
          { learnLanguageText: 'die Süßigkeit' },
          { learnLanguageText: 'Schatz' },
          { learnLanguageText: 'Tja' },
          { learnLanguageText: 'oder' },
          { learnLanguageText: 'alles' },
          { learnLanguageText: 'die Süßigkeit' }
        ];
        expect(applyGroupingStrategy(items)).toEqual([
          [
            { learnLanguageText: 'Tja' },
            { learnLanguageText: 'oder' },
            { learnLanguageText: 'etwas' },
            { learnLanguageText: 'alles' },
            { learnLanguageText: 'Schatz' }
          ],
          [
            { learnLanguageText: 'die Hand' },
            { learnLanguageText: 'die Stadt' },
            { learnLanguageText: 'die Straße' },
            { learnLanguageText: 'die Brötchen' },
            { learnLanguageText: 'die Süßigkeit' }
          ],
          [
            { learnLanguageText: 'die Süßigkeit' },
            { learnLanguageText: 'die Ausländerbehörde' },
            { learnLanguageText: 'die Fahrradhandschuhe' }
          ]
        ]);
      });
    });

    describe('when accepts 15', () => {
      test('returns 3 groups with 5 sorted items in each, sorted by character length', () => {
        const items = [
          { learnLanguageText: 'die Stadt' },
          { learnLanguageText: 'die Straße' },
          { learnLanguageText: 'die Brötchen' },
          { learnLanguageText: 'etwas' },
          { learnLanguageText: 'die Hand' },
          { learnLanguageText: 'die Ausländerbehörde' },
          { learnLanguageText: 'die Fahrradhandschuhe' },
          { learnLanguageText: 'die Süßigkeit' },
          { learnLanguageText: 'Schatz' },
          { learnLanguageText: 'Tja' },
          { learnLanguageText: 'die Straße' },
          { learnLanguageText: 'die Brötchen' },
          { learnLanguageText: 'die Ausländerbehörde' },
          { learnLanguageText: 'die Süßigkeit' },
          { learnLanguageText: 'Schatz' }
        ];
        expect(applyGroupingStrategy(items)).toEqual([
          [
            { learnLanguageText: 'Tja' },
            { learnLanguageText: 'etwas' },
            { learnLanguageText: 'Schatz' },
            { learnLanguageText: 'Schatz' },
            { learnLanguageText: 'die Hand' }
          ],
          [
            { learnLanguageText: 'die Stadt' },
            { learnLanguageText: 'die Straße' },
            { learnLanguageText: 'die Straße' },
            { learnLanguageText: 'die Brötchen' },
            { learnLanguageText: 'die Brötchen' }
          ],
          [
            { learnLanguageText: 'die Süßigkeit' },
            { learnLanguageText: 'die Süßigkeit' },
            { learnLanguageText: 'die Ausländerbehörde' },
            { learnLanguageText: 'die Ausländerbehörde' },
            { learnLanguageText: 'die Fahrradhandschuhe' }
          ]
        ]);
      });
    });
  });
});
