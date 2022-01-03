import { matchResult } from '../../../../src/components/Interactions/Wordorder/matchResult';
import { RESULTS } from '../../../../src/lib/matchingUtils/evaluate';

describe('validating wordorder attempts', () => {
  it('should mark correct answers as solved', () => {
    const payload = {
      targetTexts: ['That'],
      text: 'That',
      learnLanguageAlpha3: 'DEU'
    };
    return matchResult(payload).then((result) => {
      expect(result.solved).toBe(true);
      expect(result.feedbackType).toBe(RESULTS.CORRECT);
      expect(result.text).toBe('That');
      expect(result.inputText).toBe('That');
    });
  });

  it('should incorrect answers as unsolved', () => {
    const payload = {
      targetTexts: ['Than'],
      text: 'That',
      learnLanguageAlpha3: 'DEU'
    };
    return matchResult(payload).then((result) => {
      expect(result.solved).toBe(false);
      expect(result.feedbackType).toBe(RESULTS.INCORRECT);
      expect(result.text).toBe('Than');
      expect(result.inputText).toBe('That');
    });
  });
});
