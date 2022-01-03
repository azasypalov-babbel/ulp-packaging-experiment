/* eslint-disable camelcase, max-len */
export const inputLessonDataVocabularyFillin = {
  trainers: [
    {
      type: 'vocabulary',
      interaction: 'fillin',
      dictate: false,
      puzzle_helper: false,
      translation_visibility: 'partial',
      title: 'totall bro*ken {{title',
      description: 'this description really "could** also" be** better',
      image: 'link/to/foo/image.jpg',
      item_groups: [
        {
          title: null,
          image: null,
          items: [
            {
              id: '2171a03dec0c9696a3a906bbcfa7f362',
              type: 'phrase',
              display_language_text: '**the hi{biscus**',
              learn_language_text: 'er sah den Film "der gelbe ((*Hibiskus))" und war begeistert!',
              info_text: 'Den **Hibiskus** gibt es)) in "vielen" Farben.',
              image: {
                id: '1e0003f2a2f094a9ba700ca37cdacaa8'
              },
              sound: {
                id: 'd3572193477785b1bc030cdf61ec777c'
              },
              speaker_role: 'f1'
            }
          ]
        }
      ]
    }
  ]
};

export const inputLessonDataMatchingType2 = {
  trainers: [
    { // trainer 1
      item_groups: [
      ]
    },
    { // trainer 2
      type: 'matching',
      translation_visibility: 'partial',
      interaction: 'choose',
      dictate: false,
      puzzle_helper: false,
      title: null,
      description: 'This is matching trainer - type 2',
      image: 'matching-image.gif',
      item_groups: [
        {
          title: null,
          image: null,
          items: [
            { // item 1 (error in part before _)
              id: '162d2e047d4a2badc81e00aa574b15e0',
              type: 'phrase',
              display_language_text: 'fruit exists in many colors',
              learn_language_text: '**Obst "gibt es** in vielen" =_Farben',
              info_text: 'rot, gelb, grün - musste ((alle)) essen',
              image: null,
              sound: {
                id: 'd3572193477785b1bc030cdf61ec777c'
              },
              speaker_role: 'm1'
            },
            { // item 2 (error in part after _)
              id: '30b1059fa1c1a0578fdd61f4a9d45875',
              type: 'phrase',
              display_language_text: 'vegetables are (also)) colorful',
              learn_language_text: 'Gemüse ist auch =_*bunt',
              info_text: 'und davon musst du auch "jeden tag" essen, namnamnam!',
              image: null,
              sound: {
                id: 'd3572193477785b1bc030cdf61ec777c'
              },
              speaker_role: 'm1'
            }
          ]
        }
      ]
    }
  ]
};

export const inputReviewData = {
  trainers: [
    {
      type: 'cube',
      interaction: 'write',
      puzzle_helper: false,
      dictate: false,
      translation_visibility: 'full',
      title: 'Do **you remember these words in German?',
      image: 'review-image.jpeg',
      item_groups: [
        {
          title: null,
          image: null,
          items: [
            {
              id: '3206489c621eea45a319cae445aa45d5',
              display_language_text: '(I) {{l**ike} "the" **small** town',
              learn_language_text: '(Ich) {mag*} "die" **kleine** ((*Stadt)) {Stadt}',
              info_text: 'another ** wrong info "text" (foo))',
              speaker_role: 'M1',
              type: 'phrase',
              image: {
                id: '83da55c815dee0eabb391c4d59a34ba6'
              },
              sound: {
                id: '28dd66682b5befa4ecfdab862ceaf913'
              }
            }
          ]
        }
      ]
    }
  ]
};

