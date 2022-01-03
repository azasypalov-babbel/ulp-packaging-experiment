import prepareTrainersForPurge from '../../../src/lib/purgeFormatters/prepareTrainersForPurge';
import applyPurgeFormatter from '../../../src/lib/purgeFormatters/applyPurgeFormatter';

jest.mock('../../../src/lib/purgeFormatters/applyPurgeFormatter');

describe('#prepareTrainersForPurge', () => {
  test('calls applyPurgeFormatter for each trainer', () => {
    prepareTrainersForPurge([{ id: 1 }, { id: 2 }]);

    expect(applyPurgeFormatter).toHaveBeenCalledTimes(2);
  });

  describe('when all trainers have items to purge', () => {
    test('returns all trainers', () => {
      const trainers = [{ type: 'to-purge' }, { type: 'to-purge' }];

      applyPurgeFormatter.mockImplementation((trainer) => {
        if (trainer.type === 'to-purge') return trainer;
      });

      expect(prepareTrainersForPurge(trainers)).toMatchObject(trainers);
    });
  });

  describe('when only some trainers have items to purge', () => {
    test('returns only the trainers with items to purge', () => {
      const trainers = [{ type: 'to-purge' }, { type: 'not-to-purge' }];

      applyPurgeFormatter.mockImplementation((trainer) => {
        if (trainer.type === 'to-purge') return trainer;
      });

      expect(prepareTrainersForPurge(trainers)).toMatchObject([{ type: 'to-purge' }]);
    });
  });

  describe('when there are no trainers with items to purge', () => {
    test('returns an empty array', () => {
      const trainers = [{ type: 'not-to-purge' }, { type: 'not-to-purge' }];

      applyPurgeFormatter.mockImplementation((trainer) => {
        if (trainer.type === 'to-purge') return trainer;
      });

      expect(prepareTrainersForPurge(trainers)).toMatchObject([]);
    });
  });
});
