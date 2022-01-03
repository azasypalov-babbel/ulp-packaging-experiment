import applyPurgeFormatter from './applyPurgeFormatter';

const prepareTrainersForPurge = (trainers) => {
  return trainers.reduce((acc, trainer) => {
    const formattedTrainer = applyPurgeFormatter(trainer);

    if (formattedTrainer) {
      return acc.concat(formattedTrainer);
    } else {
      return acc;
    }
  }, []);
};

export default prepareTrainersForPurge;