export const expectedRollbarData = {
  // from inital_review_items
  reviewItemError: {
    message: 'Invalid markup found in item (review)',
    data: {
      error_type: 'item level errors',
      errors: [
        {
          incorrect_field: 'display_language_text',
          incorrect_text: '(I) {{l**ike} "the" **small** town',
          parser_error_message: 'expected plain text but found the symbol \'{\' which is reserved. Did you mean to escape it \'\\{\'?'
        },
        {
          incorrect_field: 'learn_language_text',
          incorrect_text: '(Ich) {mag*} "die" **kleine** ((*Stadt)) {Stadt}',
          parser_error_message: 'expected token \'}\' but found \'*\''
        },
        {
          incorrect_field: 'info_text',
          incorrect_text: 'another ** wrong info "text" (foo))',
          parser_error_message: 'expected token \'**\' but found \')\''
        }
      ],
      state_data: {
        content_uuid: 'REVIEW_DUE',
        learn_language_alpha3: 'DEU',
        locale: 'en'
      },
      trainer: {
        dictate: false,
        interaction: 'write',
        puzzle_helper: false,
        title: 'Do **you remember these words in German?',
        translation_visibility: 'full',
        type: 'cube'
      },
      item: {
        display_language_text: '(I) {{l**ike} "the" **small** town',
        id: '3206489c621eea45a319cae445aa45d5',
        learn_language_text: '(Ich) {mag*} "die" **kleine** ((*Stadt)) {Stadt}',
        type: 'phrase'
      }
    }
  },

  // from inital_review_items
  reviewTrainerError: {
    message: 'Invalid markup found in trainer (review)',
    data: {
      error_type: 'trainer level errors',
      errors: [
        {
          incorrect_field: 'title',
          incorrect_text: 'Do **you remember these words in German?',
          parser_error_message: 'expected token \'**\' but found \'\''
        }
      ],
      state_data: {
        content_uuid: 'REVIEW_DUE',
        learn_language_alpha3: 'DEU',
        locale: 'en'
      },
      trainer: {
        dictate: false,
        interaction: 'write',
        puzzle_helper: false,
        title: 'Do **you remember these words in German?',
        translation_visibility: 'full',
        type: 'cube'
      }
    }
  },

  // from vocabulary-fillin
  lessonTrainerErrorVocabularyFillin: {
    message: 'Invalid markup found in trainer (lesson)',
    data: {
      error_type: 'trainer level errors',
      errors: [
        {
          incorrect_field: 'description',
          incorrect_text: 'this description really "could** also" be** better',
          parser_error_message: 'expected token \'**\' but found \'\''
        },
        {
          incorrect_field: 'title',
          incorrect_text: 'totall bro*ken {{title',
          parser_error_message: 'expected plain text but found the symbol \'*\' which is reserved. Did you mean to escape it \'\\*\'?'
        }
      ],
      state_data: {
        content_release_id: 'fake-content-release-id',
        content_uuid: 'test-trainer-id',
        learn_language_alpha3: 'DEU',
        locale: 'en',
        trainer_position_in_lesson: 1
      },
      trainer: {
        description: 'this description really "could** also" be** better',
        dictate: false,
        interaction: 'fillin',
        puzzle_helper: false,
        title: 'totall bro*ken {{title',
        translation_visibility: 'partial',
        type: 'vocabulary'
      }
    }
  },

  // from vocabulary-fillin
  lessonItemErrorVocabularyFillin: {
    message: 'Invalid markup found in item (lesson)',
    data: {
      error_type: 'item level errors',
      errors: [
        {
          incorrect_field: 'display_language_text',
          incorrect_text: '**the hi{biscus**',
          parser_error_message: 'expected plain text but found end of markup'
        },
        {
          incorrect_field: 'learn_language_text',
          incorrect_text: 'er sah den Film "der gelbe ((*Hibiskus))" und war begeistert!',
          parser_error_message: 'expected plain text but found the symbol \'(\' which is reserved. Did you mean to escape it \'\\(\'?'
        },
        {
          incorrect_field: 'info_text',
          incorrect_text: 'Den **Hibiskus** gibt es)) in "vielen" Farben.',
          parser_error_message: 'expected plain text but found the symbol \')\' which is reserved. Did you mean to escape it \'\\)\'?'
        }
      ],
      state_data: {
        content_release_id: 'fake-content-release-id',
        content_uuid: 'test-trainer-id',
        learn_language_alpha3: 'DEU',
        locale: 'en',
        trainer_position_in_lesson: 1,
        item_position_in_trainer: 1
      },
      trainer: {
        description: 'this description really "could** also" be** better',
        dictate: false,
        interaction: 'fillin',
        puzzle_helper: false,
        title: 'totall bro*ken {{title',
        translation_visibility: 'partial',
        type: 'vocabulary'
      },
      item: {
        display_language_text: '**the hi{biscus**',
        id: '2171a03dec0c9696a3a906bbcfa7f362',
        learn_language_text: 'er sah den Film "der gelbe ((*Hibiskus))" und war begeistert!',
        type: 'phrase'
      }
    }
  },

  // from matching type 2
  lessonItem1ErrorMatchingType2: {
    message: 'Invalid markup found in item (lesson)',
    data: {
      error_type: 'item level errors',
      errors: [
        {
          incorrect_field: 'learn_language_text',
          incorrect_text: '**Obst "gibt es** in vielen" =_Farben',
          parser_error_message: `expected token '"' but found ''`
        },
        {
          incorrect_field: 'info_text',
          incorrect_text: 'rot, gelb, grün - musste ((alle)) essen',
          parser_error_message: 'expected plain text but found the symbol \'(\' which is reserved. Did you mean to escape it \'\\(\'?'
        }
      ],
      state_data: {
        item_position_in_trainer: 1,
        trainer_position_in_lesson: 2,
        locale: 'en',
        learn_language_alpha3: 'DEU',
        content_uuid: 'test-trainer-id',
        content_release_id: 'fake-content-release-id'
      },
      trainer: {
        type: 'matching',
        translation_visibility: 'partial',
        title: null,
        description: 'This is matching trainer - type 2',
        puzzle_helper: false,
        interaction: 'choose',
        dictate: false
      },
      item: {
        display_language_text: 'fruit exists in many colors',
        id: '162d2e047d4a2badc81e00aa574b15e0',
        learn_language_text: '**Obst "gibt es** in vielen" =_Farben',
        type: 'phrase'
      }
    }
  },

  // from matching type 2
  lessonItem2ErrorMatchingType2: {
    message: 'Invalid markup found in item (lesson)',
    data: {
      error_type: 'item level errors',
      errors: [
        {
          incorrect_field: 'display_language_text',
          incorrect_text: 'vegetables are (also)) colorful',
          parser_error_message: 'expected plain text but found the symbol \')\' which is reserved. Did you mean to escape it \'\\)\'?'
        },
        {
          incorrect_field: 'learn_language_text',
          incorrect_text: 'Gemüse ist auch =_*bunt',
          parser_error_message: 'expected plain text but found the symbol \'*\' which is reserved. Did you mean to escape it \'\\*\'?'
        }
      ],
      state_data: {
        item_position_in_trainer: 2,
        trainer_position_in_lesson: 2,
        locale: 'en',
        learn_language_alpha3: 'DEU',
        content_uuid: 'test-trainer-id',
        content_release_id: 'fake-content-release-id'
      },
      trainer: {
        type: 'matching',
        translation_visibility: 'partial',
        title: null,
        description: 'This is matching trainer - type 2',
        puzzle_helper: false,
        interaction: 'choose',
        dictate: false
      },
      item: {
        display_language_text: 'vegetables are (also)) colorful',
        id: '30b1059fa1c1a0578fdd61f4a9d45875',
        learn_language_text: 'Gemüse ist auch =_*bunt',
        type: 'phrase'
      }
    }
  }
};

