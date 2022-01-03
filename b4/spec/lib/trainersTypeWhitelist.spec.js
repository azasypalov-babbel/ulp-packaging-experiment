import { createWhitelistTrainersFilter } from '../../src/lib/trainersTypeWhitelist';

const WHITELISTED_TRAINER = {
  name: 'Whitelisted Trainer Type',
  type: 'vocabulary',
  interaction: 'show',
  dictate: false,
  puzzle_helper: false
};

const NOT_WHITELISTED_TRAINER = {
  name: 'Not-Whitelisted Trainer Type',
  type: 'vocabulary',
  interaction: 'show',
  dictate: false,
  puzzle_helper: true
};


describe('trainersTypeWhitelist', () => {
  const trainersTypeWhitelist = createWhitelistTrainersFilter([WHITELISTED_TRAINER]);

  describe('#logging', () => {
    const loggingCallback = jest.fn();
    const filterTrainerTypes = trainersTypeWhitelist(loggingCallback);
    beforeEach(() => loggingCallback.mockClear());

    it('should not been called for whitelisted trainer type', () => {
      filterTrainerTypes([WHITELISTED_TRAINER]);
      expect(loggingCallback).not.toHaveBeenCalledWith(WHITELISTED_TRAINER);
    });

    it('should have been called with not-whitelisted trainer type', () => {
      filterTrainerTypes([NOT_WHITELISTED_TRAINER]);
      expect(loggingCallback).toHaveBeenCalledWith(NOT_WHITELISTED_TRAINER);
    });
  });

  describe('#filtering', () => {
    const filterTrainerTypes = trainersTypeWhitelist(jest.fn());
    it('should omit not-whitelisted trainer types and only return whitelisted ones', () => {
      expect(filterTrainerTypes([WHITELISTED_TRAINER, NOT_WHITELISTED_TRAINER])).toEqual(
        expect.arrayContaining([WHITELISTED_TRAINER])
      );
    });
  });
});
