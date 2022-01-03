import example from '../../fixtures/unparsed/lesson.json';

const vocabularyParser = jest.fn();
const dictateParser = jest.fn();
const matchingParser = jest.fn();
const spokenreviewParser = jest.fn();

jest.doMock('../../../src/lib/parser/vocabulary', () => vocabularyParser);
jest.doMock('../../../src/lib/parser/dictate', () => dictateParser);
jest.doMock('../../../src/lib/parser/matching', () => matchingParser);
jest.doMock('../../../src/lib/parser/spokenreview', () => spokenreviewParser);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parse = require('../../../src/lib/parser/trainers').default;

describe('Parser', () => {
  describe('Trainers', () => {
    test('maps the data onto a different format', () => {
      expect(parse(example)).toMatchSnapshot();
    });

    describe('when the trainers collection includes a "vocabulary" trainer', () => {
      const vocabularyTrainer = { type: 'vocabulary' };
      const lesson = {
        lesson: {
          trainers: [
            vocabularyTrainer
          ]
        }
      };

      beforeEach(() => parse(lesson));

      test('parses that trainer using the vocabulary parser', () => {
        expect(vocabularyParser).toHaveBeenCalledWith(vocabularyTrainer);
      });
    });

    describe('when the trainers collection includes a "dictate" trainer', () => {
      const dictateTrainer = { type: 'dictate' };
      const lesson = {
        lesson: {
          trainers: [
            dictateTrainer
          ]
        }
      };

      beforeEach(() => parse(lesson));

      test('parses that trainer using the dictate parser', () => {
        expect(dictateParser).toHaveBeenCalledWith(dictateTrainer);
      });
    });

    describe('when the trainers collection includes a "matching" trainer', () => {
      const matchingTrainer = { type: 'matching' };
      const lesson = {
        lesson: {
          trainers: [
            matchingTrainer
          ]
        }
      };

      beforeEach(() => parse(lesson));

      test('parses that trainer using the matching parser', () => {
        expect(matchingParser).toHaveBeenCalledWith(matchingTrainer);
      });
    });

    describe('when the review collection includes a "spokenreview" trainer', () => {
      const spokenreviewTrainer = { type: 'spokenreview' };
      const lesson = {
        lesson: {
          trainers: [
            spokenreviewTrainer
          ]
        }
      };

      beforeEach(() => parse(lesson));

      test('parses that trainer using the spokenreview parser', () => {
        expect(spokenreviewParser).toHaveBeenCalledWith(spokenreviewTrainer);
      });
    });
  });
});
