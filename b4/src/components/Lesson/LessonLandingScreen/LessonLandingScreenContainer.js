import { connect } from 'react-redux';
import { compose } from 'redux';
import { track } from '../../../dux/tracker/actions';
import * as contentSelectors from '../../../dux/content/selectors';

import LessonLandingScreen from './LessonLandingScreen';

const mapStateToProps = (state) => {
  const { content, lesson: { learningActivityId }, session } = state;
  const course = contentSelectors.currentCourse(content, learningActivityId);
  const lesson = contentSelectors.currentLesson(content, learningActivityId);

  return {
    course,
    lesson,
    learnLanguageAlpha3: session.learnLanguageAlpha3,
    locale: session.locale
  };
};

const mapDispatchToProps = {
  track
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(LessonLandingScreen);
