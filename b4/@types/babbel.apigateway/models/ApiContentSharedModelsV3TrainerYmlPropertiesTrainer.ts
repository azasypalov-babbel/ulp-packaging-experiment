/* eslint-disable camelcase */
import type { ApiContentSharedModelsItemGroupYmlPropertiesItemGroup } from './ApiContentSharedModelsItemGroupYmlPropertiesItemGroup';

export type ApiContentSharedModelsV3TrainerYmlPropertiesTrainer = {
  dictate: boolean;
  image: {
    id: string;
  };
  interaction: ApiContentSharedModelsV3TrainerYmlPropertiesTrainer.interaction;
  item_groups: Array<ApiContentSharedModelsItemGroupYmlPropertiesItemGroup>;
  puzzle_helper?: boolean;
  title: string;
  translation_visibility: ApiContentSharedModelsV3TrainerYmlPropertiesTrainer.translation_visibility;
  type: ApiContentSharedModelsV3TrainerYmlPropertiesTrainer.type;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ApiContentSharedModelsV3TrainerYmlPropertiesTrainer {
  export enum interaction {
    CHOOSE = 'choose',
    CLICK = 'click',
    PUZZLEHELPER = 'puzzlehelper',
    SHOW = 'show',
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
