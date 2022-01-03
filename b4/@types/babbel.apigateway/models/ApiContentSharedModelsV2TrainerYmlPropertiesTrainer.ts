/* eslint-disable camelcase */
import type { ApiContentSharedModelsItemGroupYmlPropertiesItemGroup } from './ApiContentSharedModelsItemGroupYmlPropertiesItemGroup';

export type ApiContentSharedModelsV2TrainerYmlPropertiesTrainer = {
  dictate: boolean;
  image: {
    id: string;
  };
  interaction: ApiContentSharedModelsV2TrainerYmlPropertiesTrainer.interaction;
  item_groups: Array<ApiContentSharedModelsItemGroupYmlPropertiesItemGroup>;
  puzzle_helper: boolean;
  title: string;
  translation_visibility: ApiContentSharedModelsV2TrainerYmlPropertiesTrainer.translation_visibility;
  type: ApiContentSharedModelsV2TrainerYmlPropertiesTrainer.type;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ApiContentSharedModelsV2TrainerYmlPropertiesTrainer {
  export enum interaction {
    CHOOSE = 'choose',
    CLICK = 'click',
    SHOW = 'show',
    SORT = 'sort',
    SPEAK = 'speak',
    WORDORDER = 'wordorder',
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
    DIALOG = 'dialog',
    DICTATE = 'dictate',
    KEYBOARD = 'keyboard',
    MATCHING = 'matching',
    VOCABULARY = 'vocabulary'
  }
}
/* eslint-enable camelcase */
