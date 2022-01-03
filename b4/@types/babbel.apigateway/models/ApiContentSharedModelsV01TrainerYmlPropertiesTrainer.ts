/* eslint-disable camelcase */
import type { ApiContentSharedModelsItemGroupYmlPropertiesItemGroup } from './ApiContentSharedModelsItemGroupYmlPropertiesItemGroup';

export type ApiContentSharedModelsV01TrainerYmlPropertiesTrainer = {
  dictate: boolean;
  image: {
    id: string;
  };
  interaction: ApiContentSharedModelsV01TrainerYmlPropertiesTrainer.interaction;
  item_groups: Array<ApiContentSharedModelsItemGroupYmlPropertiesItemGroup>;
  puzzle_helper: boolean;
  title: string;
  translation_visibility: ApiContentSharedModelsV01TrainerYmlPropertiesTrainer.translation_visibility;
  type: ApiContentSharedModelsV01TrainerYmlPropertiesTrainer.type;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ApiContentSharedModelsV01TrainerYmlPropertiesTrainer {
  export enum interaction {
    CHOOSE = 'choose',
    SHOW = 'show',
    SORT = 'sort',
    SPEAK = 'speak',
    WRITE = 'write'
  }
  export enum translation_visibility {
    FULL = 'full',
    PARTIAL = 'partial',
    NONE = 'none'
  }
  export enum type {
    CARD = 'card',
    COMPREHENSION = 'comprehension',
    CONJUGATION = 'conjugation',
    CUBE = 'cube',
    DIALOG = 'dialog',
    DICTATE = 'dictate',
    GROUPSORT = 'groupsort',
    KEYBOARD = 'keyboard',
    MATCHING = 'matching',
    MEMORY = 'memory',
    SORTLIST = 'sortlist',
    TABLE = 'table',
    TEXTDICTATE = 'textdictate',
    VOCABULARY = 'vocabulary',
    WORDORDER = 'wordorder',
    WRITINGEXERCISE = 'writingexercise'
  }
}
/* eslint-enable camelcase */
