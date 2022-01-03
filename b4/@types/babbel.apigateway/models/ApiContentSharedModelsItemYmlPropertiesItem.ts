/* eslint-disable camelcase */
export type ApiContentSharedModelsItemYmlPropertiesItem = {
  display_language_text: string;
  id: string;
  image: {
    id: string;
  };
  info_text: string;
  learn_language_text: string;
  sound: {
    id: string;
  };
  speaker_role: ApiContentSharedModelsItemYmlPropertiesItem.speaker_role;
  type: ApiContentSharedModelsItemYmlPropertiesItem.type;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ApiContentSharedModelsItemYmlPropertiesItem {
  export enum speaker_role {
    NONE = 'None',
    N1 = 'N1',
    M1 = 'M1',
    M2 = 'M2',
    F1 = 'F1',
    F2 = 'F2'
  }
  export enum type {
    PHRASE = 'phrase',
    TASK = 'task'
  }
}
/* eslint-enable camelcase */
