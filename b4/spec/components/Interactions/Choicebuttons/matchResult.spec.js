import { matchResult } from '../../../../src/components/Interactions/Choicebuttons/matchResult';
import { RESULTS } from '../../../../src/lib/matchingUtils/evaluate';

describe('matchResult', () => {
  describe('when it is correct', () => {
    describe('when it has more than one solution', () => {
      it('returns', () => {
        expect.assertions(1);
        return expect(matchResult({
          targetTexts: ['Ich', 'Du'],
          text: 'Du'
        })).resolves.toEqual({
          text: 'Du',
          inputText: 'Du',
          feedbackType: RESULTS.CORRECT,
          solved: true
        });
      });
    });

    describe('when it has one solution', () => {
      it('returns', () => {
        expect.assertions(1);
        return expect(matchResult({
          targetTexts: ['Ich'],
          text: 'Ich'
        })).resolves.toEqual({
          text: 'Ich',
          inputText: 'Ich',
          feedbackType: RESULTS.CORRECT,
          solved: true
        });
      });
    });
  });

  describe('when it is not correct', () => {
    it('returns', () => {
      expect.assertions(1);
      return expect(matchResult({
        targetTexts: ['So'],
        text: 'Ich'
      })).resolves.toEqual({
        text: 'So',
        inputText: 'Ich',
        feedbackType: RESULTS.INCORRECT,
        solved: false
      });
    });
  });
});

