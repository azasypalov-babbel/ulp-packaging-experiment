/*
 * The refer-a-friend feature is part of the smart-surfaces project. This feature is disabled on the player demo so
 * that it does not interfere with existing integration tests run with cucumber. To test this feature in the demo,
 * add the query param is_refer_a_friend=on to the lesson URL. This enables the feature, but your user must still meet
 * the lesson completion and subscription requirements in order to see the feature.
 */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getMyEnv } from '@lessonnine/my.js';

import ReferAFriendModal from './ReferAFriendModal';
import * as trackerActions from '../../dux/tracker/actions';
import { lessonEventPayload } from '../../dux/tracker/events/lesson';
import * as contentSelectors from '../../dux/content/selectors';
import { smartSurfacesLocalStorage, HAS_SEEN_REFER_A_FRIEND_MODAL } from '../../lib/smartSurfaces';
import withTranslations from '../shared/withTranslations';
import { getUSCopy } from './helper';

const { geoData = {}, homeBaseUrl } = getMyEnv();

export const setHasSeenReferAFriend = () => smartSurfacesLocalStorage.set(HAS_SEEN_REFER_A_FRIEND_MODAL, true);

export const mapStateToProps = ({ content, session, lesson }, { translations }) => {
  const { locale } = session;
  const isUSUSer = geoData.countryCode3 === 'USA' && ['en', 'en_GB'].includes(locale);

  const talkableBaseUrl = isUSUSer ?
    `${homeBaseUrl}/invite` :
    '/refer-a-friend';
  const title = isUSUSer ? getUSCopy('title') : translations.title;
  const description = isUSUSer ? getUSCopy('description') : translations.description;

  return {
    content,
    session,
    lesson,
    talkableUrl: `${talkableBaseUrl}?traffic_source=lesson-end`,
    cta: translations.cta,
    title,
    description
  };
};

const mapDispatchToProps = {
  track: trackerActions.track
};

const getEventsPayload = (lesson, session, content) => {
  const basePayload = lessonEventPayload({ lesson, session });
  delete basePayload.content_version;

  return Object.assign(basePayload, {
    origin: 'lesson_end_screen',
    cta_method: 'popup',
    cta_target_action: 'RaF',
    course_uuid: contentSelectors.currentCourse(content, lesson.learningActivityId)?.id
  });
};

export const mergeProps = (stateProps, dispatchProps) => {
  const { lesson, session, content } = stateProps;

  const payload = getEventsPayload(lesson, session, content);
  const onRender = () => {
    setHasSeenReferAFriend();
    /* eslint-disable camelcase */
    dispatchProps.track({
      event: 'smart_surfaces:cta:shown',
      version: 1,
      payload
    });
    /* eslint-enable camelcase */
  };
  const onCtaClick = (closePortal) => {
    closePortal();
    /* eslint-disable camelcase */
    dispatchProps.track({
      event: 'smart_surfaces:cta:clicked',
      version: 1,
      payload
    });
    /* eslint-enable camelcase */
  };

  return {
    ...stateProps,
    onRender,
    onCtaClick
  };
};

const ReferAFriendModalContainer = compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(ReferAFriendModal);

ReferAFriendModalContainer.displayName = 'ReferAFriendModalContainer';

const getTranslations = (translate) => ({
  title: translate('smart_surfaces.lesson_end.raf_popup.title'),
  description: translate('smart_surfaces.lesson_end.raf_popup.body'),
  cta: translate('smart_surfaces.lesson_end.raf_popup.button_invite')
});

export default withTranslations(getTranslations)(ReferAFriendModalContainer);
