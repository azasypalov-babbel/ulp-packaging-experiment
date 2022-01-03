import * as contentSelectors from '../../../src/dux/content/selectors';

describe('Content Selectors', () => {
  const learningActivityId = 'ffe7401e36ea4d4f88bfa47661e5db97';
  const contentState = {
    data: {
      id: 'POR',
      name: 'Portuguese',
      unlocked: false,
      courseOverviews: [
        {
          id: 'b4aaa224fddb67950dd5e8a84ed3302e',
          courses: [
            {
              id: '3c3a779d5cfe8d985becdffec0eea15b',
              title: 'Beginner I - Course 1',
              description: 'Talking about your age',
              unlocked: false,
              active: false,
              completed: false,
              lessonsCount: 12,
              completedLessonsCount: 0,
              tags: [
                'progressive',
                'A1'
              ],
              lessons: [
                {
                  id: 'c59ee920b4fe47ecb54a65a8d562b38a',
                  completed: false
                },
                {
                  id: learningActivityId,
                  completed: false
                }
              ]
            },
            {
              id: 'd0ae9d178b044c58a803bc674ed4d1c7',
              title: 'Beginner I - Course 2',
              description: 'Talking about your daily routine',
              unlocked: false,
              active: false,
              completed: false,
              lessonsCount: 11,
              completedLessonsCount: 0,
              tags: [
                'progressive',
                'A1'
              ],
              lessons: [
                {
                  id: 'be9f9f58842b4198a4f45770cd03013e',
                  completed: false
                },
                {
                  id: '814af73a5f43446381a18b705c389ab5',
                  completed: false
                }
              ]
            }
          ]
        },
        {
          id: '06dcd3b415a995014909deeb55110316',
          title: 'Beginner II',
          description: 'Discover more words.',
          unlocked: false,
          tags: [
            'progressive'
          ],
          image: {
            id: '97e61583b8d24c76af460dc97eb97571'
          },
          courses: [
            {
              id: '84798a36f886f3943fd7a4cc9bb70dba',
              title: 'Beginner II - Course 1',
              description: 'Describing people',
              unlocked: false,
              active: false,
              completed: false,
              lessonsCount: 12,
              completedLessonsCount: 0,
              tags: [
                'progressive',
                'A2'
              ],
              lessons: [
                {
                  id: 'ffcc2d24af9e4fcead1bfdb3f72f4b31',
                  completed: false
                },
                {
                  id: '9fc6f0fdc9a64f68879b16fbc8f8fce4',
                  completed: false
                }
              ]
            }
          ]
        }
      ]
    }
  };

  describe('#contentSliceOfCurrentLesson', () => {
    describe('when state is not ready', () => {
      const contentState = {
        data: null
      };

      test('returns null', () => {
        expect(contentSelectors.contentSliceOfCurrentLesson(contentState, learningActivityId))
          .toEqual(null);
      });
    });

    describe('when state is ready', () => {
      const firstCourseOverview = contentState.data.courseOverviews[0];
      const firstCourseInFirstCourseOverview = firstCourseOverview.courses[0];

      const contentSlice = {
        courseOverviews: [
          {
            ...firstCourseOverview,
            courses: [firstCourseInFirstCourseOverview]
          }
        ]
      };

      test('returns slice of current content based on current lesson', () => {
        expect(contentSelectors.contentSliceOfCurrentLesson(contentState, learningActivityId))
          .toEqual(contentSlice);
      });
    });
  });

  describe('#lessons', () => {
    describe('when state is not ready', () => {
      const state = {
        data: null
      };

      test('returns null', () => {
        expect(contentSelectors.lessons(state)).toEqual(null);
      });
    });

    describe('when state is ready', () => {
      const lessons = [
        {
          id: 'c59ee920b4fe47ecb54a65a8d562b38a',
          completed: false
        },
        {
          id: learningActivityId,
          completed: false
        },
        {
          id: 'be9f9f58842b4198a4f45770cd03013e',
          completed: false
        },
        {
          id: '814af73a5f43446381a18b705c389ab5',
          completed: false
        },
        {
          id: 'ffcc2d24af9e4fcead1bfdb3f72f4b31',
          completed: false
        },
        {
          id: '9fc6f0fdc9a64f68879b16fbc8f8fce4',
          completed: false
        }
      ];

      test('returns flattened list of lesson objects', () => {
        expect(contentSelectors.lessons(contentState)).toEqual(lessons);
      });
    });
  });

  describe('#currentCourseOverview', () => {
    describe('when state is not ready', () => {
      const state = {
        data: null
      };

      test('it returns null', () => {
        expect(contentSelectors.currentCourseOverview(state, learningActivityId)).toEqual(null);
      });
    });

    describe('when state is ready', () => {
      test('it returns current courseOverview', () => {
        expect(contentSelectors.currentCourseOverview(contentState, learningActivityId))
          .toMatchObject({ id: 'b4aaa224fddb67950dd5e8a84ed3302e' });
      });
    });
  });

  describe('#currentCourse', () => {
    describe('when state is not ready', () => {
      const state = {
        data: null
      };

      test('it returns null', () => {
        expect(contentSelectors.currentCourse(state, learningActivityId)).toEqual(null);
      });
    });

    describe('when state is ready', () => {
      test('it returns current course', () => {
        expect(contentSelectors.currentCourse(contentState, learningActivityId))
          .toMatchObject({ id: '3c3a779d5cfe8d985becdffec0eea15b' });
      });
    });
  });

  describe('#currentLesson', () => {
    describe('when state is not ready', () => {
      const state = {
        data: null
      };

      test('it returns null', () => {
        expect(contentSelectors.currentLesson(state, learningActivityId)).toEqual(null);
      });
    });

    describe('when state is ready', () => {
      test('it returns current lesson', () => {
        expect(contentSelectors.currentLesson(contentState, learningActivityId))
          .toMatchObject({ id: 'ffe7401e36ea4d4f88bfa47661e5db97' });
      });
    });
  });

  describe('#isUnlocked', () => {
    describe('when state is not ready', () => {
      const state = { data: null };

      test('it returns null', () => {
        expect(contentSelectors.isUnlocked(state)).toEqual(null);
      });
    });

    describe('when unlocked', () => {
      const state = { data: { unlocked: true } };

      test('it returns true', () => {
        expect(contentSelectors.isUnlocked(state)).toEqual(true);
      });
    });

    describe('when locked', () => {
      const state = { data: { unlocked: false } };

      test('it returns false', () => {
        expect(contentSelectors.isUnlocked(state)).toEqual(false);
      });
    });
  });
});