export const defaultStateDataLessonTest =  {
  locale: 'en',
  learn_language_alpha3: 'DEU',
  content_uuid: 'test-trainer-id',
  content_release_id: 'fake-content-release-id'
};

export const defaultLessonLessonTest = {
  trainers: [
    { // trainer 1 has problems with item level fields
      description: 'If **an** evil clown catches ya, uh-oh, bad for you, bad for you!',
      title: 'This is the "evil" clown\'s labyrinth. Good luck.',
      type: 'vocabulary',
      interaction: 'write',
      puzzle_helper: false,
      dictate: false,
      item_groups: [{
        items: [ // item 1 all good
          {
            id: '12345',
            type: 'phrase',
            display_language_text: 'this is a foo',
            learn_language_text: 'das hier ist ein ((Foo))',
            info_text: undefined
          },
          { // item 2 problem with DL
            id: '23456',
            type: 'phrase',
            display_language_text: 'this **is "a** foo"',
            learn_language_text: 'das hier ist ein ((Foo))'
          },
          { // item 3 problem with LL
            id: '34567',
            type: 'phrase',
            display_language_text: 'this is a foo',
            learn_language_text: 'das **hier ist ein ((Foo))**',
            info_text: 'first go left, then right, then left again'
          },
          { // item 4 problem with info_text
            id: '45678',
            type: 'phrase',
            display_language_text: 'this is a foo',
            learn_language_text: 'das hier ist ein ((*Moo))',
            info_text: 'first go right, **then** *left and left'
          },
          { // item 5 problem with task item
            id: '56789',
            type: 'task',
            display_language_text: 'this is a foo',
            learn_language_text: 'das hier ist ein ((*Moo))'
          }
        ]
      }]
    },
    { // trainer 2 has problems with the trainer fields
      description: 'If you solve all the (*riddles), the sphinx will curtsy to you, {but kill you} anyway.',
      title: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
      type: 'vocabulary',
      interaction: 'choose',
      puzzle_helper: false,
      dictate: false,
      item_groups: [{
        items: [
          {
            id: 'abcde',
            type: 'phrase',
            display_language_text: 'this is a foo',
            learn_language_text: 'das hier ist ein ((Foo))'
          }
        ]
      }]
    }
  ]
};

