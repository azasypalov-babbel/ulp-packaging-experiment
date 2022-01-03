import { identity } from 'underscore';

import rollbar from '../../services/rollbarService';

import vocabulary from './vocabulary';
import dictate from './dictate';
import matching from './matching';
import spokenreview from './spokenreview';
import comprehension from './comprehension';

const trainerParserMap = {
  vocabulary,
  dictate,
  matching,
  spokenreview,
  comprehension
};

function parserForType(type) {
  let parser = trainerParserMap[type];

  if (!parser) {
    rollbar.warning(`Unmapped trainer type: ${type}`);
    parser = identity;
  }

  return parser;
}

export function parseTrainer(trainer) {
  return parserForType(trainer.type)(trainer);
}

export default function({ lesson }) {
  return {
    lesson: {
      id: lesson.id,
      trainers: lesson.trainers.map(parseTrainer)
    }
  };
}
