import * as catServices from '../../src/services/lesson/cat';
import * as lessonServices from '../../src/services/lesson/default';

describe('CAT Lesson Service', () => {
  describe('#moduleExports', () => {
    test('it exports the same methods as the "regular" lesson service', () => {
      expect(Object.keys(catServices.default)).toEqual(Object.keys(lessonServices.default));
    });
  });
});

