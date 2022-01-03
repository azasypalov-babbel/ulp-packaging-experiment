import { createSelector } from 'reselect';
import { flatten } from 'underscore';

const selectData = (state) => state.data;
const selectCourseOverviews = createSelector(
  selectData,
  (data) => data ? data.courseOverviews : null
);

export const isUnlocked = createSelector(
  selectData,
  (data) => data ? data.unlocked : null
);

export const lessons = createSelector(
  selectCourseOverviews,
  (courseOverviews) => {
    if (!courseOverviews) return null;

    return flatten(courseOverviews.map(({ courses }) =>
      courses.map(({ lessons }) => lessons)));
  });

// returns slice of content with only courseOverview, course and lesson
// related to given learningActivityId
export const contentSliceOfCurrentLesson = (state, learningActivityId) => {
  const courseOverviews = selectCourseOverviews(state);

  if (!courseOverviews) return null;

  let slice = [];

  for (let i = 0; i < courseOverviews.length; i += 1) {
    const course = courseOverviews[i].courses.find(({ lessons }) =>
      Boolean(lessons.find(({ id }) => id === learningActivityId)));

    if (course) {
      slice.push({ ...courseOverviews[i], courses: [course] });
      break;
    }
  }

  return {
    courseOverviews: slice
  };
};

export const currentCourseOverview = (state, learningActivityId) => {
  const contentSlice = contentSliceOfCurrentLesson(state, learningActivityId);

  if (!contentSlice || !contentSlice.courseOverviews) {
    return null;
  }

  return contentSlice.courseOverviews[0];
};

export const currentCourse = (state, learningActivityId) => {
  const courseOverview = currentCourseOverview(state, learningActivityId);

  if (!courseOverview) return null;

  return courseOverview.courses[0];
};

export const currentLesson = (state, learningActivityId) => {
  const courseLessons = lessons(state);

  if (!courseLessons) {
    return null;
  }

  return courseLessons.find(({ id }) => id === learningActivityId) || null;
};
