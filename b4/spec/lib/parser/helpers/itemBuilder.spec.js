import { titleItem, descriptionItem } from '../../../../src/lib/parser/helpers/itemBuilder';

describe('itemBuilder', () => {
  describe('#titleItem', () => {
    const titleText = 'i am the title';
    const { type, l1_text: l1Text } = titleItem(titleText);

    test('gives an object with attribute "type" as "title"', () => {
      expect(type).toBe('title');
    });

    test('gives an object with attribute "l1_text" as the title text', () => {
      expect(l1Text).toBe(titleText);
    });
  });

  describe('#descriptionItem', () => {
    const descriptionText = 'i am the description';
    const { type, l1_text: l1Text } = descriptionItem(descriptionText);

    test('gives an object with attribute "type" as "description"', () => {
      expect(type).toBe('description');
    });

    test(
      'gives an object with attribute "l1_text" as the description text',
      () => {
        expect(l1Text).toBe(descriptionText);
      }
    );
  });
});