export const defaultStateDataReviewTest = {
  content_uuid: 'REVIEW_DUE',
  learn_language_alpha3: 'DEU',
  locale: 'en'
};

export const defaultLessonReviewTest = {
  trainers: [{
    title: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
    type: 'flashcard',
    interaction: 'show',
    puzzle_helper: false,
    dictate: false,
    item_groups: [{
      items: [
        { // item 1 all good
          id: 'a',
          type: 'phrase',
          display_language_text: 'this is a foo',
          learn_language_text: 'das hier ist ein ((Foo))'
        },
        { // item 2 problem with DL
          id: 'b',
          type: 'phrase',
          display_language_text: 'this **is "a** foo"',
          learn_language_text: 'das hier ist ein ((Foo))'
        },
        { // item 3 problem with LL
          id: 'c',
          type: 'phrase',
          display_language_text: 'this is a foo',
          learn_language_text: 'das **hier ist ein ((Foo))**'
        },
        { // item 4 problem with info text
          id: 'd',
          type: 'phrase',
          display_language_text: 'this is a foo',
          learn_language_text: 'das hier ist ein ((Foo))',
          info_text: 'this is an (*info text))'
        },
        { // item 5 problem with task item
          id: 'e',
          type: 'task',
          display_language_text: 'this is a foo',
          learn_language_text: 'das hier ist ein ((Foo))'
        }
      ]
    }]
  }]
};

