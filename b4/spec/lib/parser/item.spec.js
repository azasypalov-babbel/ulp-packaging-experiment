import parse from '../../../src/lib/parser/item';
import example from '../../fixtures/unparsed/item.json';

describe('Parser', () => {
  describe('Item', () => {
    test('maps the data in to correct format', () => {
      const item = parse(example);
      expect(item).toMatchSnapshot();
    });

    describe('Image and Sound id parsing', () => {
      test('keeps image and sound ids uuids', () => {
        const parsedItem = parse(example);

        expect(typeof parsedItem.image_id).toBe('string');
        expect(typeof parsedItem.sound_id).toBe('string');
      }
      );

      describe('when parsing more than one item', () => {
        const otherExample = Object.assign({}, example, {
          image: {
            id: 'another_image_uuid'
          },
          sound: {
            id: 'another_sound_uuid'
          }
        });

        test('generates unique values for image and sound ids', () => {
          const firstItem = parse(example);
          const secondItem = parse(otherExample);

          expect(firstItem.image_id).not.toBe(secondItem.image_id);
          expect(firstItem.sound_id).not.toBe(secondItem.sound_id);
        });
      });

      describe('when the same item is parsed twice', () => {
        test('uses a consistent id for images and sounds', () => {
          const firstParse = parse(example);
          const secondParse = parse(example);

          expect(firstParse.image_id).toBe(secondParse.image_id);
          expect(firstParse.sound_id).toBe(secondParse.sound_id);
        });
      });
    });

    describe('when image is null', () => {
      const exampleWithNoImage = {
        type: 'vocabulary',
        item_groups: [
          {
            items: [
              {
                id: '3194940',
                display_language_text: 'thank you',
                learn_language_text: 'merci',
                info_text: null,
                speaker_role: 'f1',
                type: 'phrase',
                image: null,
                sound: {
                  id: 14123
                }
              }
            ]
          }
        ]
      };

      test('maps it as image_id: null', () => {
        expect(parse(exampleWithNoImage).image_id).toBe(null);
      });
    });

    describe('when display_language_text is null', () => {
      const exampleWithNoDisplayLanguageText = {
        type: 'vocabulary',
        item_groups: [
          {
            items: [
              {
                id: '3194940',
                display_language_text: null,
                learn_language_text: 'merci',
                info_text: null,
                speaker_role: 'f1',
                type: 'phrase',
                image: null,
                sound: {
                  id: 14123
                }
              }
            ]
          }
        ]
      };

      test('maps it as l1_text: ""', () => {
        expect(parse(exampleWithNoDisplayLanguageText).l1_text).toBe('');
      });
    });

    describe('when info_text is null', () => {
      const exampleWithNoInfoText = {
        type: 'vocabulary',
        item_groups: [
          {
            items: [
              {
                id: '3194940',
                display_language_text: 'thank you',
                learn_language_text: 'merci',
                info_text: null,
                speaker_role: 'f1',
                type: 'phrase',
                image: null,
                sound: {
                  id: 14123
                }
              }
            ]
          }
        ]
      };

      test('maps it as info_text: ""', () => {
        expect(parse(exampleWithNoInfoText).l1_text).toBe('');
      });
    });

    describe('when sound is null', () => {
      const exampleWithNoSound = {
        type: 'vocabulary',
        item_groups: [
          {
            items: [
              {
                id: '3194940',
                display_language_text: 'thank you',
                learn_language_text: 'merci',
                info_text: null,
                speaker_role: 'f1',
                type: 'phrase',
                image: {
                  id: 12334234
                },
                sound: null
              }
            ]
          }
        ]
      };

      test('maps it as sound_id: null', () => {
        expect(parse(exampleWithNoSound).sound_id).toBe(null);
      });
    });

    describe('when speaker_role is null', () => {
      const exampleWithNoSound = {
        type: 'vocabulary',
        item_groups: [
          {
            items: [
              {
                id: '3194940',
                display_language_text: 'thank you',
                learn_language_text: 'merci',
                info_text: null,
                speaker_role: null,
                type: 'phrase',
                image: {
                  id: 12334234
                },
                sound: {
                  id: 12323
                }
              }
            ]
          }
        ]
      };

      test('maps it as speaker_role: null', () => {
        expect(parse(exampleWithNoSound).speaker_role).toBeNull();
      });
    });

    describe('when l1_text is null', () => {
      const exampleWithNoL1Text = {
        type: 'vocabulary',
        item_groups: [
          {
            items: [
              {
                id: '3194940',
                display_language_text: 'thank you',
                learn_language_text: null,
                info_text: null,
                speaker_role: null,
                type: 'phrase',
                image: {
                  id: 12334234
                },
                sound: {
                  id: 12323
                }
              }
            ]
          }
        ]
      };

      test('maps it as l1_text: ""', () => {
        expect(parse(exampleWithNoL1Text).l1_text).toBe('');
      });
    });

    describe('when l2_text is null', () => {
      const exampleWithNoL1Text = {
        type: 'vocabulary',
        item_groups: [
          {
            items: [
              {
                id: '3194940',
                display_language_text: null,
                learn_language_text: 'merci',
                info_text: null,
                speaker_role: null,
                type: 'phrase',
                image: {
                  id: 12334234
                },
                sound: {
                  id: 12323
                }
              }
            ]
          }
        ]
      };

      test('maps it as l2_text: ""', () => {
        expect(parse(exampleWithNoL1Text).l2_text).toBe('');
      });
    });
  });
});
