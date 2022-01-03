/* eslint-disable camelcase */
import type { ApiContentSharedModelsItemGroupYmlPropertiesItemGroup } from './ApiContentSharedModelsItemGroupYmlPropertiesItemGroup';

export type ApiContentSharedModelsV1TrainerYmlPropertiesTrainer = {
  dictate: boolean;
  image: {
    id: string;
  };
  interaction: ApiContentSharedModelsV1TrainerYmlPropertiesTrainer.interaction;
  item_groups: Array<ApiContentSharedModelsItemGroupYmlPropertiesItemGroup>;
  puzzle_helper: boolean;
  title: string;
  translation_visibility: ApiContentSharedModelsV1TrainerYmlPropertiesTrainer.translation_visibility;
  type: ApiContentSharedModelsV1TrainerYmlPropertiesTrainer.type;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ApiContentSharedModelsV1TrainerYmlPropertiesTrainer {
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
    CUBE = 'cube',
    DIALOG = 'dialog',
    DICTATE = 'dictate',
    KEYBOARD = 'keyboard',
    MATCHING = 'matching',
    MEMORY = 'memory',
    VOCABULARY = 'vocabulary',
    WORDORDER = 'wordorder'
  }
}
/* eslint-enable camelcase */