export const expectedParamsLessonTest = {
  expectedParamsError1: {
    message: 'Invalid markup found in item (lesson)',
    data: {
      error_type: 'item level errors',
      // trainer 1 - item 2: problem with DL
      errors: [
        {
          incorrect_field: 'display_language_text',
          incorrect_text: 'this **is "a** foo"',
          parser_error_message: 'expected plain text but found end of markup'
        }
      ],
      trainer: {
        description: 'If **an** evil clown catches ya, uh-oh, bad for you, bad for you!',
        title: 'This is the "evil" clown\'s labyrinth. Good luck.',
        type: 'vocabulary',
        interaction: 'write',
        puzzle_helper: false,
        dictate: false
      },
      state_data: {
        trainer_position_in_lesson: 1,
        item_position_in_trainer: 2,
        content_uuid: 'test-trainer-id',
        locale: 'en',
        learn_language_alpha3: 'DEU',
        content_release_id: 'fake-content-release-id'
      },
      item: {
        display_language_text: 'this **is "a** foo"',
        id: '23456',
        learn_language_text: 'das hier ist ein ((Foo))',
        type: 'phrase'
      }
    }
  },
  expectedParamsError2: {
    message: 'Invalid markup found in item (lesson)',
    data: {
      error_type: 'item level errors',
      // trainer 1 - item 3: problem with LL
      errors: [
        {
          incorrect_field: 'learn_language_text',
          incorrect_text: 'das **hier ist ein ((Foo))**',
          // eslint-disable-next-line max-len
          parser_error_message: 'expected plain text but found the symbol \'(\' which is reserved. Did you mean to escape it \'\\(\'?'
        }
      ],
      trainer: {
        description: 'If **an** evil clown catches ya, uh-oh, bad for you, bad for you!',
        title: 'This is the "evil" clown\'s labyrinth. Good luck.',
        type: 'vocabulary',
        interaction: 'write',
        puzzle_helper: false,
        dictate: false
      },
      state_data: {
        trainer_position_in_lesson: 1,
        item_position_in_trainer: 3,
        content_uuid: 'test-trainer-id',
        content_release_id: 'fake-content-release-id',
        locale: 'en',
        learn_language_alpha3: 'DEU'
      },
      item: {
        display_language_text: 'this is a foo',
        id: '34567',
        learn_language_text: 'das **hier ist ein ((Foo))**',
        type: 'phrase'
      }
    }
  },
  expectedParamsError3: {
    message: 'Invalid markup found in item (lesson)',
    data: {
      error_type: 'item level errors',
      // trainer 1 - item 4: problem with info_text
      errors: [
        {
          incorrect_field: 'info_text',
          incorrect_text: 'first go right, **then** *left and left',
          // eslint-disable-next-line max-len
          parser_error_message: 'expected plain text but found the symbol \'*\' which is reserved. Did you mean to escape it \'\\*\'?'
        }
      ],
      trainer: {
        type: 'vocabulary',
        interaction: 'write',
        puzzle_helper: false,
        dictate: false,
        description: 'If **an** evil clown catches ya, uh-oh, bad for you, bad for you!',
        title: 'This is the "evil" clown\'s labyrinth. Good luck.'
      },
      state_data: {
        trainer_position_in_lesson: 1,
        item_position_in_trainer: 4,
        content_uuid: 'test-trainer-id',
        content_release_id: 'fake-content-release-id',
        locale: 'en',
        learn_language_alpha3: 'DEU'
      },
      item: {
        display_language_text: 'this is a foo',
        id: '45678',
        learn_language_text: 'das hier ist ein ((*Moo))',
        type: 'phrase'
      }
    }
  },
  expectedParamsError4: {
    message: 'Invalid markup found in item (lesson)',
    data: {
      error_type: 'item level errors',
      // trainer 1 - item 4: problem with info_text
      errors: [
        {
          incorrect_field: 'learn_language_text',
          incorrect_text: 'das hier ist ein ((*Moo))',
          // eslint-disable-next-line max-len
          parser_error_message: 'expected plain text but found the symbol \'(\' which is reserved. Did you mean to escape it \'\\(\'?'
        }
      ],
      trainer: {
        type: 'vocabulary',
        interaction: 'write',
        puzzle_helper: false,
        dictate: false,
        description: 'If **an** evil clown catches ya, uh-oh, bad for you, bad for you!',
        title: 'This is the "evil" clown\'s labyrinth. Good luck.'
      },
      state_data: {
        trainer_position_in_lesson: 1,
        item_position_in_trainer: 5,
        content_uuid: 'test-trainer-id',
        content_release_id: 'fake-content-release-id',
        locale: 'en',
        learn_language_alpha3: 'DEU'
      },
      item: {
        display_language_text: 'this is a foo',
        id: '56789',
        learn_language_text: 'das hier ist ein ((*Moo))',
        type: 'task'
      }
    }
  },
  expectedParamsError5: {
    message: 'Invalid markup found in trainer (lesson)',
    data: {
      error_type: 'trainer level errors',
      // trainer 2 - problem with description and title
      errors: [
        {
          incorrect_field: 'description',
          incorrect_text: 'If you solve all the (*riddles), the sphinx will curtsy to you, {but kill you} anyway.',
          parser_error_message: 'expected plain text but found the symbol \'*\' which is reserved. Did you mean to escape it \'\\*\'?'
        },
        {
          incorrect_field: 'title',
          incorrect_text: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
          parser_error_message: 'expected token \'"\' but found \'\''
        }
      ],
      trainer: {
        type: 'vocabulary',
        interaction: 'choose',
        title: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
        description: 'If you solve all the (*riddles), the sphinx will curtsy to you, {but kill you} anyway.',
        puzzle_helper: false,
        dictate: false
      },
      state_data: {
        trainer_position_in_lesson: 2,
        content_uuid: 'test-trainer-id',
        locale: 'en',
        learn_language_alpha3: 'DEU',
        content_release_id: 'fake-content-release-id'
      }
    }
  }
};

export const expectedParamsReviewTest = {
  expectedParamsError1: {
    message: 'Invalid markup found in item (review)',
    data: {
      error_type: 'item level errors',
      // trainer 1 - item 2: problem with DL
      errors: [
        {
          incorrect_field: 'display_language_text',
          incorrect_text: 'this **is "a** foo"',
          parser_error_message: 'expected plain text but found end of markup'
        }
      ],
      trainer: {
        title: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
        type: 'flashcard',
        interaction: 'show',
        puzzle_helper: false,
        dictate: false
      },
      state_data: {
        content_uuid: 'REVIEW_DUE',
        locale: 'en',
        learn_language_alpha3: 'DEU'
      },
      item: {
        display_language_text: 'this **is "a** foo"',
        id: 'b',
        learn_language_text: 'das hier ist ein ((Foo))',
        type: 'phrase'
      }
    }
  },
  expectedParamsError2: {
    message: 'Invalid markup found in item (review)',
    data: {
      error_type: 'item level errors',
      // trainer 1 - item 3: problem with LL
      errors: [
        {
          incorrect_field: 'learn_language_text',
          incorrect_text: 'das **hier ist ein ((Foo))**',
          parser_error_message: 'expected plain text but found the symbol \'(\' which is reserved. Did you mean to escape it \'\\(\'?'
        }
      ],
      trainer: {
        title: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
        type: 'flashcard',
        interaction: 'show',
        puzzle_helper: false,
        dictate: false
      },
      state_data: {
        content_uuid: 'REVIEW_DUE',
        locale: 'en',
        learn_language_alpha3: 'DEU'
      },
      item: {
        display_language_text: 'this is a foo',
        id: 'c',
        learn_language_text: 'das **hier ist ein ((Foo))**',
        type: 'phrase'
      }
    }
  },
  expectedParamsError3: {
    message: 'Invalid markup found in item (review)',
    data: {
      error_type: 'item level errors',
      // trainer 1 - item 3: problem with info text
      errors: [
        {
          incorrect_field: 'info_text',
          incorrect_text: 'this is an (*info text))',
          parser_error_message: 'expected plain text but found the symbol \'*\' which is reserved. Did you mean to escape it \'\\*\'?'
        }
      ],
      trainer: {
        title: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
        type: 'flashcard',
        interaction: 'show',
        puzzle_helper: false,
        dictate: false
      },
      state_data: {
        content_uuid: 'REVIEW_DUE',
        locale: 'en',
        learn_language_alpha3: 'DEU'
      },
      item: {
        display_language_text: 'this is a foo',
        id: 'd',
        learn_language_text: 'das hier ist ein ((Foo))',
        type: 'phrase'
      }
    }
  },
  expectedParamsError4: {
    message: 'Invalid markup found in trainer (review)',
    data: {
      error_type: 'trainer level errors',
      // trainer 1 - problem with title
      errors: [
        {
          incorrect_field: 'title',
          incorrect_text: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
          parser_error_message: 'expected token \'"\' but found \'\''
        }
      ],
      trainer: {
        title: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
        type: 'flashcard',
        interaction: 'show',
        puzzle_helper: false,
        dictate: false
      },
      state_data: {
        content_uuid: 'REVIEW_DUE',
        locale: 'en',
        learn_language_alpha3: 'DEU'
      }
    }
  },
  expectedParamsError5: {
    message: 'Invalid markup found in item (review)',
    data: {
      error_type: 'item level errors',
      // trainer 1 - item 3: problem with info text
      errors: [
        {
          incorrect_field: 'learn_language_text',
          incorrect_text: 'das hier ist ein ((Foo))',
          parser_error_message: 'expected plain text but found the symbol \'(\' which is reserved. Did you mean to escape it \'\\(\'?'
        }
      ],
      trainer: {
        title: 'This is a **voca"bulary**" choicebuttons trainer with extra riddles.',
        type: 'flashcard',
        interaction: 'show',
        puzzle_helper: false,
        dictate: false
      },
      state_data: {
        content_uuid: 'REVIEW_DUE',
        locale: 'en',
        learn_language_alpha3: 'DEU'
      },
      item: {
        display_language_text: 'this is a foo',
        id: 'e',
        learn_language_text: 'das hier ist ein ((Foo))',
        type: 'task'
      }
    }
  }
};

/* eslint-enable camelcase, max-len */
